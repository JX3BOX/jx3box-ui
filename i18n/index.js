import { createI18n } from "vue-i18n";

import zhCN from "./messages/zh-CN";
import enUS from "./messages/en-US";
import zhTW from "./messages/zh-TW";
import vi from "./messages/vi";

const NAMESPACE = "jx3boxUi";

const rawMessages = {
    "zh-CN": zhCN,
    "en-US": enUS,
    "zh-TW": zhTW,
    vi,
};

function buildNamespacedMessages(messages) {
    const out = {};
    Object.entries(messages).forEach(([locale, message]) => {
        out[locale] = {
            [NAMESPACE]: message,
        };
    });
    return out;
}

const namespacedMessages = buildNamespacedMessages(rawMessages);

let activeI18n = null;

export function setJx3boxUiI18n(i18n) {
    activeI18n = i18n || null;
}

export function getJx3boxUiI18n() {
    return activeI18n;
}

export function getJx3boxUiMessages() {
    return rawMessages;
}

export function mergeJx3boxUiMessages(i18n) {
    if (!i18n || !i18n.global || typeof i18n.global.mergeLocaleMessage !== "function") return;

    Object.entries(namespacedMessages).forEach(([locale, message]) => {
        i18n.global.mergeLocaleMessage(locale, message);
    });
}

export function createJx3boxUiI18n(options = {}) {
    const {
        locale = "zh-CN",
        fallbackLocale = "zh-CN",
        legacy = false,
        globalInjection = true,
        ...rest
    } = options;

    const i18n = createI18n({
        legacy,
        globalInjection,
        locale,
        fallbackLocale,
        messages: namespacedMessages,
        ...rest,
    });

    setJx3boxUiI18n(i18n);
    return i18n;
}

export function tGlobal(key, values, fallback) {
    try {
        const i18n = getJx3boxUiI18n();
        if (i18n && i18n.global && typeof i18n.global.t === "function") {
            return i18n.global.t(key, values);
        }
    } catch (e) {
        // ignore
    }
    return fallback ?? key;
}

export function getJx3boxUiAvailableLocales() {
    return Object.keys(rawMessages);
}

export function setJx3boxUiLocale(locale) {
    const i18n = getJx3boxUiI18n();
    if (!i18n || !i18n.global) return false;

    const global = i18n.global;

    if (global.locale && typeof global.locale === "object" && "value" in global.locale) {
        global.locale.value = locale;
        return true;
    }

    if (typeof global.locale === "string") {
        global.locale = locale;
        return true;
    }

    if (global.locale && typeof global.locale === "function") {
        try {
            global.locale(locale);
            return true;
        } catch (e) {
            return false;
        }
    }

    return false;
}

// Vue plugin：
// 1) 宿主已创建 i18n：传入 { i18n }，我们只 merge 词条并记录全局引用
// 2) 宿主未使用 i18n：直接 app.use(Jx3boxUiI18n, { locale: "zh-CN" }) 即可
export const Jx3boxUiI18n = {
    install(app, options = {}) {
        const { i18n, ...rest } = options || {};

        if (i18n) {
            mergeJx3boxUiMessages(i18n);
            setJx3boxUiI18n(i18n);
            return;
        }

        const created = createJx3boxUiI18n(rest);
        app.use(created);
    },
};

