<template>
    <div class="c-header-panel c-header-manage" id="c-header-manage">
        <span class="u-post u-manage">
            <i class="u-icon u-icon-msg">
                <i class="u-pop" style="display: none" v-show="showPanelPop"></i>
                <!-- <manageIcon class="u-add" /> -->
                <img
                    class="u-add"
                    svg-inline
                    src="../../assets/img/common/manage.svg"
                    :alt="$jx3boxT('jx3boxUi.commonHeader.manageCenter', '扩展中心')"
                />
            </i>
        </span>
        <ul class="u-menu u-pop-content">
            <template v-for="item in userPanel" :key="item.label">
                <li>
                    <a :href="item.link" :target="item.target || '_self'" class="u-menu-item" @click="onClick(item)">
                        <span class="u-menu-icon-wrap">
                            <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        </span>
                        <span class="u-menu-label">{{ getPanelLabel(item) }}</span>
                        <span v-if="showPop && isFeaturePanelItem(item)" class="u-new">New!</span>
                    </a>
                    <a
                        v-if="isFeaturePanelItem(item) && hasAccountReadyIssue"
                        href="javascript:;"
                        class="u-menu-item u-menu-item--account-ready"
                        @click.prevent="openAccountReady"
                    >
                        <span class="u-menu-icon-wrap">
                            <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        </span>
                        <span class="u-menu-label">资料完善</span>
                        <span class="u-new u-new--important">重要</span>
                    </a>
                </li>
            </template>
            <template v-if="isTeammate">
                <hr v-if="adminPanel.length" />
                <li v-for="item in adminPanel" :key="item.label">
                    <a :href="item.link" :target="item.target || '_self'" class="u-menu-item">
                        <span class="u-menu-icon-wrap">
                            <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        </span>
                        <span class="u-menu-label">{{ getPanelLabel(item) }}</span>
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import { getMenu } from "../../service/header";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
import { getConfig } from "../../service/cms";
// import manageIcon from "@/assets/img/components/common/header/manage.svg";
const { __imgPath } = JX3BOX;
const NOTICE_POP_KEY = "notice_pop";
const defaultPanel = [
    {
        key: "manageCenter",
        label: "管理中心",
        link: "/os",
        onlyAdmin: true,
    },
];
export default {
    name: "Manage",
    mixins: [i18nMixin],
    components: {
        // manageIcon,
    },
    data() {
        return {
            panel: defaultPanel,
            showPop: false,
        };
    },
    props: {
        isTeammate: {
            type: Boolean,
            default: false,
        },
        importantNotice: {
            type: Object,
            default: null,
        },
        importantNoticeUrl: {
            type: Object,
            default: null,
        },
        headerConfigLoaded: {
            type: Boolean,
            default: true,
        },
        headerConfigManaged: {
            type: Boolean,
            default: false,
        },
        accountReadyIssues: {
            type: Array,
            default: () => [],
        },
        accountReadyIncomplete: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["open-account-ready"],
    computed: {
        userPanel: function () {
            return this.panel.filter((item) => {
                return !item.onlyAdmin && item.remark !== "auth";
            });
        },
        adminPanel: function () {
            return this.panel.filter((item) => {
                return item.onlyAdmin;
            });
        },
        hasAccountReadyIssue() {
            return this.accountReadyIncomplete;
        },
        showPanelPop() {
            return this.showPop || this.hasAccountReadyIssue;
        },
    },
    mounted() {
        if (this.headerConfigLoaded) {
            this.loadPanel();
        }
    },
    watch: {
        headerConfigLoaded: function (val) {
            if (val) {
                this.loadPanel();
            }
        },
    },
    methods: {
        getPanelLabel(item) {
            if (item?.key) return this.$jx3boxT(`jx3boxUi.commonHeader.panel.${item.key}`, item.label || item.key);
            return item?.label || "";
        },
        isFeaturePanelItem(item = {}) {
            return item.remark === "feature" || !!item.meta || item.key === "featureUpdate" || item.label === "功能更新";
        },
        loadPanel: async function () {
            try {
                const panel = JSON.parse(sessionStorage.getItem("panel"));
                const noticeConfig = await this.getNoticeConfig("important_notice", this.importantNotice);
                const noticeUrlConfig = await this.getNoticeConfig("important_notice_url", this.importantNoticeUrl);
                if (panel) {
                    this.panel = this.applyNoticeConfig(panel, noticeConfig, noticeUrlConfig);
                    const item = this.panel?.find((i) => i.meta);
                    this.initMeta(item);
                    sessionStorage.setItem("panel", JSON.stringify(this.panel));
                } else {
                    getMenu("panel").then((res) => {
                        this.panel = this.applyNoticeConfig(res.data?.data?.val, noticeConfig, noticeUrlConfig);
                        const item = this.panel?.find((i) => i.meta);
                        this.initMeta(item);
                        sessionStorage.setItem("panel", JSON.stringify(this.panel));
                    });
                }
            } catch (e) {
                this.panel = defaultPanel;
                console.log("loadPanel error", e);
            }
        },
        getNoticeConfig: async function (key, config) {
            if (config) return config;
            if (this.headerConfigManaged) return null;
            return await getConfig({ key }).catch(() => null);
        },
        applyNoticeConfig: function (panel = [], noticeConfig, noticeUrlConfig) {
            const items = panel?.length ? panel : defaultPanel;
            return items.map((item) => {
                if (item.remark !== "feature") return item;
                return {
                    ...item,
                    link: noticeUrlConfig?.val || item.link,
                    meta: noticeConfig?.val || item.meta,
                };
            });
        },
        resolveImg: function (img) {
            return img ? __imgPath + "image/header/panel/" + img : __imgPath + "image/header/panel/default.svg";
        },
        initMeta(item) {
            const meta = item?.meta;
            const local = localStorage.getItem(NOTICE_POP_KEY);
            this.showPop = !!meta && meta != local;
        },
        onClick(item) {
            if (item.meta) {
                localStorage.setItem(NOTICE_POP_KEY, item.meta);
                this.showPop = false;
            }
        },
        openAccountReady() {
            this.$emit("open-account-ready", this.accountReadyIssues);
        },
    },
};
</script>

<style lang="less">
/* src/header/manage.vue */
// 管理菜单
.c-header-manage {
    height: 100%;

    .u-manage {
        padding: 0 10px 0 8px;
        height: 100%;
        .flex;
        align-items: center;
    }
    .u-menu {
        width: 272px;
        box-sizing: border-box;
        right: -10px;
        top: calc(100% + 8px);
        margin: 0;
        padding: 8px;
        border: 1px solid rgba(31, 35, 41, 0.1);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 12px 36px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);

        &:before {
            right: 16px;
            top: -14px;
            border-width: 7px;
            border-bottom-color: rgba(31, 35, 41, 0.1);
        }

        &:after {
            right: 17px;
            top: -12px;
            border-width: 6px;
            border-bottom-color: #fff;
        }

        li {
            margin: 0;
        }

        .u-menu-item {
            .flex;
            align-items: center;
            gap: 10px;
            min-height: 44px;
            box-sizing: border-box;
            padding: 8px 10px;
            border-radius: 8px;
            color: #303133;
            font-size: 14px;
            line-height: 20px;
            text-decoration: none;
            transition: background-color 0.16s ease, color 0.16s ease;

            &:hover {
                color: #4338ca;
                background: #f4f3ff;

                .u-menu-icon-wrap {
                    background: #e8e7ff;
                }

                .u-menu-icon {
                    opacity: 0.9;
                }
            }
        }

        .u-menu-icon-wrap {
            .flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            flex: 0 0 30px;
            border-radius: 8px;
            background: #f3f4f6;
            transition: background-color 0.16s ease;
        }

        .u-menu-icon {
            width: 18px;
            height: 18px;
            opacity: 0.72;
        }

        .u-menu-label {
            flex: 1;
            min-width: 0;
            font-weight: 500;
            letter-spacing: 0.01em;
        }
    }

    hr {
        border: 0;
        border-top: 1px solid #eef0f3;
        margin: 6px 4px;
    }

    .u-icon-msg {
        .pr;
        .size(18px);
    }

    .u-pop {
        width: 10px;
        height: 10px;
        color: #fff;
        background-image: linear-gradient(#fcd14f, #d7a20b);
        background-clip: padding-box;
        border: 2px solid @header-bg;
        border-radius: 50%;
        position: absolute;
        right: -5px;
        top: -4px;
        z-index: 1;
    }

    .u-new {
        flex: 0 0 auto;
        box-sizing: border-box;
        min-width: 38px;
        margin-left: 4px;
        padding: 2px 7px;
        border: 1px solid #d9d6fe;
        border-radius: 999px;
        background: #eeedff;
        color: #4f46e5;
        font-size: 11px;
        font-weight: 700;
        line-height: 16px;
        text-align: center;
    }

    .u-new--important {
        border-color: #ffd1d1;
        background: #fff0f0;
        color: #e5484d;
    }

    .u-menu-item--account-ready {
        color: #303133;

        &:hover {
            color: #d9363e;
            background: #fff5f5;

            .u-menu-icon-wrap {
                background: #ffe8e8;
            }
        }
    }
}
</style>
