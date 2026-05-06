<template>
    <section class="c-footer-resource">
        <h3 class="c-footer-resource__title">
            {{ $jx3boxT("jx3boxUi.commonFooter.downloadCenter", "下载中心") }}
        </h3>
        <div class="c-footer-resource__grid">
            <div v-for="item in downloadLinks" :key="item.name">
                <el-popover v-if="item.qrcode" trigger="hover" placement="top" popper-class="c-footer--v4__popover">
                    <div class="c-footer-resource__qrcode">
                        <img
                            class="c-footer-resource__qrcode-img"
                            :src="item.qrcode"
                            :alt="getDownloadName(item)"
                        />
                        <span class="c-footer-resource__qrcode-label">{{ getDownloadLabel(item) }}</span>
                    </div>
                    <template #reference>
                        <a
                            class="c-footer-resource__download"
                            :href="item.href || '#'"
                            :target="item.href ? '_blank' : null"
                            :rel="item.href ? 'noopener noreferrer' : null"
                            @click="handleLinkClick($event, item)"
                        >
                            <span class="c-footer-resource__download-icon">
                                <img :src="item.icon" :alt="getDownloadName(item)" />
                            </span>
                            <span>{{ getDownloadName(item) }}</span>
                        </a>
                    </template>
                </el-popover>
                <el-popover
                    v-else-if="item.placeholder"
                    trigger="hover"
                    placement="top"
                    :show-after="150"
                    popper-class="c-footer--v4__popover"
                >
                    <div class="c-footer-resource__placeholder">
                        {{ item.placeholder }}
                    </div>
                    <template #reference>
                        <a
                            class="c-footer-resource__download"
                            :href="item.href || '#'"
                            :target="item.href ? '_blank' : null"
                            :rel="item.href ? 'noopener noreferrer' : null"
                            @click="handleLinkClick($event, item)"
                        >
                            <span class="c-footer-resource__download-icon">
                                <img :src="item.icon" :alt="getDownloadName(item)" />
                            </span>
                            <span>{{ getDownloadName(item) }}</span>
                        </a>
                    </template>
                </el-popover>
                <a
                    v-else
                    class="c-footer-resource__download"
                    :href="item.href || '#'"
                    :target="item.href ? '_blank' : null"
                    :rel="item.href ? 'noopener noreferrer' : null"
                    @click="handleLinkClick($event, item)"
                >
                    <span class="c-footer-resource__download-icon">
                        <img :src="item.icon" :alt="getDownloadName(item)" />
                    </span>
                    <span>{{ getDownloadName(item) }}</span>
                </a>
            </div>
        </div>

        <div class="c-footer-resource__qqbot">
            <div class="c-footer-resource__qqbot-main">
                <div
                    @click="gotoQQbot"
                    class="c-footer-resource__qqbot-icon"
                >
                    <img
                        svg-inline
                        src="../../assets/img/common/qqbot.svg"
                        :alt="$jx3boxT('jx3boxUi.commonFooter.qqBot', 'QQ机器人')"
                    />
                </div>
                <div @click="copyText('3889010020')" class="c-footer-resource__qqbot-text">
                    <p class="c-footer-resource__qqbot-label">
                        {{ $jx3boxT("jx3boxUi.commonFooter.qqBotService", "QQ 机器人服务") }}
                    </p>
                    <p class="c-footer-resource__qqbot-number">3889 010 020</p>
                </div>
            </div>
            <a
                class="c-footer-resource__qqbot-button"
                href="tencent://AddContact/?uin=3889010020&Site=www.jx3box.com&Menu=yes"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ $jx3boxT("jx3boxUi.commonFooter.add", "添加") }}
            </a>
        </div>
    </section>
</template>

