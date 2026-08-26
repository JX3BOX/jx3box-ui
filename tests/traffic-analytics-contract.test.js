const path = require("path");

require("@babel/register")({
    babelrc: false,
    configFile: false,
    extensions: [".js"],
    ignore: [
        function (filename) {
            return (
                filename.includes(`${path.sep}node_modules${path.sep}`) &&
                !filename.includes(`${path.sep}@jx3box${path.sep}jx3box-common${path.sep}`)
            );
        },
    ],
    presets: [[require.resolve("@babel/preset-env"), { modules: "commonjs", targets: { node: "current" } }]],
});

const assert = require("node:assert/strict");
const { test } = require("node:test");
const fixture = require("@jx3box/jx3box-common/docs/fixtures/analytics-dual-sink-v1.json");
const SHARED_ANALYTICS_QUEUE_STORAGE_KEY = "jx3box:analytics:queue:v1";
const { createEventQueue, createQueueStorage, createTrafficSink } = require("@jx3box/jx3box-common/js/analytics.js");
const {
    DEFAULT_BLOCK_STORAGE_KEY,
    DEFAULT_QUEUE_STORAGE_KEY,
    createJx3boxTrafficAnalytics,
    normalizeRecipientDomain,
    normalizeTrafficPermission,
} = require("../src/utils/traffic-analytics.js");

function createMemoryStorage(initial) {
    const values = new Map(Object.entries(initial || {}));
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
        removeItem(key) {
            values.delete(key);
        },
        snapshot() {
            return Object.fromEntries(values.entries());
        },
    };
}

function createNoopTimers() {
    let nextId = 0;
    const pending = new Map();
    return {
        setTimeout(callback, delay) {
            nextId += 1;
            pending.set(nextId, { callback, delay });
            return nextId;
        },
        clearTimeout(id) {
            pending.delete(id);
        },
    };
}

function createRouter() {
    let afterEachHandler = null;
    const currentRoute = { value: null };
    return {
        currentRoute,
        isReady() {
            return Promise.resolve();
        },
        afterEach(handler) {
            afterEachHandler = handler;
            return function () {
                afterEachHandler = null;
            };
        },
        navigate(to, from) {
            currentRoute.value = to;
            if (afterEachHandler) afterEachHandler(to, from || null, null);
        },
        hasOwner() {
            return !!afterEachHandler;
        },
    };
}

function createRuntime(options) {
    const settings = options || {};
    const listeners = new Map();
    const ids = (settings.ids || []).slice();
    return {
        localStorage: settings.localStorage || createMemoryStorage(),
        sessionStorage: settings.sessionStorage || createMemoryStorage(),
        location: {
            hostname: "www.jx3box.com",
            href: "https://www.jx3box.com/index?section=home#private",
        },
        document: {
            referrer: "https://ref.example/private?q=secret#hidden",
        },
        navigator: settings.navigator || {
            sendBeacon() {
                return true;
            },
        },
        crypto: {
            randomUUID() {
                return ids.shift() || `generated-${Date.now()}-${Math.random()}`;
            },
        },
        fetch: settings.fetch,
        AbortController,
        setTimeout,
        clearTimeout,
        addEventListener(name, handler) {
            if (!listeners.has(name)) listeners.set(name, new Set());
            listeners.get(name).add(handler);
        },
        removeEventListener(name, handler) {
            if (listeners.has(name)) listeners.get(name).delete(handler);
        },
        listenerCount(name) {
            return listeners.has(name) ? listeners.get(name).size : 0;
        },
    };
}

function createResponse(status, payload, headers) {
    const values = Object.assign({}, headers || {});
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: {
            get(name) {
                const match = Object.keys(values).find((key) => key.toLowerCase() === String(name).toLowerCase());
                return match ? values[match] : null;
            },
        },
        async json() {
            return payload;
        },
    };
}

