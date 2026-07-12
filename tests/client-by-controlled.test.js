const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function loadComponentOptions() {
    const filename = path.resolve(__dirname, "../src/filters/clientBy.vue");
    const source = fs.readFileSync(filename, "utf8");
    const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1] || "";
    const executable = script
        .replace(/^\s*import\s+[^;]+;\s*$/gm, "")
        .replace(/export\s+default\s+/, "return ");
    return Function("i18nMixin", executable)({});
}

function createVm({ type = "", autoDetect = false } = {}) {
    const events = [];
    return {
        vm: {
            type,
            autoDetect,
            client: type || "",
            $emit(name, payload) {
                events.push({ name, payload });
            },
            $forceUpdate() {},
        },
        events,
    };
}

const component = loadComponentOptions();

test("clientBy keeps automatic site detection enabled by default", () => {
    assert.equal(component.props.autoDetect.default, true);
});

test("controlled mode keeps all selected and does not emit while mounting", () => {
    const { vm, events } = createVm({ type: "all", autoDetect: false });

    component.mounted.call(vm);

    assert.equal(vm.client, "all");
    assert.deepEqual(events, []);
});

test("external type updates only synchronize selection", () => {
    const { vm, events } = createVm({ type: "all", autoDetect: false });

    component.watch.type.call(vm, "origin");

    assert.equal(vm.client, "origin");
    assert.deepEqual(events, []);
});

test("user selection emits the existing filter payload", () => {
    const { vm, events } = createVm({ type: "all", autoDetect: false });

    component.methods.filter.call(vm, "std");

    assert.equal(vm.client, "std");
    assert.deepEqual(events, [{ name: "filter", payload: { type: "client", val: "std" } }]);
});

test("automatic mode only detects origin from hostname", () => {
    const previousLocation = global.location;
    global.location = { hostname: "origin.jx3box.com" };
    const { vm, events } = createVm({ autoDetect: true });
    vm.filter = component.methods.filter;

    try {
        component.mounted.call(vm);
    } finally {
        global.location = previousLocation;
    }

    assert.equal(vm.client, "origin");
    assert.deepEqual(events, [{ name: "filter", payload: { type: "client", val: "origin" } }]);
});
