<template>
    <div class="c-header-panel c-header-info">
        <div class="c-header-profile" id="c-header-profile">
            <img class="u-avatar" :src="showAvatar(user.user_avatar)" />
            <template v-if="isPhone">
                <ul class="u-menu u-pop-content">
                    <li>
                        <a href="/dashboard">个人中心</a>
                    </li>
                    <li>
                        <a :href="url.msg">消息中心</a>
                    </li>
                    <li>
                        <a :href="url.publish">发布中心</a>
                    </li>
                    <hr />
                    <li v-for="item in userPanel" :key="item.label">
                        <a :href="item.link" :target="item.target || '_self'">
                            <!-- <i :class="item.icon || 'el-icon-present'"></i> -->
                            {{ item.label }}
                        </a>
                    </li>
                    <template v-if="isTeammate">
                        <li v-for="item in adminPanel" :key="item.label">
                            <a :href="item.link" :target="item.target || '_self'">
                                <!-- <i :class="item.icon || 'el-icon-present'"></i> -->
                                {{ item.label }}
                            </a>
                        </li>
                    </template>
                    <li>
                        <a @click="logout">退出登录</a>
                    </li>
                </ul>
            </template>
            <template v-else>
                <div class="c-header-userdata u-pop-content">
                    <div class="u-profile">
                        <div class="u-basic">
                            <a class="u-displayname" :href="url.homepage" :title="user.display_name" target="_blank">{{
                                showUserName(user.display_name)
                            }}</a>
                            <a class="u-sign" href="/dashboard/cooperation">
                                <img
                                    :src="super_author_icon"
                                    class="u-superauthor-profile"
                                    alt="superauthor"
                                    title="签约作者"
                                    :class="{ off: !isSuperAuthor }"
                            /></a>
                            <a
                                class="u-vip"
                                href="/vip/premium?from=header_usermenu"
                                target="_blank"
                                title="专业版账号"
                            >
                                <i class="i-icon-vip" :class="{ on: isPRO }">{{ vipType }}</i>
                                <span class="u-expire" v-if="isPRO">（有效期至：{{ pro_expire_date }}）</span>
                            </a>
                        </div>
                        <div class="u-id">
                            <span
                                >魔盒UID：<b>{{ user.ID }}</b></span
                            >
                            <el-icon class="el-icon-document-copy u-copy" @click.stop="copyText(user.ID)"
                                ><DocumentCopy
                            /></el-icon>
                        </div>
                    </div>

                    <el-button-group class="u-actions">
                        <a class="el-button el-button--default is-plain" href="/dashboard">个人中心</a>
                        <a class="el-button el-button--default is-plain" @click="changeAlternate">切换马甲</a>
                        <a class="el-button el-button--default is-plain" href="/dashboard/frame">主题风格</a>
                    </el-button-group>

                    <div class="u-other">
                        <a href="/dashboard/role" class="u-item"
                            ><el-icon><Sunny /></el-icon>角色管理
                        </a>
                        <a href="/dashboard/fav" class="u-item"
                            ><el-icon><Star /></el-icon>收藏订阅
                        </a>
                        <a href="/dashboard/purchases" class="u-item"
                            ><el-icon><ShoppingBag /></el-icon>已购资源
                        </a>
                        <a href="/dashboard/mall" class="u-item"
                            ><el-icon><Memo /></el-icon>订单中心
                        </a>
                        <hr />
                        <a href="/dashboard/feedback" class="u-item"
                            ><el-icon><Phone /></el-icon>反馈帮助
                        </a>
                        <hr />
                        <div class="u-logout">
                            <el-button @click="logout" plain>退出登录</el-button>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <alternate></alternate>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getMyInfo } from "../../service/author";
import { showDate } from "@jx3box/jx3box-common/js/moment";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { copyText } from "./utils";
import { getMenu } from "../../service/header";
import Bus from "./bus";
import alternate from "./alternate.vue";

