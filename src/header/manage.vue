<template>
    <div class="c-header-panel c-header-manage" id="c-header-manage">
        <span class="u-post u-manage">
            <i class="u-pop" style="display: none" v-show="showPop || !isAuth"></i>
            <!-- <manageIcon class="u-add" /> -->
            <img class="u-add" svg-inline src="../../assets/img/common/manage.svg" alt="扩展中心">
        </span>
        <ul class="u-menu u-pop-content">
            <template v-for="item in userPanel">
                <li :key="item.label" v-if="item.remark == 'auth' ? !isAuth : true">
                    <a :href="item.link" :target="item.target || '_self'" class="u-menu-item" @click="onClick(item)">
                        <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        {{ item.label }}
                        <span v-if="showPop" class="u-new">New!</span>
                        <span v-if="item.remark == 'auth' && !isAuth" class="u-new">New!</span>
                    </a>
                </li>
            </template>
            <template v-if="isTeammate">
                <hr v-if="adminPanel.length" />
                <li v-for="item in adminPanel" :key="item.label">
                    <a :href="item.link" :target="item.target || '_self'" class="u-menu-item">
                        <img :src="resolveImg(item.icon)" class="u-menu-icon" :alt="item.icon" />
                        {{ item.label }}
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
// import manageIcon from "@/assets/img/components/common/header/manage.svg";
const { __imgPath } = JX3BOX;
const defaultPanel = [
    {
        label: "管理中心",
        link: "/os",
        onlyAdmin: true,
    },
];
export default {
    name: "Manage",
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
    },
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
    },
    mounted() {
        this.loadPanel();
    },
    methods: {
        loadPanel: function () {
            try {
                const panel = JSON.parse(sessionStorage.getItem("panel"));
                if (panel) {
                    this.panel = panel;
                    const item = this.panel?.find((i) => i.meta);
                    this.initMeta(item);
                } else {
                    getMenu("panel").then((res) => {
                        this.panel = res.data?.data?.val;
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
        resolveImg: function (img) {
            return img ? __imgPath + "image/header/panel/" + img : __imgPath + "image/header/panel/default.svg";
        },
        initMeta(item) {
            const local = localStorage.getItem("jb_panel_meta");

            if (local) {
                this.showPop = item?.meta && item?.meta != local;
            } else {
                localStorage.setItem("jb_panel_meta", item?.meta);
                this.showPop = true;
            }
        },
        onClick(item) {
            if (item.meta) {
                localStorage.setItem("jb_panel_meta", item.meta);
                this.showPop = false;
            }
        },
    },
};
</script>

<style lang="less">
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
            font-weight: 500;

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
    }

    .u-pop {
        width: 10px;
        height: 10px;
        color: #fff;
        background-image: linear-gradient(#fcd14f, #d7a20b);
        background-clip: padding-box;
        border: 2px solid #24292e;
        border-radius: 50%;
        position: absolute;
        right: 4px;
        top: 18px;
        z-index: 1;
    }

    .u-new {
        font-size: 12px;
        margin-left: 4px;
        background-color: @v4primary-dark;
        color: #fff;
        padding: 0px 6px;
    }
}
</style>
