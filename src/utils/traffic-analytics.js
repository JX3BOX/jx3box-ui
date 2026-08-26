import {
    createAnalyticsCore,
    createCompositeRuleResolver,
    createEventQueue,
    createIdentity,
    createQueueStorage,
    createRemoteRuleResolver,
    createTrafficSink,
    defaultAckDecoder,
    installVueRouterAnalytics,
} from "@jx3box/jx3box-common/js/analytics.js";

const DEFAULT_CONFIG_ENDPOINT = "/api/cms/system/traffic/config";
const DEFAULT_BATCH_ENDPOINT = "/api/cms/system/traffic/visits/batch";
const DEFAULT_QUEUE_STORAGE_KEY = "jx3box:analytics:traffic:queue:v1";
const DEFAULT_BLOCK_STORAGE_KEY = "jx3box:analytics:traffic:block:v1";
const EMBEDDED_SURFACES = new Set(["app", "miniprogram", "pc_game", "mobile_game"]);

function safeReason(value, fallback) {
    const reason = String(value || fallback || "traffic_disabled")
        .trim()
        .slice(0, 128);
    return /^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(reason) ? reason : "traffic_disabled";
}

function safeStorage(storage) {
    if (!storage || typeof storage.getItem !== "function") return null;
    return storage;
}

function normalizeRecipientDomain(domain, surface) {
    const normalizedSurface = String(surface || "")
        .trim()
        .toLowerCase();
    if (EMBEDDED_SURFACES.has(normalizedSurface)) return "embedded";
    const normalizedDomain = String(domain || "")
        .trim()
        .toLowerCase()
        .slice(0, 253);
    return /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(normalizedDomain) ? normalizedDomain : "";
}

function createBlockStorage(storage, key, now) {
    const target = safeStorage(storage);
    let loaded = false;
    let currentBlock = null;

    function read() {
        if (loaded) return currentBlock ? Object.assign({}, currentBlock) : null;
        loaded = true;
        if (!target) return null;
        try {
            const value = JSON.parse(target.getItem(key) || "null");
            if (!value || value.blocked !== true) return null;
            currentBlock = {
                reason: safeReason(value.reason),
                clear: true,
            };
            return Object.assign({}, currentBlock);
        } catch (error) {
            return null;
        }
    }

    function write(reason) {
        const block = {
            blocked: true,
            reason: safeReason(reason),
            blocked_at: typeof now === "function" ? now() : Date.now(),
        };
        loaded = true;
        currentBlock = { reason: block.reason, clear: true };
        if (target) {
            try {
                target.setItem(key, JSON.stringify(block));
            } catch (error) {
                // Privacy controls remain effective in memory when storage is unavailable.
            }
        }
        return Object.assign({}, currentBlock);
    }

    function clear() {
        loaded = true;
        currentBlock = null;
        if (!target) return;
        try {
            target.removeItem(key);
        } catch (error) {
            // Best effort only. The current queue is still explicitly unblocked below.
        }
    }

    return { clear, read, write };
}

function normalizeTrafficPermission(value) {
    if (value === true) return { known: true, allow: true };
    if (value === false) {
        return { known: true, allow: false, reason: "traffic_disabled" };
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return { known: false, allow: false };
    }

    const source = value.data && typeof value.data === "object" ? value.data : value;
    const rawBlock = source.blocked || source.block;
    const blockReason = typeof rawBlock === "string" ? rawBlock : rawBlock && (rawBlock.reason || rawBlock.code);
    if (blockReason || source.is_robot === true) {
        return {
            known: true,
            allow: false,
            reason: safeReason(blockReason || "robot"),
        };
    }

    const allowed =
        typeof source.traffic_allowed === "boolean"
            ? source.traffic_allowed
            : typeof source.allowed === "boolean"
            ? source.allowed
            : source.allow;
    if (allowed === true) return { known: true, allow: true };
    if (allowed === false) {
        return {
            known: true,
            allow: false,
            reason: safeReason(
                source.collection_blocked_reason || source.block_reason || source.reason || "traffic_disabled"
            ),
        };
    }
    return { known: false, allow: false };
}

/**
 * Creates an inert, headless Traffic collector. Hosts must explicitly call
 * `init()` after their router and heartbeat permission are ready.
 */
