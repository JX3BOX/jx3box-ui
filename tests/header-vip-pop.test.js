const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function createComponent(readVersion = null) {
    const source = fs.readFileSync(path.resolve(__dirname, "../src/header/vip.vue"), "utf8");
    const script = source
        .match(/<script>([\s\S]*?)<\/script>/)[1]
        .replace(/^import .+;$/gm, "")
        .replace("export default", "return");
    const storage = new Map(readVersion == null ? [] : [["vip_pop", readVersion]]);
    const component = Function(
        "i18nMixin",
        "localStorage",
        script
    )(
        {},
        {
            getItem: (key) => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, String(value)),
        }
    );
    const vm = { ...component.data(), configManaged: true };
    for (const [key, method] of Object.entries(component.methods)) vm[key] = method.bind(vm);
    return { vm, storage };
}

test("any changed reminder version is unread regardless of numerical order", async () => {
    const { vm } = createComponent("20260920");
    vm.config = { val: "20260703" };
    await vm.init();
    assert.equal(vm.pop, true);
    assert.equal(vm.shouldShowPop("20260920"), false);
    assert.equal(vm.shouldShowPop("20260921"), true);
});

test("first click persists the current version and hides the reminder", async () => {
    const { vm, storage } = createComponent();
    vm.config = { val: "20260920" };
    await vm.init();
    assert.equal(vm.pop, true);
    vm.markPopRead();
    assert.equal(vm.pop, false);
    assert.equal(storage.get("vip_pop"), "20260920");
});

test("click acknowledges the displayed version regardless of numerical order", () => {
    const { vm, storage } = createComponent("20260920");
    vm.popValue = "20260703";
    vm.pop = true;
    vm.markPopRead();
    assert.equal(storage.get("vip_pop"), "20260703");
    assert.equal(vm.pop, false);
});

test("sync hides a reminder read in another page", () => {
    const { vm, storage } = createComponent();
    Object.assign(vm, { initialized: true, popValue: "20260920", pop: true });
    storage.set("vip_pop", "20260920");
    vm.syncPopRead();
    assert.equal(vm.pop, false);
});

test("disabled or invalid config stays hidden and invalid read state can recover", () => {
    const { vm } = createComponent("undefined");
    for (const value of [null, undefined, "", "0", "invalid"]) {
        assert.equal(vm.shouldShowPop(value), false);
    }
    assert.equal(vm.shouldShowPop("20260920"), true);
});