function createIdentity() {
    let sequence = 0;
    return {
        getInstanceId() {
            return fixture.canonical_event.instance_id;
        },
        getSessionId() {
            return fixture.canonical_event.session_id;
        },
        nextEvent() {
            sequence += 1;
            return {
                instance_id: fixture.canonical_event.instance_id,
                session_id: fixture.canonical_event.session_id,
                sequence_no: sequence,
                session_rotated: false,
            };
        },
    };
}

function waitForRouter() {
    return new Promise((resolve) => setTimeout(resolve, 5));
}

function walkKeys(value, output) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach((key) => {
        output.push(key);
        walkKeys(value[key], output);
    });
}

test("permission normalization understands heartbeat allow and persistent block states", () => {
    assert.deepEqual(normalizeTrafficPermission({ traffic_allowed: true }), { known: true, allow: true });
    assert.deepEqual(normalizeTrafficPermission({ is_robot: true }), {
        known: true,
        allow: false,
        reason: "robot",
    });
    assert.deepEqual(
        normalizeTrafficPermission({
            traffic_allowed: false,
            collection_blocked_reason: "robot",
        }),
        {
            known: true,
            allow: false,
            reason: "robot",
        }
    );
    assert.deepEqual(normalizeTrafficPermission(undefined), { known: false, allow: false });
});

test("recipient domains preserve web hosts and normalize embedded surfaces", () => {
    assert.equal(normalizeRecipientDomain("WWW.JX3BOX.COM", "pc_web"), "www.jx3box.com");
    assert.equal(normalizeRecipientDomain("origin.jx3box.com", "pc_web"), "origin.jx3box.com");
    assert.equal(normalizeRecipientDomain("localhost", "pc_game"), "embedded");
    assert.equal(normalizeRecipientDomain("https://www.jx3box.com/private", "pc_web"), "");
});

test("headless opt-in emits the official Traffic fixture once and honors per-id ACK", async () => {
    const requests = [];
    const timers = createNoopTimers();
    let currentTime = Date.parse(fixture.canonical_event.occurred_at);
    const runtime = createRuntime({
        ids: [fixture.canonical_event.page_view_id, fixture.canonical_event.event_id],
        async fetch(url, options) {
            requests.push({ url, options: options || {} });
            if (String(url).startsWith("/api/cms/system/traffic/config")) {
                return createResponse(200, {
                    code: 0,
                    data: {
                        enabled: true,
                        page_key: fixture.canonical_event.page_key,
                        route_pattern: fixture.canonical_event.route_pattern,
                        layout_version: fixture.canonical_event.layout_version,
                        sample_rate: 1,
                        event_types: ["page_view"],
                        require_public_target: true,
                        query_targets: [
                            {
                                query_key: "section",
                                target_type: "section",
                                validator: "bounded_slug",
                                required: true,
                            },
                        ],
                        rule_version: "traffic-2026-08-26",
                    },
                });
            }
            const envelope = JSON.parse(options.body);
            return createResponse(200, {
                code: 0,
                data: {
                    items: [{ event_id: envelope.events[0].event_id, status: "duplicate" }],
                    blocked: null,
                    rule_version: fixture.traffic.response.data.rule_version,
                },
            });
        },
    });
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime,
        router,
        captureInitial: false,
        identity: createIdentity(),
        now: () => currentTime,
        project: fixture.canonical_event.project,
        product: fixture.canonical_event.product,
        client: fixture.canonical_event.client,
        surface: fixture.canonical_event.surface,
        gameClient: fixture.canonical_event.game_client,
        platform: fixture.canonical_event.platform,
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });

    assert.equal(traffic.getState().initialized, false);
    assert.equal(requests.length, 0, "importing and creating the adapter must be inert");
    await traffic.init();
    await traffic.init();
    assert.equal(router.hasOwner(), true);
    assert.equal(runtime.listenerCount("pagehide"), 1);
    assert.equal(requests.length, 0, "init without an initial route must not synthesize a page view");

    router.navigate({
        name: fixture.canonical_event.route_name,
        matched: [{ path: fixture.canonical_event.route_pattern }],
        meta: {
            analytics: {
                page_key: fixture.canonical_event.page_key,
                layout_version: fixture.canonical_event.layout_version,
            },
        },
        params: {},
        query: { section: "home", secret: "must-stay-local" },
        hash: "#private",
        fullPath: "/index?section=home&secret=must-stay-local#private",
    });
    await waitForRouter();

    assert.equal(requests.length, 1, "navigation should request config but defer Traffic until finalization");
    assert.match(requests[0].url, /^\/api\/cms\/system\/traffic\/config\?/);
    assert.equal(requests[0].url.includes("must-stay-local"), false);
    assert.equal(requests[0].url.includes("section=home"), false);
    assert.equal(traffic.getState().analytics.queue.pending, 1);
    assert.equal(traffic.getState().analytics.queue.entries[0].deliveries.traffic.state, "deferred");

    currentTime += fixture.traffic_finalization.duration_ms;
    assert.equal(traffic.finalize({ is_exit: true, reason: "contract_test" }), true);
    const flushResult = await traffic.flush({ reason: "contract_test" });
    assert.equal(flushResult.sent, 1);
    assert.equal(requests.length, 2);
    const envelope = JSON.parse(requests[1].options.body);
    const expectedEnvelope = JSON.parse(JSON.stringify(fixture.traffic.request));
    expectedEnvelope.events[0].event_id = envelope.events[0].event_id;
    assert.deepEqual(envelope, expectedEnvelope);
    const payloadKeys = [];
    walkKeys(envelope, payloadKeys);
    fixture.privacy_assertions.payload_fields_that_must_be_absent.forEach((key) => {
        assert.equal(payloadKeys.includes(key), false, `${key} must stay out of Traffic payloads`);
    });
    assert.equal(traffic.getState().analytics.queue.pending, 0, "duplicate ACK is terminal per event id");
    assert.equal(
        requests.some((request) => request.url.includes("/system/stat/tracking")),
        false
    );

    traffic.destroy();
    assert.equal(router.hasOwner(), false);
    assert.equal(runtime.listenerCount("pagehide"), 0);
});