const { __Links, __Root, __imgPath, __OriginRoot } = JX3BOX;
export default {
    name: "info",
    props: ["asset"],
    emits: ["update"],
    components: {
        alternate,
    },
    data() {
        return {
            isPhone: window.innerWidth < 768,
            // 登录信息
            user: User.getInfo(),
            // links
            url: {
                msg: __Links.dashboard.msg,
                publish: __Links.dashboard.publish,
                dashboard: __Links.dashboard.home,
                profile: __Links.dashboard.profile,
                homepage: "/author/" + User.getInfo().uid,
            },

            isSuperAuthor: false,

            panel: [],
            isTeammate: false,
        };
    },
    computed: {
        siteRoot: function () {
            return location.host.includes("origin") ? __OriginRoot : __Root;
        },
        super_author_icon: function () {
            return __imgPath + "image/user/" + "superauthor.svg";
        },
        vipType: function () {
            return "PRO";
        },
        isPRO: function () {
            return User._isPRO(this.asset) || false;
        },
        isAdmin() {
            return User.isAdmin();
        },
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
        pro_expire_date: function () {
            return this.asset.pro_expire_date ? showDate(this.asset.pro_expire_date) : "-";
        },
    },
    mounted() {
        this.loadMyInfo();
        this.loadPanel();
    },
    methods: {
        copyText,
        showAvatar,
        logout: function (mute = false) {
            User.destroy()
                .then(() => {
                    this.$emit("logout");

                    // 清除马甲所有马甲信息
                    let keys = Object.keys(localStorage);
                    let alternate = keys.filter((key) => key.startsWith("jx3box-alternate-"));

                    alternate.forEach((key) => {
                        localStorage.removeItem(key);
                    });

                    if (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/publish")) {
                        location.href = this.siteRoot;
                    }
                })
                .then(() => {
                    if (mute) return;
                    this.$notify({
                        title: "成功",
                        message: "登出成功",
                        type: "success",
                        duration: 1000,
                    });
                });
        },
        showUserName: function (val) {
            return val || "匿名";
        },
        loadMyInfo: function () {
            getMyInfo()
                .then((data) => {
                    this.user = data;
                    this.isSuperAuthor = !!data.sign;
                    this.isTeammate = this.user?.is_teammate;
                    localStorage.setItem("is_teammate", this.isTeammate);
                    const permissions = this.user?.permission?.map((item) => item.action)?.join(",");
                    localStorage.setItem("jx3box_permission", permissions);
                    this.$emit("update", this.user);
                })
                .catch((err) => {
                    if (err?.data.code < -1) {
                        this.logout(true);
                    }
                });
        },
        loadPanel: function () {
            try {
                const panel = JSON.parse(sessionStorage.getItem("panel"));
                if (panel) {
                    this.panel = panel;
                } else {
                    getMenu("panel").then((res) => {
                        this.panel = res.data?.data?.val;
                        sessionStorage.setItem("panel", JSON.stringify(this.panel));
                    });
                }
            } catch (e) {
                this.panel = [];
                console.log("loadPanel error", e);
            }
        },
        changeAlternate: function () {
            Bus.$emit("showAlternate");
        },
    },
};
</script>

<style lang="less">
//用户相关
.c-header-user {
    font-size: 14px;
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;

    .u-dropdown {
        border-bottom: 0 solid transparent;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top-style: solid;
        border-top-width: 4px;
        content: "";
        display: inline-block;
        height: 0;
        vertical-align: middle;
        width: 0;
    }
    svg {
        fill: #fff;
        .size(18px);
        &:hover {
            opacity: 0.7;
        }
    }

    .u-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .u-menu {
        .u-delta;
        padding: 5px 0;
        width: 160px;

        a {
            display: block;
            line-height: 21px;
            color: #454545;
            &:hover {
                color: #fff;
            }
            outline: none;
            text-decoration: none;
            overflow: hidden;
            padding: 5px 10px 5px 16px;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
                background-color: @v4primary;
            }
        }

        hr {
            .mt(2px);
            .mb(2px);
        }
    }

    .i-icon-vip {
        .dbi;
        vertical-align: baseline;
        padding: 2px 5px;
        .fz(12px, 14px);
        font-style: normal;
        border-radius: 2px;
        background-color: #ddd;
        color: #fff;
        &.on {
            background-color: #6f42c1;
        }
    }
    .u-expire,
    .u-vip-type {
        .fz(12px);
        // color:#999;
        .ml(5px);
    }
    .u-vip-left {
        color: #999;
        .ml(5px);
    }

    .u-superauthor-profile {
        width: 16px;
        vertical-align: -2px;
        display: inline-block;
        margin-right: 3px;
    }

    .off {
        filter: grayscale(100%);
    }
}

