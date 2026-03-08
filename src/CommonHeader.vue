<template>
    <header class="c-header" id="c-header" :class="{ isOverlay: overlayEnable && isOverlay }" v-if="!isApp">
        <div class="c-header-inner">
            <!-- logo -->
            <header-logo />

            <!-- client -->
            <header-client :defaultValue="client" />

            <!-- search -->
            <header-search :client="client" />

            <!-- nav -->
            <header-nav :client="client" />

            <slot></slot>

            <!-- user -->
            <header-user ref="user" :client="client" :asset="asset" />
        </div>
        <!-- <header-box class="c-header-jx3box" :overlayEnable="overlayEnable" :client="client" /> -->
    </header>
</template>

<script>
// 外部模块
import _ from "lodash";

// 子模块
import logo from "./header/logo.vue";
import client from "./header/client.vue";
import search from "./header/search.vue";
import nav from "./header/nav.vue";
import user from "./header/user.vue";
// import box from "./header/box.vue";

// 移动端适配
const KW = "jx3boxApp";
import { isMiniProgram, miniprogramHack, isApp as checkIsApp } from "@jx3box/jx3box-common/js/utils";
import miniprogram from "@jx3box/jx3box-common/data/miniprogram.json";

// 数据
import { getGlobalConfig } from "../service/header";
import User from "@jx3box/jx3box-common/js/user.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "Header",
    components: {
        "header-logo": logo,
        "header-client": client,
        "header-search": search,
        "header-nav": nav,
        "header-user": user,
        // "header-box": box,
    },
    props: ["overlayEnable"],
    data: function () {
        return {
            isOverlay: false,
            isApp: checkIsApp(),

            asset: {},
        };
    },
    computed: {
        client: function () {
            return location.hostname.includes("origin") ? "origin" : "std";
        },
        siteRoot: function () {
            return location.host.includes("origin") ? JX3BOX.__OriginRoot : JX3BOX.__Root;
        },
    },
    methods: {
        // webView检测
        checkIsWebView: function () {
            if (window.navigator.userAgent.includes(KW)) {
                document.documentElement.classList.add("env-app");
            }

            const urlParams = new URLSearchParams(window.location.search);
            const from = urlParams.get("from");
            from && sessionStorage.setItem("from", from);
            if (isMiniProgram() || checkIsApp()) {
                const appid = urlParams.get("appid");
                const item = miniprogram?.find((item) => item.appid === appid);
                const from = urlParams.get("_from");

                document.documentElement.classList.add("v-miniprogram");

                if (from) {
                    document.documentElement.classList.add("from-" + from);
                }

                if (appid && item) {
                    document.documentElement.classList.add("env-miniprogram-" + item.id);

                    window.JX3BOX_ENV = item.id?.toUpperCase() + "_MINIPROGRAM";
                } else {
                    document.documentElement.classList.add("wechat-miniprogram");

                    window.JX3BOX_ENV = "MINIPROGRAM";

                    // 微信小程序hack
                    miniprogramHack();
                }
            }

            // 如果来自推栏
            if (sessionStorage.getItem("from") == "tl") {
                document.documentElement.classList.add("v-miniprogram");
            }
        },

        // 检查
        init: function () {
            this.checkIsWebView();

            const token = this.getUrlParam("__token");
            const env = this.getUrlParam("__env");
            env && localStorage.setItem("__env", env);

            token && localStorage.setItem("__token", token);

            if (User.isLogin()) {
                this.loadAsset();
            }

            // 获取全局配置
            getGlobalConfig().then(async (res) => {
                const global_token_version = res.token_version;
                const token_version = localStorage.getItem("token_version");

                if (User.isLogin()) {
                    // 对于没有token_version或者token_version不是最新的用户，都需要登出
                    if (!token_version || token_version != global_token_version) {
                        // 先保存最新的token_version
                        localStorage.setItem("token_version", global_token_version);
                        // 然后执行登出操作
                        User.destroy().then(() => {
                            this.$refs.user?.logout();
                            // 清除马甲所有马甲信息
                            let keys = Object.keys(localStorage);
                            let alternate = keys.filter((key) => key.startsWith("jx3box-alternate-"));

                            alternate.forEach((key) => {
                                localStorage.removeItem(key);
                            });

                            if (
                                location.pathname.startsWith("/dashboard") ||
                                location.pathname.startsWith("/publish")
                            ) {
                                location.href = this.siteRoot;
                            }
                        });
                    }
                } else {
                    // 非登录状态也更新token_version，确保用户下次登录时使用新版本
                    if (global_token_version) {
                        localStorage.setItem("token_version", global_token_version);
                    }
                }
            });
        },

        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r ? decodeURIComponent(r[2]) : null;
        },
        // 资产
        loadAsset: function () {
            User.getAsset().then((data) => {
                this.asset = data;

                const level = User.getLevel(this.asset?.experience);

                if (level > 2) {
                    document.documentElement.classList.add("is-comment-show");
                }
            });
        },
    },
    created: function () {
        this.init();

        if (this.overlayEnable) {
            this.__overlayScrollHandler = _.throttle(() => {
                this.isOverlay = window.scrollY > 200 ? true : false;
            }, 200);
            window.addEventListener("scroll", this.__overlayScrollHandler, { passive: true });
            this.__overlayScrollHandler();
        }
    },
    beforeUnmount: function () {
        if (this.__overlayScrollHandler) {
            window.removeEventListener("scroll", this.__overlayScrollHandler);
            this.__overlayScrollHandler.cancel && this.__overlayScrollHandler.cancel();
            this.__overlayScrollHandler = null;
        }
    },
    mounted: function () {},
};
</script>

<style lang="less">
.c-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 601;

    width: 100%;
    height: @header-height;

    background-color: @header-bg;
    color: #fff;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    transition: 0.5s ease-in-out;
}
.c-header.isOverlay {
    background-color: rgba(0, 0, 0, 0.85);
}
.c-header-inner {
    &:after {
        content: "";
        display: table;
        clear: both;
    }
    .flex;
}
@media print {
    .c-header {
        .none;
    }
}

@media screen and (max-width: @phone) {
    .env-app,
    .v-miniprogram,
    .wechat-miniprogram {
        .c-header {
            .none;
        }
        body {
            padding-top: 0;
        }
    }

    .wechat-miniprogram {
        .c-header {
            .none;
        }
    }
}
</style>