test("remote Config failure is fail-closed and creates no Traffic journal entry", async () => {
    const requests = [];
    const timers = createNoopTimers();
    const runtime = createRuntime({
        async fetch(url) {
            requests.push(url);
            return createResponse(503, { code: 503 });
        },
    });
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime,
        router,
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await traffic.init();
    router.navigate({
        name: "index",
        matched: [{ path: "/index" }],
        meta: { analytics: { page_key: "index.home" } },
        params: {},
        query: {},
    });
    await waitForRouter();
    assert.equal(requests.length, 1);
    assert.equal(traffic.getState().analytics.active, false);
    assert.equal(traffic.getState().analytics.queue.pending, 0);
    traffic.destroy();
});

test("embedded hosts use the backend recipient domain in both Config and envelope", async () => {
    const requests = [];
    const timers = createNoopTimers();
    const runtime = createRuntime({
        async fetch(url, options) {
            requests.push({ url, options: options || {} });
            if (String(url).startsWith("/api/cms/system/traffic/config")) {
                return createResponse(200, {
                    code: 0,
                    data: {
                        enabled: true,
                        page_key: "game.home",
                        route_pattern: "/game",
                        sample_rate: 1,
                        event_types: ["page_view"],
                        rule_version: "traffic-embedded-domain",
                    },
                });
            }
            const envelope = JSON.parse(options.body);
            return createResponse(200, {
                code: 0,
                data: {
                    items: envelope.events.map((event) => ({ event_id: event.event_id, status: "accepted" })),
                },
            });
        },
    });
    runtime.location.hostname = "localhost";
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime,
        router,
        captureInitial: false,
        project: "game",
        client: "pc_game",
        surface: "pc_game",
        gameClient: "std",
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await traffic.init();
    router.navigate({
        name: "game",
        matched: [{ path: "/game" }],
        meta: { analytics: { page_key: "game.home" } },
        params: {},
        query: {},
    });
    await waitForRouter();
    traffic.finalize({ is_exit: true, reason: "embedded_test" });
    await traffic.flush({ reason: "embedded_test" });

    assert.match(requests[0].url, /(?:\?|&)domain=embedded(?:&|$)/);
    const envelope = JSON.parse(requests[1].options.body);
    assert.equal(envelope.domain, "embedded");
    assert.equal(envelope.surface, "pc_game");
    traffic.destroy();
});

