const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const commonHeader = fs.readFileSync(path.join(root, "src/CommonHeader.vue"), "utf8");
const clientStat = fs.readFileSync(path.join(root, "src/utils/client-stat.js"), "utf8");

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

assert(commonHeader.includes("installClientStatReporting()"), "CommonHeader should install client statistics");
assert(
    commonHeader.includes("checkClientStatOnVisible()") && commonHeader.includes("visibilitychange"),
    "CommonHeader should retry statistics when the page becomes visible"
);
assert(clientStat.includes('const INSTANCE_ID_KEY = "jx3box:device_id"'), "PC should reuse the client instance id key");
assert(clientStat.includes('product: "jx3box"'), "heartbeat should identify the JX3BOX product");
assert(clientStat.includes('const STAT_SDK_VERSION = "v0.0.1"'), "statistics SDK version should remain explicit");
assert(clientStat.includes('return "pc_web"'), "desktop browser traffic should report pc_web");
assert(clientStat.includes('return "mobile_web"'), "mobile browsers visiting PC pages should report mobile_web");
assert(clientStat.includes("/api/cms/system/stat/heartbeat"), "heartbeat should use the new statistics endpoint");
assert(clientStat.includes("$cms({ mute: true })"), "heartbeat should reuse the authenticated CMS client");
assert(
    clientStat.indexOf("localStorage.setItem(REPORT_DATE_KEY") > clientStat.indexOf("await $cms"),
    "successful report markers must only be stored after the request resolves"
);
assert(!clientStat.includes("current_uid:"), "heartbeat payload must not report uid");
assert(!clientStat.includes("ip:"), "heartbeat payload must not report ip");

console.log("client statistics checks passed");
