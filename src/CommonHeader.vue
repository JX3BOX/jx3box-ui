<template>
    <header class="c-header" id="c-header" :class="{ isOverlay: overlayEnable && isOverlay }">
        <div class="c-header__inner c-header-inner">
            <!-- logo -->
            <header-logo class="c-header__logo" />

            <!-- client -->
            <header-client class="c-header__client" :defaultValue="client" />

            <!-- search -->
            <header-search class="c-header__search" :client="client" />

            <!-- nav -->
            <header-nav class="c-header__nav" :client="client" />

            <div class="c-header__extra">
                <slot></slot>
            </div>

            <!-- user -->
            <header-user ref="user" class="c-header__user" :client="client" :asset="asset" />
        </div>
        <header-box v-if="isMobile" class="c-header__box c-header-jx3box" :overlayEnable="overlayEnable" />
        <header-box2 v-else class="c-header__box c-header__box--desktop" />
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
import box from "./header/box.vue";
import box2 from "./header/box2.vue";

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
        "header-box": box,
        "header-box2": box2,
    },
    props: ["overlayEnable"],
    data: function () {
        return {
            isOverlay: false,
            isApp: checkIsApp(),
            isMobile: window.innerWidth <= 768,

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
            // 参数处理
            const urlParams = new URLSearchParams(window.location.search);

            // 环境判断缓存
            const isApp = checkIsApp();
            const isMp = isMiniProgram();

            // App 环境缓存
            if (isApp) {
                localStorage.setItem("__env", "app");
            }

            // 小程序环境缓存
            if (isMp) {
                document.documentElement.classList.add("wechat-miniprogram");
                window.JX3BOX_ENV = "MINIPROGRAM";
                miniprogramHack();
            }

            // 来源参数缓存
            const from = urlParams.get("from")?.replace(/[^a-zA-Z0-9_-]/g, "");
            if (from) {
                sessionStorage.setItem("from", from);
                document.documentElement.classList.add("from-" + from);
            }

            // 如果来自推栏 App
            if (sessionStorage.getItem("from") === "tl") {
                document.documentElement.classList.add("v-miniprogram");
            }

            // 移动容器模式：包含小程序或 App 内嵌环境
            if (isMp || isApp) {
                document.documentElement.classList.add("v-miniprogram");
            }

            // 来自自身小程序
            const appid = urlParams.get("appid");
            const internalApp = miniprogram?.find((item) => item.appid === appid);
            if (appid && internalApp) {
                document.documentElement.classList.add("env-miniprogram-" + internalApp.id);
                window.JX3BOX_ENV = internalApp.id?.toUpperCase() + "_MINIPROGRAM";
            }

            // 仅安卓有效，基本不使用
            if (window.navigator.userAgent.includes(KW)) {
                document.documentElement.classList.add("env-app");
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
        updateScreen() {
            this.isMobile = window.innerWidth <= 768;
        },
    },
    created: function () {
        this.init();
        window.addEventListener("resize", this.updateScreen, { passive: true });

        if (this.overlayEnable) {
            this.__overlayScrollHandler = _.throttle(() => {
                this.isOverlay = window.scrollY > 200 ? true : false;
            }, 200);
            window.addEventListener("scroll", this.__overlayScrollHandler, { passive: true });
            this.__overlayScrollHandler();
        }
    },
    beforeUnmount: function () {
        window.removeEventListener("resize", this.updateScreen);
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
/* src/CommonHeader.vue */
.c-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 601;

    width: 100%;
    height: @header-height;
    box-sizing: border-box;

    background-color: @header-bg;
    color: #fff;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    transition: 0.5s ease-in-out;

    &__inner {
        &:after {
            content: "";
            display: table;
            clear: both;
        }
        .flex;
    }
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