test("an explicit unknown permission pauses in memory until the host unblocks", async () => {
    const requests = [];
    const timers = createNoopTimers();
    const localStorage = createMemoryStorage();
    const runtime = createRuntime({
        localStorage,
        async fetch(url, options) {
            requests.push({ url, options: options || {} });
            if (String(url).startsWith("/api/cms/system/traffic/config")) {
                return createResponse(200, {
                    code: 0,
                    data: {
                        enabled: true,
                        page_key: "index.home",
                        route_pattern: "/index",
                        sample_rate: 1,
                        event_types: ["page_view"],
                        rule_version: "traffic-permission-transition",
                    },
                });
            }
            const envelope = JSON.parse(options.body);
            return createResponse(200, {
                code: 0,
                data: {
                    items: envelope.events.map((event) => ({
                        event_id: event.event_id,
                        status: "accepted",
                    })),
                },
            });
        },
    });
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime,
        router,
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await traffic.init();
    router.navigate({
        name: "index",
        matched: [{ path: "/index" }],
        meta: { analytics: { page_key: "index.home" } },
        params: {},
        query: {},
    });
    await waitForRouter();
    traffic.finalize({ is_exit: true, reason: "permission_test" });
    assert.equal(traffic.getState().analytics.queue.pending, 1);

    assert.deepEqual(traffic.setTrafficPermission(undefined), { known: false, allow: false });
    assert.equal(traffic.getState().analytics.queue.blocked, true);
    assert.equal(traffic.getState().analytics.queue.blockReason.reason, "traffic_permission_unknown");
    assert.equal(traffic.getState().analytics.queue.pending, 1, "unknown state retains sanitized Journal data");
    assert.equal(
        localStorage.getItem(DEFAULT_BLOCK_STORAGE_KEY),
        null,
        "unknown state is not a persistent device block"
    );
    await traffic.flush({ reason: "permission_unknown" });
    assert.equal(requests.filter((request) => request.url === "/api/cms/system/traffic/visits/batch").length, 0);

    assert.deepEqual(traffic.unblock(), { known: true, allow: true });
    assert.equal(traffic.getState().analytics.queue.blocked, false);
    await traffic.flush({ reason: "permission_restored" });
    assert.equal(traffic.getState().analytics.queue.pending, 0);

    traffic.block("host_privacy_disabled");
    assert.equal(traffic.getState().analytics.queue.blocked, true);
    assert.equal(JSON.parse(localStorage.getItem(DEFAULT_BLOCK_STORAGE_KEY)).reason, "host_privacy_disabled");
    traffic.destroy();
});

test("destroy during asynchronous init releases resources without installing a Router owner", async () => {
    const timers = createNoopTimers();
    let resolvePermission;
    const permission = new Promise((resolve) => {
        resolvePermission = resolve;
    });
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime: createRuntime(),
        router,
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        resolveTrafficPermission: () => permission,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    const initializing = traffic.init();
    await new Promise((resolve) => setImmediate(resolve));
    traffic.destroy();
    resolvePermission({ traffic_allowed: true });
    await assert.rejects(initializing, /has been destroyed/);
    assert.equal(router.hasOwner(), false);
    assert.equal(traffic.getState().destroyed, true);
});

