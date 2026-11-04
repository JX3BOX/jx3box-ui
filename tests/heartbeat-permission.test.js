const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("reuses a confirmed permission across page loads and cools down failed requests per identity", async () => {
    const values = new Map([["jx3box:device_id", "fixture-id"]]);
    let uid = 0;
    let requests = 0;
    let fail = false;
    const source = fs.readFileSync(path.join(__dirname, "../src/utils/client-stat.js"), "utf8")
        .replace(/^import .+;$/gm, "").replace(/^export /gm, "");
    function load() {
        const context = {
            window: { location: { hostname: "test.jx3box.com", search: "" } },
            document: {}, URLSearchParams, packageInfo: { version: "test" },
            DEFAULT_BLOCK_STORAGE_KEY: "block",
            User: { isLogin: () => !!uid, getInfo: () => ({ uid }) },
            localStorage: { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) },
            isApp: () => false, isMiniProgram: () => false, applyJx3boxClientStatRules: v => v,
            $cms: () => ({ post: async () => {
                requests++;
                if (fail) throw Error("offline");
                return { data: { data: { traffic_allowed: true } } };
            } }),
        };
        return vm.runInNewContext(source + "\nresolveClientTrafficPermission;", context);
    }

    assert.equal((await load()()).traffic_allowed, true);
    assert.equal((await load()()).traffic_allowed, true);
    assert.equal(requests, 1);
    values.set("block", "robot");
    fail = true;
    assert.equal(await load()(), null);
    assert.equal(await load()(), null);
    assert.equal(requests, 2);
    uid = 10;
    fail = false;
    assert.equal((await load()()).traffic_allowed, true);
    assert.equal(requests, 3);
});
