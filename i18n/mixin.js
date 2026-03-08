import { tGlobal } from "./index";

function formatFallback(text, values) {
    if (!values) return text;
    return String(text).replace(/\{(\w+)\}/g, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(values, key) && values[key] != null) return String(values[key]);
        return match;
    });
}

export default {
    methods: {
        $jx3boxT(key, fallback, values) {
            if (typeof this.$t === "function") {
                const res = this.$t(key, values);
                if (res === key && fallback != null) return formatFallback(fallback, values);
                return res;
            }
            return formatFallback(tGlobal(key, values, fallback ?? key), values);
        },
    },
};