test("two adapters cannot own the same Router and the first owner remains intact", async () => {
    const timers = createNoopTimers();
    const router = createRouter();
    const commonOptions = {
        runtime: createRuntime(),
        router,
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    };
    const first = createJx3boxTrafficAnalytics(commonOptions);
    const second = createJx3boxTrafficAnalytics(commonOptions);
    await first.init();
    await assert.rejects(second.init(), /router owner already installed/);
    assert.equal(router.hasOwner(), true);
    assert.equal(first.getState().analytics.navigationOwner, "router");
    second.destroy();
    first.destroy();
    assert.equal(router.hasOwner(), false);
});

test("409 and 429 never ACK; retry keeps the same id until an explicit ACK", async () => {
    const timers = createNoopTimers();
    const storage = createMemoryStorage();
    const statuses = [409, 429, 200];
    let currentTime = Date.parse(fixture.canonical_event.occurred_at);
    const sink = createTrafficSink({
        endpoint: "/traffic",
        runtime: {
            async fetch() {
                const status = statuses.shift();
                if (status === 409) {
                    return createResponse(status, {
                        code: 0,
                        data: { items: [{ event_id: fixture.canonical_event.event_id, status: "accepted" }] },
                    });
                }
                if (status === 429) {
                    return createResponse(status, { code: 429 }, { "Retry-After": "2" });
                }
                return createResponse(status, {
                    code: 0,
                    data: { items: [{ event_id: fixture.canonical_event.event_id, status: "accepted" }] },
                });
            },
            navigator: {},
            AbortController,
        },
    });
    const queue = createEventQueue({
        runtime: { AbortController },
        storage: createQueueStorage({ storage, key: "retry", now: () => currentTime }),
        sinks: [sink],
        legacySinkKey: "tracking",
        beforeFlush: () => ({ allow: true }),
        now: () => currentTime,
        random: () => 0.5,
        setTimeout: timers.setTimeout,
        clearTimeout: timers.clearTimeout,
    });
    assert.equal(queue.enqueue(fixture.canonical_event, { sinkKeys: ["traffic"] }), true);
    assert.equal(queue.finalize(fixture.canonical_event.event_id, "traffic", fixture.traffic_finalization), true);

    await queue.flush({ reason: "409" });
    let delivery = queue.getState().entries[0].deliveries.traffic;
    assert.equal(delivery.state, "retry");
    assert.equal(delivery.attempts, 1);
    assert.equal(queue.getState().eventIds[0], fixture.canonical_event.event_id);

    currentTime += 10;
    await queue.flush({ reason: "429" });
    delivery = queue.getState().entries[0].deliveries.traffic;
    assert.equal(delivery.state, "retry");
    assert.equal(delivery.attempts, 2);
    assert.equal(delivery.retry_at, currentTime + 2000);

    const requestsBeforeRetryAt = statuses.length;
    await queue.flush({ reason: "too_early", respectRetryAt: true });
    assert.equal(statuses.length, requestsBeforeRetryAt, "respectRetryAt must not send before the server delay");
    currentTime = delivery.retry_at;
    await queue.flush({ reason: "ack", respectRetryAt: true });
    assert.equal(queue.getState().pending, 0);
    assert.equal(statuses.length, 0);
    queue.destroy();
});

