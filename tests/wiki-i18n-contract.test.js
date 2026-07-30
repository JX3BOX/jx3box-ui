const assert = require("node:assert/strict");
const test = require("node:test");

require("@babel/register")({
    babelrc: false,
    configFile: false,
    extensions: [".js"],
    ignore: [/node_modules/],
    plugins: ["@babel/plugin-transform-modules-commonjs"],
});

const {
    createJx3boxUiI18n,
    getJx3boxUiMessages,
    mergeJx3boxUiMessages,
    setJx3boxUiI18n,
} = require("../i18n");
const i18nMixin = require("../i18n/mixin").default;
const { createI18n } = require("vue-i18n");

const TARGET_PREFIXES = [
    "wiki.",
    "wikiPanel.",
    "wikiComments.",
    "wikiComment.",
    "wikiRevisions.",
    "gamePrice.",
];

function flattenMessages(value, prefix = "", output = {}) {
    Object.entries(value || {}).forEach(([key, child]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === "object" && !Array.isArray(child)) {
            flattenMessages(child, path, output);
        } else {
            output[path] = child;
        }
    });
    return output;
}

function placeholders(value) {
    return [...String(value ?? "").matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

test("loads the target component messages for each supported locale", () => {
    const messages = getJx3boxUiMessages();
    Object.entries(messages).forEach(([locale, message]) => {
        const flattened = flattenMessages(message);
        TARGET_PREFIXES.forEach((prefix) => {
            assert.ok(
                Object.keys(flattened).some((key) => key.startsWith(prefix)),
                `${locale} is missing ${prefix}`
            );
        });
    });

    const i18n = createJx3boxUiI18n({ locale: "en-US" });
    assert.equal(i18n.global.t("jx3boxUi.wikiComment.setTop"), "Pin");
    assert.equal(i18n.global.t("jx3boxUi.wikiPanel.qrTrigger"), "QR code");
    assert.equal(i18n.global.t("jx3boxUi.wikiPanel.qrScanToVisit"), "Scan to open this page");
    assert.equal(i18n.global.t("jx3boxUi.gamePrice.jin"), "gold");
});

test("merges target messages into a host i18n instance", () => {
    const hostI18n = createI18n({
        legacy: false,
        locale: "en-US",
        fallbackLocale: "zh-CN",
        messages: {
            "en-US": {
                host: {
                    title: "Host",
                },
            },
        },
    });

    mergeJx3boxUiMessages(hostI18n);
    setJx3boxUiI18n(hostI18n);

    assert.equal(hostI18n.global.t("host.title"), "Host");
    assert.equal(hostI18n.global.t("jx3boxUi.wikiComments.title"), "Wiki Comments");
});

test("component mixin keeps the explicit fallback when the host misses a key", () => {
    setJx3boxUiI18n(null);
    const context = {
        $t(key) {
            return key;
        },
    };

    assert.equal(
        i18nMixin.methods.$jx3boxT.call(context, "jx3boxUi.missing.example", "欢迎 {name}", { name: "侠士" }),
        "欢迎 侠士"
    );
});

test("keeps four locale message keys and placeholders aligned", () => {
    const messages = getJx3boxUiMessages();
    const locales = Object.keys(messages);
    const baseline = flattenMessages(messages["zh-CN"]);
    const baselineKeys = Object.keys(baseline).sort();

    locales.forEach((locale) => {
        const current = flattenMessages(messages[locale]);
        assert.deepEqual(Object.keys(current).sort(), baselineKeys, `${locale} message keys differ from zh-CN`);
        baselineKeys.forEach((key) => {
            assert.deepEqual(placeholders(current[key]), placeholders(baseline[key]), `${locale}:${key} placeholders differ`);
        });
    });
});