function createJx3boxTrafficAnalytics(options) {
    const settings = options || {};
    const runtime = settings.runtime || (typeof window !== "undefined" ? window : {});
    const now = typeof settings.now === "function" ? settings.now : Date.now;
    const recipientDomain = normalizeRecipientDomain(
        settings.domain || (runtime.location && runtime.location.hostname),
        settings.surface
    );
    const blockStorage = createBlockStorage(
        settings.blockStorage || runtime.localStorage,
        settings.blockStorageKey || DEFAULT_BLOCK_STORAGE_KEY,
        now
    );
    const permissionProvider =
        settings.resolveTrafficPermission !== undefined ? settings.resolveTrafficPermission : settings.trafficAllowed;
    let hasPermissionOverride = false;
    let permissionOverride;
    let client = null;
    let queue = null;
    let routerHandle = null;
    let initPromise = null;
    let initialized = false;
    let destroyed = false;

    function resolvePermissionInput() {
        if (hasPermissionOverride) return Promise.resolve(permissionOverride);
        if (typeof permissionProvider === "function") {
            try {
                return Promise.resolve(permissionProvider()).catch(function () {
                    return undefined;
                });
            } catch (error) {
                return Promise.resolve(undefined);
            }
        }
        return Promise.resolve(permissionProvider);
    }

    function persistAndBlock(reason) {
        const block = blockStorage.write(reason);
        if (client) client.block(block, { clear: true, cancelInflight: true });
        return block;
    }

    function applyPermission(value) {
        const permission = normalizeTrafficPermission(value);
        if (!permission.known) {
            // Unknown heartbeat/consent state is a transient fail-closed pause.
            // Keep already-sanitized Journal entries for a later explicit allow,
            // but cancel any request that may have started under an older grant.
            if (client) {
                client.block(
                    { reason: "traffic_permission_unknown", clear: false },
                    {
                        clear: false,
                        cancelInflight: true,
                    }
                );
            }
            return permission;
        }
        if (!permission.allow) {
            persistAndBlock(permission.reason);
            return permission;
        }
        blockStorage.clear();
        if (client) client.unblock();
        return permission;
    }

    async function guardBeforeFlush(context) {
        const permission = applyPermission(await resolvePermissionInput());
        if (!permission.known) return { allow: false };
        if (!permission.allow) {
            return {
                blocked: { reason: permission.reason, clear: true },
                clear: true,
                cancelInflight: true,
            };
        }
        if (typeof settings.beforeFlush !== "function") return { allow: true };
        const result = await settings.beforeFlush(context);
        if (result && typeof result === "object" && (result.blocked || result.block)) {
            const blocked = normalizeTrafficPermission(result);
            if (!blocked.allow) persistAndBlock(blocked.reason);
        }
        return result;
    }

    function buildClient() {
        if (!settings.router || typeof settings.router.afterEach !== "function") {
            throw new Error("jx3box traffic analytics requires a Vue Router instance");
        }
        if (!settings.project || !settings.surface || !settings.client || !settings.gameClient) {
            throw new Error("jx3box traffic analytics requires project, surface, client and gameClient");
        }

        const identity =
            settings.identity ||
            createIdentity({
                runtime,
                now,
                instanceId: settings.instanceId,
                sessionNamespace: settings.sessionNamespace || "analytics",
                sessionTimeoutMs: settings.sessionTimeoutMs,
            });
        const baseAckDecoder = typeof settings.ackDecoder === "function" ? settings.ackDecoder : defaultAckDecoder;
        const trafficSink = createTrafficSink({
            runtime,
            endpoint: settings.batchEndpoint || DEFAULT_BATCH_ENDPOINT,
            fetch: settings.fetch,
            navigator: settings.navigator,
            credentials: settings.credentials,
            headersProvider: settings.headersProvider,
            ackDecoder: function (payload, context) {
                const decoded = baseAckDecoder(payload, context);
                if (decoded && typeof decoded === "object" && (decoded.blocked || decoded.block)) {
                    const blocked = normalizeTrafficPermission(decoded);
                    if (!blocked.allow) blockStorage.write(blocked.reason);
                }
                return decoded;
            },
            retryPolicy: settings.retryPolicy,
        });
        const storage = createQueueStorage({
            storage: settings.queueStorage || runtime.localStorage,
            key: settings.queueStorageKey || DEFAULT_QUEUE_STORAGE_KEY,
            maxEvents: settings.maxPersistedEvents || 200,
            maxBytes: settings.maxPersistedBytes || 256 * 1024,
            ttlMs: settings.persistTtlMs || 7 * 24 * 60 * 60 * 1000,
            now,
        });
        queue = createEventQueue({
            runtime,
            storage,
            sinks: [trafficSink],
            // A v1 entry has no sink ownership. It belongs to legacy Tracking;
            // since this adapter deliberately has no Tracking sink, it is dropped.
            legacySinkKey: "tracking",
            beforeFlush: guardBeforeFlush,
            batchSize: settings.batchSize || 20,
            maxEvents: settings.maxQueueEvents || 200,
            maxBatchBytes: settings.maxBatchBytes || 60 * 1024,
            flushIntervalMs: settings.flushIntervalMs || 10000,
            maxRetries: settings.maxRetries === undefined ? 5 : settings.maxRetries,
            retryBaseMs: settings.retryBaseMs || 1000,
            now,
            random: settings.random,
            setTimeout: settings.queueSetTimeout,
            clearTimeout: settings.queueClearTimeout,
            onDrop: settings.onDrop,
        });
        const trafficRuleResolver =
            settings.trafficRuleResolver ||
            createRemoteRuleResolver({
                runtime,
                endpoint: settings.configEndpoint || DEFAULT_CONFIG_ENDPOINT,
                fetch: settings.fetch,
                credentials: settings.credentials,
            });
        const compositeRuleResolver = createCompositeRuleResolver({ traffic: trafficRuleResolver });
        const ruleResolver = {
            resolve: async function (input) {
                const resolved = await compositeRuleResolver.resolve(
                    Object.assign({}, input || {}, { domain: recipientDomain })
                );
                return resolved ? Object.assign({}, resolved, { domain: recipientDomain }) : null;
            },
        };
        client = createAnalyticsCore({
            runtime,
            identity,
            queue,
            ruleResolver,
            now,
            product: settings.product || "jx3box",
            project: settings.project,
            client: settings.client,
            surface: settings.surface,
            gameClient: settings.gameClient,
            platform: settings.platform,
            channel: settings.channel,
            appVersion: settings.appVersion,
            appBuild: settings.appBuild,
            webVersion: settings.webVersion,
            displayMode: settings.displayMode || "browser",
            sampleSalt: settings.sampleSalt || "jx3box-analytics-v2",
        });
    }

    async function init() {
        if (destroyed) throw new Error("jx3box traffic analytics has been destroyed");
        if (initialized) return api;
        if (initPromise) return initPromise;
        initPromise = Promise.resolve()
            .then(async function () {
                buildClient();
                const persistedBlock = blockStorage.read();
                if (persistedBlock) client.block(persistedBlock, { clear: true, cancelInflight: true });
                const permission = await resolvePermissionInput();
                if (destroyed) {
                    if (client) client.destroy();
                    throw new Error("jx3box traffic analytics has been destroyed");
                }
                applyPermission(permission);
                routerHandle = installVueRouterAnalytics(client, settings.router, {
                    runtime,
                    captureInitial: settings.captureInitial !== false,
                    flushBeaconOnPagehide: settings.flushBeaconOnPagehide !== false,
                    project: settings.project,
                    product: settings.product || "jx3box",
                    client: settings.client,
                    surface: settings.surface,
                    gameClient: settings.gameClient,
                    domain: settings.domain,
                });
                initialized = true;
                return api;
            })
            .catch(function (error) {
                if (routerHandle) routerHandle.destroy();
                else if (client) client.destroy();
                routerHandle = null;
                client = null;
                queue = null;
                initPromise = null;
                throw error;
            });
        return initPromise;
    }

    function setTrafficPermission(value) {
        hasPermissionOverride = true;
        permissionOverride = value;
        if (destroyed) return normalizeTrafficPermission(value);
        return applyPermission(value);
    }

    function block(reason) {
        return setTrafficPermission({
            traffic_allowed: false,
            collection_blocked_reason: safeReason(reason, "host_block"),
        });
    }

    function unblock() {
        return setTrafficPermission({ traffic_allowed: true });
    }

    function getState() {
        return {
            initialized,
            destroyed,
            permission_block: blockStorage.read(),
            analytics: client ? client.getState() : null,
        };
    }

    function destroy() {
        if (destroyed) return;
        destroyed = true;
        if (routerHandle) routerHandle.destroy();
        if (client) client.destroy();
        routerHandle = null;
        client = null;
        queue = null;
        initialized = false;
    }

    const api = {
        init,
        destroy,
        block,
        unblock,
        setTrafficPermission,
        getState,
        flush: function (optionsForFlush) {
            return client ? client.flush(optionsForFlush) : Promise.resolve({ sent: 0, pending: 0 });
        },
        flushBeacon: function (optionsForFlush) {
            return client ? client.flushBeacon(optionsForFlush) : false;
        },
        finalize: function (optionsForFinalize) {
            return client ? client.finalizePage(optionsForFinalize) : false;
        },
        clear: function (reason) {
            return client ? client.clear(reason || "host_clear") : 0;
        },
        cancelInflight: function (reason) {
            return client ? client.cancelInflight(reason || "host_cancel") : 0;
        },
    };
    return api;
}

export {
    DEFAULT_BATCH_ENDPOINT,
    DEFAULT_BLOCK_STORAGE_KEY,
    DEFAULT_CONFIG_ENDPOINT,
    DEFAULT_QUEUE_STORAGE_KEY,
    createJx3boxTrafficAnalytics,
    normalizeRecipientDomain,
    normalizeTrafficPermission,
};
