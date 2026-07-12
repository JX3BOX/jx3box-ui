import User from "@jx3box/jx3box-common/js/user";
import { refreshAuth } from "../../service/cms";

const REFRESH_WINDOW_SECONDS = 7 * 24 * 60 * 60;
const MIN_REFRESH_INTERVAL_SECONDS = 24 * 60 * 60;
const AUTO_REFRESH_STORAGE_KEY = "jx3box:auto_refresh_token";

let refreshTask = null;

function canUseLocalStorage() {
    return typeof localStorage !== "undefined";
}

function canUseSessionStorage() {
    return typeof sessionStorage !== "undefined";
}

export function syncActiveAuthToken(token = "") {
    if (!token) {
        return false;
    }

    if (canUseLocalStorage()) {
        localStorage.setItem("__token", token);
    }

    // URL token 会被 common 缓存在 sessionStorage，存在时也必须随账号切换一起更新。
    if (canUseSessionStorage() && sessionStorage.getItem("__token")) {
        sessionStorage.setItem("__token", token);
    }

    return true;
}

export function hasActiveAuthTokenOverride() {
    const localToken = canUseLocalStorage() ? localStorage.getItem("__token") : "";
    const sessionToken = canUseSessionStorage() ? sessionStorage.getItem("__token") : "";
    return !!(localToken || sessionToken);
}

export function clearActiveAuthToken() {
    if (canUseLocalStorage()) {
        localStorage.removeItem("__token");
    }
    if (canUseSessionStorage()) {
        sessionStorage.removeItem("__token");
    }
}

function decodeBase64Url(value = "") {
    const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

    if (typeof atob === "function") {
        return atob(padded);
    }

    return "";
}

export function parseJwtPayload(token = "") {
    const parts = String(token || "").split(".");
    if (parts.length < 2 || !parts[1]) {
        return null;
    }

    try {
        return JSON.parse(decodeBase64Url(parts[1]));
    } catch (e) {
        return null;
    }
}

export function isAutoTokenRefreshEnabled() {
    if (!canUseLocalStorage()) {
        return true;
    }

    const value = localStorage.getItem(AUTO_REFRESH_STORAGE_KEY);
    return value !== "false" && value !== "0";
}

export function shouldRefreshToken(token = "", nowSeconds = Math.floor(Date.now() / 1000)) {
    const payload = parseJwtPayload(token);
    const exp = Number(payload?.exp || 0);
    const iat = Number(payload?.iat || 0);

    if (!exp || !iat) {
        return false;
    }

    const remaining = exp - nowSeconds;
    const tokenAge = nowSeconds - iat;

    return remaining > 0 && remaining <= REFRESH_WINDOW_SECONDS && tokenAge >= MIN_REFRESH_INTERVAL_SECONDS;
}

function readCurrentToken() {
    if (!canUseLocalStorage()) {
        return User.getToken() || "";
    }

    return localStorage.getItem("__token") || localStorage.getItem("token") || User.getToken() || "";
}

function normalizeRefreshProfile(data = {}) {
    const user = data.user || {};
    const current = User.getInfo() || {};

    return {
        token: data.token || current.token || "",
        uid: user.ID || user.id || data.uid || current.uid || 0,
        group: user.user_group || user.group || data.group || current.group || 1,
        name: user.display_name || user.name || data.name || current.name || "",
        status: user.user_status || user.status || data.status || current.status || 0,
        bind_wx: user.wechat_unionid ? 1 : data.bind_wx || current.bind_wx || 0,
        avatar: user.user_avatar || user.avatar || data.avatar || current.avatar_origin || current.avatar || "",
    };
}

function updateCurrentAlternate(profile = {}) {
    if (!canUseLocalStorage() || !profile.uid || !profile.token) {
        return;
    }

    const key = `jx3box-alternate-${profile.uid}`;
    let alternate = {};

    try {
        alternate = JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch (e) {
        alternate = {};
    }

    localStorage.setItem(
        key,
        JSON.stringify({
            ...alternate,
            uid: profile.uid,
            name: profile.name,
            avatar: profile.avatar,
            group: ~~profile.group,
            bind_wx: ~~profile.bind_wx,
            token: profile.token,
            status: ~~profile.status,
            created_at: Number(localStorage.getItem("created_at")) || Date.now(),
        })
    );
}

async function applyRefreshResult(data = {}) {
    const profile = normalizeRefreshProfile(data);
    if (!profile.token || !profile.uid) {
        return false;
    }

    await User.update(profile);

    // @jx3box/common User.update only writes token; keep higher-priority request tokens in sync too.
    syncActiveAuthToken(profile.token);
    updateCurrentAlternate(profile);
    return true;
}

export async function refreshTokenIfNeeded(options = {}) {
    const { force = false } = options;

    if (!User.isLogin() || (!force && !isAutoTokenRefreshEnabled())) {
        return false;
    }

    const token = readCurrentToken();
    if (!token || (!force && !shouldRefreshToken(token))) {
        return false;
    }

    if (refreshTask) {
        return refreshTask;
    }

    refreshTask = refreshAuth()
        .then((res) => applyRefreshResult(res?.data?.data || {}))
        .finally(() => {
            refreshTask = null;
        });

    return refreshTask;
}
