const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const commonHeader = fs.readFileSync(path.join(root, "src/CommonHeader.vue"), "utf8");
const clientStat = fs.readFileSync(path.join(root, "src/utils/client-stat.js"), "utf8");
const clientStatBusiness = fs.readFileSync(path.join(root, "src/utils/client-stat-business.js"), "utf8");

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

assert(commonHeader.includes("installClientStatReporting()"), "CommonHeader should install client statistics");
assert(
    commonHeader.includes("installCommonHeaderTrafficAnalytics"),
    "CommonHeader should automatically install the shared Traffic collector"
);
assert(
    commonHeader.includes("checkClientStatOnVisible()") && commonHeader.includes("visibilitychange"),
    "CommonHeader should retry statistics when the page becomes visible"
);
assert(clientStat.includes('const INSTANCE_ID_KEY = "jx3box:device_id"'), "PC should reuse the client instance id key");
assert(clientStat.includes('product: "jx3box"'), "heartbeat should identify the JX3BOX product");
assert(clientStat.includes('app_version: "jx3box-ui"'), "PC heartbeat should identify the shared header reporter");
assert(clientStat.includes("app_build: PACKAGE_VERSION"), "PC heartbeat should report jx3box-ui package.json.version");
assert(
    clientStat.includes("const WEB_VERSION = `jx3box-ui@${PACKAGE_VERSION}`"),
    "PC heartbeat should namespace its web version"
);
assert(clientStat.includes("web_version: WEB_VERSION"), "PC heartbeat should report the namespaced web version");
assert(clientStat.includes('const STAT_SDK_VERSION = "v0.0.3"'), "statistics SDK version should remain explicit");
assert(clientStat.includes('return "pc_web"'), "desktop browser traffic should report pc_web");
assert(clientStat.includes('return "mobile_web"'), "mobile browsers visiting PC pages should report mobile_web");
assert(
    clientStat.includes("applyJx3boxClientStatRules"),
    "generic client detection should pass through the JX3BOX business rule adapter"
);
assert(clientStatBusiness.includes("/jianghudaily/i"), "Jianghu Daily UA matching should be case-insensitive");
assert(clientStatBusiness.includes('client: "mobile_game"'), "Jianghu Daily should report mobile_game");
assert(
    clientStat.includes("/ArkWeb|HarmonyOS|OpenHarmony/i") && clientStat.includes('os_name: "OpenHarmony"'),
    "PC statistics should normalize OpenHarmony before reporting"
);
assert(!clientStat.includes("__JX3BOX_VERSION__"), "shared statistics must not depend on a JX3BOX-specific version global");
assert(!clientStat.includes("VUE_APP_BUILD_VERSION"), "web version should not use the deprecated build-version fallback");
assert(clientStat.includes("/api/cms/system/stat/heartbeat"), "heartbeat should use the new statistics endpoint");
assert(clientStat.includes("$cms({ mute: true })"), "heartbeat should reuse the authenticated CMS client");
assert(
    clientStat.indexOf("localStorage.setItem(REPORT_DATE_KEY") > clientStat.indexOf("await $cms"),
    "successful report markers must only be stored after the request resolves"
);
assert(!clientStat.includes("current_uid:"), "heartbeat payload must not report uid");
assert(!clientStat.includes("ip:"), "heartbeat payload must not report ip");

console.log("client statistics checks passed");