<script>
import { copyText } from "../../utils";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "FooterResource",
    mixins: [i18nMixin],
    props: [],
    components: {},
    data: function () {
        return {
            downloadLinks: [
                {
                    key: "appStore",
                    name: "App Store",
                    href: "",
                    icon: require("../../assets/img/common/ios.svg"),
                    // qrcode: require("../../assets/img/common/ios.jpg"),
                    placeholder: "即将上线",
                },
                {
                    key: "android",
                    name: "Android",
                    href: "",
                    icon: require("../../assets/img/common/android.svg"),
                    // qrcode: require("../../assets/img/common/android.jpg"),
                    placeholder: "即将上线",
                },
                {
                    key: "harmonyNext",
                    name: "鸿蒙 NEXT",
                    href: "",
                    icon: require("../../assets/img/common/harmony.svg"),
                    // qrcode: require("../../assets/img/common/harmony.jpg"),
                    placeholder: "即将上线",
                },
                {
                    key: "miniProgram",
                    name: "小程序",
                    labelKey: "jx3boxHelper",
                    label: "JX3BOX小助手",
                    href: "",
                    icon: require("../../assets/img/common/miniprogram.svg"),
                    qrcode: require("../../assets/img/common/miniprogram.jpg"),
                },
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {
        copyText,
        getDownloadName(item) {
            if (item?.key) {
                const k = item.key === "harmonyNext" ? "harmonyNext" : item.key;
                const maybe = `jx3boxUi.commonFooter.${k}`;
                return this.$jx3boxT(maybe, item.name || k);
            }
            return item?.name || "";
        },
        getDownloadLabel(item) {
            if (item?.labelKey)
                return this.$jx3boxT(`jx3boxUi.commonFooter.${item.labelKey}`, item.label || item.labelKey);
            return item?.label || "";
        },
        handleLinkClick(e, item) {
            if (!item?.href) e.preventDefault();
        },
        gotoQQbot() {
            window.open("/qqbot", "_blank");
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
/* src/footer/resource.vue */
.c-footer-resource {
    @media (min-width: 1024px) {
        grid-column: 9 / span 4;
    }

    &__title {
        margin: 0;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.025em;
    }

    &__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        margin-top: 16px;

        @media (min-width: 640px) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    &__qrcode {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
    }

    &__qrcode-img {
        width: 128px;
        height: 128px;
        border-radius: 6px;
        object-fit: cover;
    }

    &__qrcode-label {
        margin-top: 8px;
        font-size: 12px;
        font-weight: 900;
        line-height: 16px;
    }

    &__placeholder {
        padding: 12px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
    }

    &__download {
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 16px;
        border: 1px solid #374151;
        border-radius: 12px;
        background: #1f2937;
        color: #d1d5db;
        font-size: 12px;
        line-height: 16px;
        text-decoration: none;
        transition: background-color 0.2s ease, border-color 0.2s ease;

        &:hover {
            border-color: #3b82f6;
            background: #374151;
        }
    }

    &__download-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-right: 10px;

        img {
            display: block;
            width: 16px;
            height: 16px;
        }
    }

    &__qqbot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        padding: 16px;
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 12px;
        background-image: linear-gradient(90deg, rgba(30, 64, 175, 0.2), rgba(31, 41, 55, 0.4));
    }

    &__qqbot-main {
        display: flex;
        align-items: center;

        > * + * {
            margin-left: 12px;
        }
    }

    &__qqbot-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        cursor: pointer;

        svg,
        img {
            display: block;
            width: 24px;
            height: 24px;
        }
    }

    &__qqbot-text {
        cursor: pointer;
    }

    &__qqbot-label {
        margin: 0;
        color: #6b7280;
        font-size: 10px;
        font-weight: 700;
        line-height: 14px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    &__qqbot-number {
        margin: 4px 0 0;
        color: #fff;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
    }

    &__qqbot-button {
        padding: 6px 12px;
        border-radius: 6px;
        background: #2563eb;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        text-decoration: none;
        transition: background-color 0.2s ease;

        &:hover {
            background: #3b82f6;
        }
    }
}
</style>