//操作面板
.c-header-panel {
    position: relative;
    height: 100%;
    user-select: none;
    cursor: pointer;
    box-sizing: border-box;

    .u-pop-content {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.15s, opacity 0.15s linear;
    }

    &:hover {
        .u-pop-content {
            opacity: 1;
            visibility: visible;
        }
    }

    .u-post {
        padding: 0 10px;
        height: 100%;
        .flex;
        align-items: center;
    }

    &.on {
        .u-menu {
            display: block;
        }
    }

    &:hover {
        .u-dropdown {
            opacity: 0.7;
        }
    }
}

@media screen and (max-width: @phone) {
    .c-header-panel {
        &:not(&.c-header-info) {
            display: none;
        }
    }
}

.c-header-info {
    height: 100%;
    .flex;
    align-items: center;
}

.c-header-userdata {
    .u-delta;
    &:after {
        border-bottom-color: #f4f6f7;
        right: 20px;
    }

    top: calc(100% + 17px);
    // padding: 5px 0;
    width: 400px;
}

// 用户信息
.c-header-profile {
    cursor: pointer;
    position: relative;
    padding: 4px 5px 2px 6px;

    .u-menu {
        margin-top: 8px;
    }
    .u-me {
        .nobreak;
        em {
            font-style: normal;
            color: #999;
            font-size: 12px;
        }
        b {
            .mr(3px);
        }
    }
    .u-vip {
        .u-icon-vip {
            .y(-2px);
        }
    }
    .u-name {
        line-height: 30px;
        padding: 0 16px;
        white-space: nowrap;
        word-wrap: normal;
        word-break: keep-all;
        text-overflow: ellipsis;
        overflow: hidden;
        b {
            font-weight: bold;
            display: block;
            float: left;

            white-space: nowrap;
            word-wrap: normal;
            word-break: keep-all;
            text-overflow: ellipsis;
            overflow: hidden;

            max-width: 60px;
        }
        span {
            color: #666;
            letter-spacing: 0.5px;
            margin-left: 3px;
        }
        cursor: default;
    }
    .u-avatar {
        vertical-align: middle;
        margin-right: 2px;
    }

    hr {
        margin: 8px 0;
        border-top: 1px solid @border-hr;
    }

    &.on {
        .u-menu {
            display: block;
        }
    }
    .u-hr {
        border-top: 1px solid @border-hr;
    }

    &:hover {
        .u-dropdown {
            opacity: 0.7;
        }
    }
}

.c-header-userdata {
    background-clip: padding-box;
    // background-color: #fff;
    color: #3d454d;
    border: 1px solid rgba(27, 31, 35, 0.15);
    border-radius: 4px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    right: 0;
    list-style: none;
    position: absolute;
    z-index: 820;
    top: 100%;
    width: 400px;
    margin-top: 10px;
    margin-right: -10px;

    .u-profile {
        background-color: #f4f6f7;
        padding: 12px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .u-expire {
        font-size: 12px;
        color: #999;
    }

    .u-basic {
        .flex;
        align-items: center;
        gap: 3px;
    }

    .u-displayname {
        .fz(15px);
        .nobreak;
        max-width: 200px;
        color: @color;
        .bold;
        &:hover {
            color: @v4primary;
        }
    }

    .u-id {
        font-size: 12px;
        color: #999;
        margin-top: 6px;
        .flex(y);
        b {
            color: @color;
        }
    }
    .u-copy {
        margin-left: 5px;
        .pointer;

        &:hover {
            color: @v4primary;
        }
    }

    .u-actions {
        width: 100%;
        .flex;

        .el-button {
            border-radius: 0;
            flex: 1;

            &:first-of-type {
                border-left-width: 0;
            }
            &:last-of-type {
                border-right-width: 0;
            }
        }
    }

    .u-other {
        padding: 10px 5px;
        .u-item {
            padding: 5px 10px;
            color: #454545;
            .flex(y);

            &:hover {
                background: @v4primary;
                color: #fff;
            }

            i {
                .mr(5px);
            }
        }
    }

    .u-logout {
        padding: 0 10px 10px 10px;
        .mt(10px);

        .el-button {
            width: 100%;
        }
    }
}
</style>