test("partial per-id ACK removes only terminal deliveries and retries the missing id", async () => {
    const timers = createNoopTimers();
    const storage = createMemoryStorage();
    const firstEvent = Object.assign({}, fixture.canonical_event, {
        event_id: `${fixture.canonical_event.event_id}-first`,
        sequence_no: 1,
    });
    const secondEvent = Object.assign({}, fixture.canonical_event, {
        event_id: `${fixture.canonical_event.event_id}-second`,
        previous_event_id: firstEvent.event_id,
        sequence_no: 2,
    });
    let requestCount = 0;
    const sink = createTrafficSink({
        endpoint: "/traffic",
        runtime: {
            async fetch(url, options) {
                assert.equal(url, "/traffic");
                const envelope = JSON.parse(options.body);
                requestCount += 1;
                return createResponse(200, {
                    code: 0,
                    data: {
                        items:
                            requestCount === 1
                                ? [{ event_id: envelope.events[0].event_id, status: "accepted" }]
                                : [{ event_id: envelope.events[0].event_id, status: "duplicate" }],
                    },
                });
            },
            navigator: {},
            AbortController,
        },
    });
    const queue = createEventQueue({
        runtime: { AbortController },
        storage: createQueueStorage({ storage, key: "partial-ack" }),
        sinks: [sink],
        legacySinkKey: "tracking",
        beforeFlush: () => ({ allow: true }),
        setTimeout: timers.setTimeout,
        clearTimeout: timers.clearTimeout,
    });
    [firstEvent, secondEvent].forEach((event) => {
        assert.equal(queue.enqueue(event, { sinkKeys: ["traffic"] }), true);
        assert.equal(queue.finalize(event.event_id, "traffic", fixture.traffic_finalization), true);
    });

    const firstResult = await queue.flush({ reason: "partial_ack" });
    assert.equal(firstResult.sent, 1);
    assert.deepEqual(queue.getState().eventIds, [secondEvent.event_id]);
    assert.equal(queue.getState().entries[0].deliveries.traffic.state, "retry");

    const secondResult = await queue.flush({ reason: "retry_missing_ack" });
    assert.equal(secondResult.sent, 1);
    assert.equal(queue.getState().pending, 0);
    assert.equal(requestCount, 2);
    queue.destroy();
});

