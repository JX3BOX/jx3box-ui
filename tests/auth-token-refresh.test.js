const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const commonHeader = fs.readFileSync(path.join(root, "src/CommonHeader.vue"), "utf8");
const alternate = fs.readFileSync(path.join(root, "src/header/alternate.vue"), "utf8");
const userInfo = fs.readFileSync(path.join(root, "src/header/userInfo.vue"), "utf8");
const cmsService = fs.readFileSync(path.join(root, "service/cms.js"), "utf8");
const refreshUtil = fs.readFileSync(path.join(root, "src/utils/auth-token-refresh.js"), "utf8");
const docs = fs.readFileSync(path.join(root, "docs/agents/auth-token-refresh.md"), "utf8");

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

assert(
    cmsService.includes("/api/cms/user/account/token/refresh"),
    "refreshAuth should use the token refresh endpoint"
);

assert(commonHeader.includes("refreshTokenIfNeeded"), "CommonHeader should trigger token refresh");

assert(
    commonHeader.includes("visibilitychange") && commonHeader.includes("handleVisibilityChange"),
    "CommonHeader should check refresh on visibility restore"
);

assert(refreshUtil.includes("REFRESH_WINDOW_SECONDS = 7 * 24 * 60 * 60"), "refresh window should be 7 days");

assert(
    refreshUtil.includes("MIN_REFRESH_INTERVAL_SECONDS = 24 * 60 * 60"),
    "minimum refresh interval should be 1 day"
);

assert(
    refreshUtil.includes("(!force && !isAutoTokenRefreshEnabled())"),
    "explicit account switching and URL-token normalization should bypass the automatic refresh toggle"
);

assert(
    refreshUtil.includes('localStorage.getItem("__token") || localStorage.getItem("token")'),
    "refresh should read __token before token"
);

assert(
    refreshUtil.includes("syncActiveAuthToken(profile.token)"),
    "refresh should keep __token in sync"
);

assert(
    refreshUtil.includes('sessionStorage.getItem("__token")') &&
        refreshUtil.includes('sessionStorage.setItem("__token", token)'),
    "refresh should update an existing URL token stored in sessionStorage"
);

assert(
    alternate.includes("syncActiveAuthToken(item.token)") &&
        alternate.indexOf("syncActiveAuthToken(item.token)") < alternate.indexOf("refreshTokenIfNeeded({ force: true })"),
    "alternate switching should synchronize the selected token before refreshing auth"
);

assert(
    alternate.includes("clearActiveAuthToken()") &&
        alternate.indexOf("clearActiveAuthToken()") < alternate.indexOf('location.href = JX3BOX.__Links.account.login'),
    "adding an alternate should clear the previous account override token before login"
);

assert(
    userInfo.includes("clearActiveAuthToken()") && commonHeader.includes("clearActiveAuthToken()"),
    "manual and token-version logout should clear higher-priority request tokens"
);

assert(
    userInfo.includes("repairMismatchedIdentity") && userInfo.includes("hasActiveAuthTokenOverride()"),
    "header profile should repair a cached uid that conflicts with the authenticated request uid"
);

assert(
    commonHeader.includes("reloadOnIdentityChange") && commonHeader.includes("refreshTokenIfNeeded({ force })"),
    "URL token entry should normalize the cached identity and reload when the uid changes"
);

assert(
    refreshUtil.includes("jx3box-alternate-${profile.uid}"),
    "refresh should update the current alternate account cache"
);

assert(docs.includes("PC 账号切换注意事项"), "docs should record PC account switching constraints");

console.log("auth token refresh checks passed");
