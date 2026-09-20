const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function loadService(storage, request) {
    const source = fs
        .readFileSync(path.resolve(__dirname, "../service/header.js"), "utf8")
        .replace(/^import .+;$/gm, "")
        .replace(/export \{[^}]+\};/, "return { getGlobalConfig };");
    return Function(
        "axios",
        "JX3BOX",
        "sessionStorage",
        source
    )(
        { get: request },
        { __ossRoot: "https://cdn.jx3box.com/" },
        { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
    );
}

test("one CDN request is shared and the session cache survives module remounts", async () => {
    const storage = new Map();
    let calls = 0;
    const request = async (url) => {
        assert.equal(url, "https://cdn.jx3box.com/config/global.json");
        calls++;
        return { data: { vip: "20260920", mall: "20260703", important_notice: "20260728" } };
    };
    const service = loadService(storage, request);
    const [a, b] = await Promise.all([service.getGlobalConfig(), service.getGlobalConfig()]);
    assert.deepEqual(a, b);
    assert.equal(calls, 1);
    assert.deepEqual(await loadService(storage, request).getGlobalConfig(), a);
    assert.equal(calls, 1);
    assert.deepEqual(JSON.parse(storage.get("jx3box:global-config")), a);
    storage.clear();
    await service.getGlobalConfig();
    assert.equal(calls, 2);
});

test("old timed cache is replaced and explicit refresh updates the session", async () => {
    const storage = new Map([["jx3box:global-config", JSON.stringify({ time: Date.now(), data: { vip: "old" } })]]);
    let value = "new";
    const service = loadService(storage, async () => ({ data: { vip: value } }));
    assert.equal((await service.getGlobalConfig()).vip, "new");
    value = "changed";
    assert.equal((await service.getGlobalConfig()).vip, "new");
    assert.equal((await service.getGlobalConfig({ force: true })).vip, "changed");
});

test("a failed CDN request can be retried", async () => {
    let fail = true;
    const service = loadService(new Map(), async () => {
        if (fail) throw Error("offline");
        return { data: { vip: "1" } };
    });
    await assert.rejects(service.getGlobalConfig(), /offline/);
    fail = false;
    assert.deepEqual(await service.getGlobalConfig(), { vip: "1" });
});