test("trusted block persists, clears the queue, cancels inflight and requires explicit unblock", async () => {
    const timers = createNoopTimers();
    const localStorage = createMemoryStorage();
    const first = createJx3boxTrafficAnalytics({
        runtime: createRuntime({ localStorage }),
        router: createRouter(),
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        trafficAllowed: { traffic_allowed: false, collection_blocked_reason: "robot" },
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await first.init();
    assert.equal(first.getState().analytics.queue.blocked, true);
    assert.equal(first.getState().analytics.queue.blockReason.reason, "robot");
    assert.equal(JSON.parse(localStorage.getItem(DEFAULT_BLOCK_STORAGE_KEY)).reason, "robot");
    first.destroy();

    const restored = createJx3boxTrafficAnalytics({
        runtime: createRuntime({ localStorage }),
        router: createRouter(),
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await restored.init();
    assert.equal(restored.getState().analytics.queue.blocked, true, "block must survive reload");
    restored.setTrafficPermission({ traffic_allowed: true });
    assert.equal(restored.getState().analytics.queue.blocked, false);
    assert.equal(localStorage.getItem(DEFAULT_BLOCK_STORAGE_KEY), null);
    restored.destroy();

    let aborted = false;
    let requestSignal;
    const sink = createTrafficSink({
        endpoint: "/traffic",
        runtime: {
            fetch(url, options) {
                requestSignal = options.signal;
                return new Promise((resolve, reject) => {
                    options.signal.addEventListener("abort", () => {
                        aborted = true;
                        reject(new Error("aborted"));
                    });
                });
            },
            navigator: {},
            AbortController,
        },
    });
    const queue = createEventQueue({
        runtime: { AbortController },
        storage: createQueueStorage({ storage: localStorage, key: "inflight" }),
        sinks: [sink],
        legacySinkKey: "tracking",
        beforeFlush: () => ({ allow: true }),
        setTimeout: timers.setTimeout,
        clearTimeout: timers.clearTimeout,
    });
    queue.enqueue(fixture.canonical_event, { sinkKeys: ["traffic"] });
    queue.finalize(fixture.canonical_event.event_id, "traffic", fixture.traffic_finalization);
    const flushing = queue.flush({ reason: "inflight" });
    await new Promise((resolve) => setImmediate(resolve));
    assert.ok(requestSignal);
    assert.equal(queue.cancelInflight("permission_changed"), 1);
    await flushing;
    assert.equal(aborted, true);
    assert.equal(queue.clear("privacy_disable"), 1);
    assert.equal(queue.getState().pending, 0);
    queue.destroy();
});

test("a trusted server ACK block is persisted before the queue is cleared", async () => {
    const timers = createNoopTimers();
    const localStorage = createMemoryStorage();
    const runtime = createRuntime({
        localStorage,
        async fetch(url, options) {
            if (String(url).startsWith("/api/cms/system/traffic/config")) {
                return createResponse(200, {
                    code: 0,
                    data: {
                        enabled: true,
                        page_key: "index.home",
                        route_pattern: "/index",
                        sample_rate: 1,
                        event_types: ["page_view"],
                        rule_version: "traffic-server-block",
                    },
                });
            }
            assert.ok(options.body);
            return createResponse(403, {
                code: 403,
                data: { blocked: "robot" },
            });
        },
    });
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime,
        router,
        captureInitial: false,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await traffic.init();
    router.navigate({
        name: "index",
        matched: [{ path: "/index" }],
        meta: { analytics: { page_key: "index.home" } },
        params: {},
        query: {},
    });
    await waitForRouter();
    traffic.finalize({ is_exit: true, reason: "server_block_test" });
    await traffic.flush({ reason: "server_block_test" });
    assert.equal(traffic.getState().analytics.queue.blocked, true);
    assert.equal(traffic.getState().analytics.queue.pending, 0);
    assert.equal(JSON.parse(localStorage.getItem(DEFAULT_BLOCK_STORAGE_KEY)).reason, "robot");
    traffic.destroy();
});

test("the Traffic-only Journal never consumes or rewrites a shared Tracking Journal", async () => {
    const now = Date.parse(fixture.canonical_event.occurred_at);
    const sharedJournal = JSON.stringify({
        version: 1,
        saved_at: now,
        entries: [{ event: fixture.canonical_event, queued_at: now, attempts: 0 }],
    });
    const localStorage = createMemoryStorage({
        [SHARED_ANALYTICS_QUEUE_STORAGE_KEY]: sharedJournal,
    });
    let batchRequests = 0;
    const timers = createNoopTimers();
    const router = createRouter();
    const traffic = createJx3boxTrafficAnalytics({
        runtime: createRuntime({
            localStorage,
            async fetch(url, options) {
                if (String(url).startsWith("/api/cms/system/traffic/config")) {
                    return createResponse(200, {
                        code: 0,
                        data: {
                            enabled: true,
                            page_key: "index.home",
                            route_pattern: "/index",
                            sample_rate: 1,
                            event_types: ["page_view"],
                            rule_version: "traffic-independent-journal",
                        },
                    });
                }
                batchRequests += 1;
                const envelope = JSON.parse(options.body);
                return createResponse(200, {
                    code: 0,
                    data: {
                        items: envelope.events.map((event) => ({ event_id: event.event_id, status: "accepted" })),
                    },
                });
            },
        }),
        router,
        captureInitial: false,
        now: () => now,
        project: "index",
        client: "pc_web",
        surface: "pc_web",
        gameClient: "std",
        trafficAllowed: true,
        queueSetTimeout: timers.setTimeout,
        queueClearTimeout: timers.clearTimeout,
    });
    await traffic.init();
    assert.equal(traffic.getState().analytics.queue.pending, 0);
    router.navigate({
        name: "index",
        matched: [{ path: "/index" }],
        meta: { analytics: { page_key: "index.home" } },
        params: {},
        query: {},
    });
    await waitForRouter();
    traffic.finalize({ is_exit: true, reason: "journal_isolation" });
    await traffic.flush({ reason: "journal_isolation" });
    assert.equal(batchRequests, 1);
    assert.equal(localStorage.getItem(SHARED_ANALYTICS_QUEUE_STORAGE_KEY), sharedJournal);
    assert.notEqual(DEFAULT_QUEUE_STORAGE_KEY, SHARED_ANALYTICS_QUEUE_STORAGE_KEY);
    traffic.destroy();
});
