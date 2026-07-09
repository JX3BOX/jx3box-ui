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
            <template v-for="item in userPanel">
                <li :key="item.label" v-if="item.remark == 'auth' ? !isAuth : true">
                    <a :href="item.link" :target="item.target || '_self'" class="u-menu-item" @click="onClick(item)">
                        <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        {{ getPanelLabel(item) }}
                        <span v-if="showPop" class="u-new">New!</span>
                        <span v-if="item.remark == 'auth' && !isAuth" class="u-new">New!</span>
                    </a>
                    <a
                        v-if="isFeaturePanelItem(item) && hasAccountReadyIssue"
                        href="javascript:;"
                        class="u-menu-item u-menu-item--account-ready"
                        @click.prevent="openAccountReady"
                    >
                        <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        资料完善
                        <span class="u-new u-new--important">重要</span>
                    </a>
                </li>
            </template>
            <template v-if="isTeammate">
                <hr v-if="adminPanel.length" />
                <li v-for="item in adminPanel" :key="item.label">
                    <a :href="item.link" :target="item.target || '_self'" class="u-menu-item">
                        <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        {{ getPanelLabel(item) }}
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import { getMenu } from "../../service/header";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
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
                return !item.onlyAdmin;
            });
        },
        adminPanel: function () {
            return this.panel.filter((item) => {
                return item.onlyAdmin;
            });
        },
        isAuth() {
            return User.isPhoneMember();
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
        .u-menu-item {
            .flex;
            align-items: center;
            gap: 4px;

            &:hover {
                .u-menu-icon {
                    filter: invert(100%) sepia(0%) saturate(5658%) hue-rotate(215deg) brightness(114%) contrast(106%);
                }
                .u-new {
                    color: #fff;
                }
            }
        }
        .u-menu-icon {
            width: 16px;
            height: 16px;
        }
    }

    hr {
        border: 0;
        border-top: 1px solid #eee;
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
        font-size: 12px;
        margin-left: 4px;
        background-color: @v4primary-dark;
        color: #fff;
        padding: 0px 6px;
    }

    .u-new--important {
        background-color: #f56c6c;
    }

    .u-menu-item--account-ready {
        color: #f56c6c;
    }
}
</style>
