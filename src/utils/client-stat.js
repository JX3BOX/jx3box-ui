import { $cms } from "@jx3box/jx3box-common/js/api";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { applyJx3boxClientStatRules } from "./client-stat-business";

const INSTANCE_ID_KEY = "jx3box:device_id";
const REPORT_DATE_KEY = "jx3box:client-stat-report-date";
const REPORT_SIGNATURE_KEY = "jx3box:client-stat-report-signature";
const STAT_SDK_VERSION = "v0.0.2";
const STARTUP_DELAY_MIN = 3 * 1000;
const STARTUP_DELAY_MAX = 15 * 1000;

let reportTask = null;
let scheduledTimer = null;

function compactPayload(payload) {
    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
}

function rangedNumber(value, min, max, { integer = false } = {}) {
    if (value === undefined || value === null || value === "") return null;
    const result = Number(value);
    if (!Number.isFinite(result) || result < min || result > max) return null;
    if (integer && !Number.isInteger(result)) return null;
    return result;
}

function createInstanceId() {
    const browserCrypto = window.crypto;
    if (typeof browserCrypto?.randomUUID === "function") return browserCrypto.randomUUID();

    const bytes = new Uint8Array(16);
    browserCrypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

export function ensureClientInstanceId() {
    const current = localStorage.getItem(INSTANCE_ID_KEY);
    if (current) return current;

    const instanceId = createInstanceId();
    localStorage.setItem(INSTANCE_ID_KEY, instanceId);
    return instanceId;
}

function chinaDate(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((item) => [item.type, item.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

function resolveChannel() {
    const sources = [window.location.search, String(window.location.hash || "").split("?")[1]];
    for (const source of sources) {
        if (!source) continue;
        const value = new URLSearchParams(String(source).replace(/^\?/, "")).get("__from");
        if (value?.trim()) return value.trim().slice(0, 64);
    }
    return null;
}

function resolvePlatform(userAgent, navigatorPlatform) {
    if (/ArkWeb|HarmonyOS|OpenHarmony/i.test(userAgent)) return "harmony";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
    if (/Android/i.test(userAgent)) return "android";
    if (/Windows/i.test(userAgent)) return "windows";
    if (/Macintosh|MacIntel/i.test(userAgent) || navigatorPlatform === "MacIntel") return "macos";
    if (/Linux/i.test(userAgent)) return "linux";
    return "unknown";
}

function normalizeHarmonySystem(platform, userAgent) {
    if (platform !== "harmony") return { os_name: platform, os_version: null };
    const openHarmony = String(userAgent || "").match(/\b(?:Phone|Tablet);\s*OpenHarmony\s+([0-9]+(?:\.[0-9]+)*)\b/i);
    if (openHarmony) return { os_name: "OpenHarmony", os_version: openHarmony[1] };
    return {
        os_name: /HarmonyOS/i.test(userAgent) ? "HarmonyOS" : "OpenHarmony",
        os_version: null,
    };
}

function resolveClient(platform, userAgent) {
    if (isApp()) return "app";
    if (isMiniProgram() || /miniprogram/i.test(userAgent)) return "miniprogram";
    if (["ios", "android"].includes(platform) || /Mobile|Tablet/i.test(userAgent)) return "mobile_web";
    if (["windows", "macos", "linux"].includes(platform)) return "pc_web";
    return "unknown";
}

function parseBrowser(userAgent) {
    const candidates = [
        ["Edge", /EdgA?[\s/]([\d.]+)/i],
        ["Chrome", /(?:Chrome|CriOS)[\s/]([\d.]+)/i],
        ["Firefox", /(?:Firefox|FxiOS)[\s/]([\d.]+)/i],
        ["Safari", /Version[\s/]([\d.]+).*Safari/i],
    ];
    const matched = candidates.find(([, pattern]) => pattern.test(userAgent));
    const browserMatch = matched?.[1]?.exec(userAgent);
    const webkit = /AppleWebKit[\s/]([\d.]+)/i.exec(userAgent);
    const chromium = /(?:Chrome|Chromium|CriOS)[\s/]([\d.]+)/i.exec(userAgent);

    return {
        browser_name: matched?.[0] || null,
        browser_version: browserMatch?.[1] || null,
        engine_name: chromium ? "Blink" : webkit ? "WebKit" : null,
        webview_version: /;\s*wv\)|Version\/4\.0/i.test(userAgent)
            ? browserMatch?.[1] || chromium?.[1] || webkit?.[1] || null
            : null,
    };
}

function supportsWebGl() {
    try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch (e) {
        return false;
    }
}

function resolveOrientation() {
    const type = String(window.screen?.orientation?.type || "");
    if (type.startsWith("portrait")) return "portrait";
    if (type.startsWith("landscape")) return "landscape";
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

function resolveDisplayMode() {
    if (document.fullscreenElement) return "fullscreen";
    if (window.matchMedia?.("(display-mode: standalone)")?.matches) return "standalone";
    return "browser";
}

function resolveWebVersion() {
    return window.__APP_VERSION__ || process.env.VUE_APP_VERSION || process.env.VITE_APP_VERSION || null;
}

export function buildClientStatPayload(instanceId) {
    const nav = window.navigator || {};
    const screen = window.screen || {};
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection || {};
    const userAgent = String(nav.userAgent || "");
    const platform = resolvePlatform(userAgent, nav.platform);
    const context = applyJx3boxClientStatRules(
        { platform, client: resolveClient(platform, userAgent) },
        { userAgent }
    );
    const browser = parseBrowser(userAgent);
    const system = normalizeHarmonySystem(context.platform, userAgent);

    return compactPayload({
        instance_id: instanceId,
        product: "jx3box",
        client: context.client,
        platform: context.platform,
        domain: window.location.hostname,
        channel: resolveChannel(),
        web_version: resolveWebVersion(),
        sdk_version: STAT_SDK_VERSION,

        os_name: system.os_name,
        os_version: system.os_version,
        device_type: ["ios", "android"].includes(platform) ? (/iPad|Tablet/i.test(userAgent) ? "tablet" : "phone") : "desktop",
        architecture: /arm64|aarch64/i.test(userAgent)
            ? "arm64"
            : /x86_64|x64|Win64|x86-64/i.test(userAgent)
              ? "x64"
              : null,
        hardware_concurrency: rangedNumber(nav.hardwareConcurrency, 1, 1024, { integer: true }),
        device_memory_gb: rangedNumber(nav.deviceMemory, 0.1, 655.35),

        screen_width_css: rangedNumber(screen.width, 1, 100000, { integer: true }),
        screen_height_css: rangedNumber(screen.height, 1, 100000, { integer: true }),
        screen_avail_width_css: rangedNumber(screen.availWidth, 1, 100000, { integer: true }),
        screen_avail_height_css: rangedNumber(screen.availHeight, 1, 100000, { integer: true }),
        viewport_width_css: rangedNumber(window.innerWidth, 1, 100000, { integer: true }),
        viewport_height_css: rangedNumber(window.innerHeight, 1, 100000, { integer: true }),
        device_pixel_ratio: rangedNumber(window.devicePixelRatio, 0.1, 20),
        color_depth: rangedNumber(screen.colorDepth, 1, 128, { integer: true }),
        orientation: resolveOrientation(),
        display_mode: resolveDisplayMode(),
        prefers_dark: !!window.matchMedia?.("(prefers-color-scheme: dark)")?.matches,
        prefers_reduced_motion: !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,

        ...browser,
        language: nav.languages?.find(Boolean) || nav.language || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        touch_points: rangedNumber(nav.maxTouchPoints, 0, 100, { integer: true }),
        capabilities: {
            wasm: typeof WebAssembly !== "undefined",
            service_worker: "serviceWorker" in nav,
            webgl: supportsWebGl(),
        },
        network_type: String(connection.type || "unknown").toLowerCase(),
        network_effective_type: String(connection.effectiveType || "unknown").toLowerCase(),
    });
}

function getReportSignature() {
    const uid = User.isLogin() ? Number(User.getInfo()?.uid || localStorage.getItem("uid") || 0) : 0;
    return `${uid}:${resolveWebVersion() || "unknown"}`;
}

export async function reportClientStat({ force = false } = {}) {
    if (reportTask) return reportTask;

    reportTask = (async () => {
        const today = chinaDate();
        const signature = getReportSignature();
        if (
            !force &&
            localStorage.getItem(REPORT_DATE_KEY) === today &&
            localStorage.getItem(REPORT_SIGNATURE_KEY) === signature
        ) {
            return { reported: false, reason: "already_reported" };
        }

        const payload = buildClientStatPayload(ensureClientInstanceId());
        const response = await $cms({ mute: true }).post("/api/cms/system/stat/heartbeat", payload, {
            timeout: 10000,
            skipForbiddenSessionClear: true,
        });
        localStorage.setItem(REPORT_DATE_KEY, today);
        localStorage.setItem(REPORT_SIGNATURE_KEY, signature);
        return { reported: true, data: response?.data?.data || null, payload };
    })().finally(() => {
        reportTask = null;
    });

    return reportTask;
}

function isLocalhost() {
    return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function startupDelay() {
    if (process.env.NODE_ENV !== "production" || isLocalhost()) return 0;
    return Math.floor(STARTUP_DELAY_MIN + Math.random() * (STARTUP_DELAY_MAX - STARTUP_DELAY_MIN));
}

export function scheduleClientStatReport({ force = false, delay = startupDelay() } = {}) {
    if (scheduledTimer) {
        if (!force) return;
        window.clearTimeout(scheduledTimer);
    }

    scheduledTimer = window.setTimeout(() => {
        scheduledTimer = null;
        reportClientStat({ force }).catch(() => {
            // 统计失败不影响公共头和宿主页面；未写成功标记时，下次恢复可见会继续尝试。
        });
    }, delay);
}

export function installClientStatReporting() {
    scheduleClientStatReport({ force: isLocalhost() });
}

export function checkClientStatOnVisible() {
    scheduleClientStatReport();
}
