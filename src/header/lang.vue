<template>
    <div class="c-header-panel c-lang-switcher" id="c-header-lang-switcher">
        <span class="u-translator" href="/dashboard/boxcoin">
            <img
                class="u-icon"
                svg-inline
                src="../../assets/img/common/lang.svg"
                :alt="$jx3boxT('jx3boxUi.header.langSwitch', '语言切换')"
            />
        </span>
        <ul class="u-menu u-pop-content">
            <li
                v-for="item in langs"
                :key="item.key"
                @click="onLangChange(item)"
                :class="{ 'is-active': item.key === currentLang, 'is-disabled': item.disabled }"
            >
                <a>{{ item.name }}</a>
            </li>
        </ul>
    </div>
</template>

<script>
// import langIcon from "@/assets/img/components/common/header/lang.svg";
import { getJx3boxUiAvailableLocales, setJx3boxUiLocale } from "../../i18n";
import i18nMixin from "../../i18n/mixin";

function normalizeLocaleKey(key) {
    if (!key) return null;
    const lower = String(key).toLowerCase();
    if (lower === "zh-cn") return "zh-CN";
    if (lower === "en-us") return "en-US";
    if (lower === "zh-tw") return "zh-TW";
    return key;
}

export default {
    name: "langSwitch",
    mixins: [i18nMixin],
    components: {
        // langIcon,
    },
    data() {
        const supported = getJx3boxUiAvailableLocales();
        return {
            langs: [
                {
                    name: "简体中文",
                    key: "zh-cn",
                    disabled: !supported.includes("zh-CN"),
                },
                {
                    name: "繁体中文",
                    key: "zh-tw",
                    disabled: !supported.includes("zh-TW"),
                },
                {
                    name: "Tiếng Việt",
                    key: "vi",
                    disabled: !supported.includes("vi"),
                },
                {
                    name: "English",
                    key: "en-us",
                    disabled: !supported.includes("en-US"),
                },
            ], // 语言列表 简体中文、繁体中文、英文、越南语
            currentLang: "zh-cn", // 当前语言
        };
    },
    mounted() {
        const lang = localStorage.getItem("lang") || "zh-cn";
        this.currentLang = lang;
        const normalized = normalizeLocaleKey(lang);
        normalized && setJx3boxUiLocale(normalized);
    },
    methods: {
        onLangChange({ disabled, key }) {
            if (disabled) return;
            localStorage.setItem("lang", key);
            this.currentLang = key;

            const normalized = normalizeLocaleKey(key);
            if (!normalized) return;

            const ok = setJx3boxUiLocale(normalized);
            if (!ok) location.reload();
        },
    },
};
</script>

<style lang="less">
.c-lang-switcher {
    .u-translator {
        padding: 0 10px;
        width: 14;
        height: 100%;
        .flex;
        align-items: center;
        .pointer;
        &:hover {
            .tm(0.7);
        }
    }
    .u-icon {
        .size(19px);
    }
    li {
        &.is-active {
            a {
                color: @v4primary;
                font-weight: 600;
            }
        }
        &.is-disabled {
            a {
                color: #999;
                cursor: not-allowed;
            }
            &:hover a {
                // .tm(0);
                background-color: #fff;
                color: #999;
            }
        }
    }
}
@media screen and (max-width: @phone) {
    .c-lang-switcher {
        display: none;
    }
}
</style>
