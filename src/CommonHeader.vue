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
            <header-user
                ref="user"
                class="c-header__user"
                :client="client"
                :asset="asset"
                :header-config="headerConfig"
                :header-config-loaded="headerConfigLoaded"
                :header-config-managed="true"
                :account-ready-issues="accountReadyIssues"
                :account-ready-incomplete="accountReadyIncomplete"
                @open-account-ready="openAccountReadyDialog"
            />
        </div>
        <header-box v-if="isMobile" class="c-header__box c-header-jx3box" :overlayEnable="overlayEnable" />
        <header-box2 v-else class="c-header__box c-header__box--desktop" />
    </header>
    <el-dialog
        v-model="accountReadyDialogVisible"
        class="c-header-account-ready"
        width="min(92vw, 520px)"
        :title="$jx3boxT('jx3boxUi.accountReady.title', '⚠️ 完善账号安全信息')"
        append-to-body
        @close="markAccountReadyDismissed"
    >
        <div class="c-header-account-ready__body">
            <p class="u-desc">{{ $jx3boxT('jx3boxUi.accountReady.description', '为了保障 App 登录、账号找回和卡密等功能正常使用，请先补全以下账号安全信息。') }}</p>
            <div class="u-list">
                <div class="u-item" v-if="accountReadyIssues.includes('contact')">
                    <div class="u-title">{{ $jx3boxT('jx3boxUi.accountReady.contactTitle', '绑定邮箱和手机号') }}</div>
                    <div class="u-text">{{ $jx3boxT('jx3boxUi.accountReady.contactDescription', '当前账号的邮箱或手机号尚未完善。请完成手机号绑定，并绑定且验证邮箱，否则后续可能无法找回账号。') }}</div>
                    <el-button type="primary" @click="goAccountReady('/dashboard/notice')">{{ $jx3boxT('jx3boxUi.accountReady.bind', '去绑定') }}</el-button>
                </div>
                <div class="u-item" v-if="accountReadyIssues.includes('password')">
                    <div class="u-title">{{ $jx3boxT('jx3boxUi.accountReady.passwordTitle', '设置登录密码') }}</div>
                    <div class="u-text">{{ $jx3boxT('jx3boxUi.accountReady.passwordDescription', '当前账号还没有设置密码。未设置密码时，可能无法使用卡密等功能，也无法在 App 中通过账号密码登录。') }}</div>
                    <el-button type="primary" @click="goAccountReady('/dashboard/pwd')">{{ $jx3boxT('jx3boxUi.accountReady.setPassword', '去设置') }}</el-button>
                </div>
            </div>
        </div>
        <template #footer>
            <el-button @click="accountReadyDialogVisible = false">{{ $jx3boxT('jx3boxUi.accountReady.later', '7天后再说') }}</el-button>
        </template>
    </el-dialog>
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
import { getConfig, getMyAccountStatus } from "../service/cms";
import { clearActiveAuthToken, refreshTokenIfNeeded } from "./utils/auth-token-refresh";
import {
    checkClientStatOnVisible,
    ensureClientInstanceId,
    installClientStatReporting,
    resolveCurrentClientSurface,
    resolveClientTrafficPermission,
} from "./utils/client-stat";
import { installCommonHeaderTrafficAnalytics } from "./utils/traffic-analytics";
import User from "@jx3box/jx3box-common/js/user.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const HEADER_CONFIG_KEYS = ["important_notice", "important_notice_url", "vip", "mall", "user_profile_ready"];
const ACCOUNT_READY_STORAGE_PREFIX = "jx3box:account-ready-dismissed-until";
const ACCOUNT_READY_COMPLETE_STORAGE_PREFIX = "jx3box:account-ready-complete";
const ACCOUNT_READY_DISMISS_INTERVAL = 7 * 24 * 60 * 60 * 1000;

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
    props: {
        overlayEnable: Boolean,
        trafficEnabled: { type: Boolean, default: true },
    },
    data: function () {
        return {
            isOverlay: false,
            isApp: checkIsApp(),
            isMobile: window.innerWidth <= 768,

            asset: {},
            headerConfig: {},
            headerConfigLoaded: false,
            accountReadyDialogVisible: false,
            accountReadyIssues: [],
            accountReadyIncomplete: false,
            accountReadyChecking: false,
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
            this.loadHeaderConfig();

            const token = this.getUrlParam("__token");
            const env = this.getUrlParam("__env");
            env && localStorage.setItem("__env", env);

            token && localStorage.setItem("__token", token);

            if (User.isLogin()) {
                this.loadAsset();
                this.refreshAuthToken({ force: !!token, reloadOnIdentityChange: !!token });
                this.initAccountReadyState();
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
                        User.destroy()
                            .finally(() => {
                                clearActiveAuthToken();
                            })
                            .then(() => {
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

        refreshAuthToken: function ({ force = false, reloadOnIdentityChange = false } = {}) {
            const previousUid = User.getInfo()?.uid;
            return refreshTokenIfNeeded({ force })
                .then((refreshed) => {
                    if (
                        refreshed &&
                        reloadOnIdentityChange &&
                        String(previousUid || "") !== String(User.getInfo()?.uid || "")
                    ) {
                        location.reload();
                    }
                    return refreshed;
                })
                .catch(() => {
                    // 自动续期失败不影响公共头渲染，后续鉴权请求会按既有逻辑处理登录态。
                    return false;
                });
        },

        handleVisibilityChange: function () {
            if (document.visibilityState === "visible") {
                this.refreshAuthToken();
                checkClientStatOnVisible();
            }
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
        loadHeaderConfig: function () {
            getConfig({
                key: HEADER_CONFIG_KEYS.join(","),
            })
                .then((data) => {
                    this.headerConfig = this.normalizeHeaderConfig(data);
                })
                .catch(() => {
                    this.headerConfig = {};
                })
                .finally(() => {
                    this.headerConfigLoaded = true;
                    this.checkAccountReadiness();
                });
        },
        normalizeHeaderConfig: function (data) {
            if (Array.isArray(data)) {
                return data.reduce((result, item) => {
                    if (item?.key) {
                        result[item.key] = item;
                    }
                    return result;
                }, {});
            }
            return data?.key ? { [data.key]: data } : {};
        },
        getConfigValue: function (key) {
            const config = this.headerConfig?.[key];
            return config?.val ?? config;
        },
        isAccountReadyEnabled: function () {
            return String(this.getConfigValue("user_profile_ready") || "").trim() === "1";
        },
        getAccountReadyUserId: function () {
            const uid = User.getInfo()?.uid || localStorage.getItem("uid") || "0";
            return uid || "0";
        },
        getAccountReadyStorageKey: function () {
            return `${ACCOUNT_READY_STORAGE_PREFIX}:${this.getAccountReadyUserId()}`;
        },
        getAccountReadyCompleteStorageKey: function () {
            return `${ACCOUNT_READY_COMPLETE_STORAGE_PREFIX}:${this.getAccountReadyUserId()}`;
        },
        isAccountReadyCompleted: function () {
            try {
                return !!localStorage.getItem(this.getAccountReadyCompleteStorageKey());
            } catch (e) {
                return false;
            }
        },
        markAccountReadyCompleted: function () {
            try {
                localStorage.setItem(this.getAccountReadyCompleteStorageKey(), String(Date.now()));
            } catch (e) {}
            this.clearAccountReadyDismissed();
        },
        initAccountReadyState: function () {
            this.accountReadyIncomplete = !this.isAccountReadyCompleted();
        },
        isAccountReadyDismissed: function () {
            try {
                const key = this.getAccountReadyStorageKey();
                const until = Number(localStorage.getItem(key));
                if (!until) return false;
                if (Date.now() < until) return true;
                localStorage.removeItem(key);
            } catch (e) {}
            return false;
        },
        markAccountReadyDismissed: function () {
            if (!User.isLogin() || !this.accountReadyIssues.length) return;
            try {
                localStorage.setItem(this.getAccountReadyStorageKey(), String(Date.now() + ACCOUNT_READY_DISMISS_INTERVAL));
            } catch (e) {}
        },
        buildAccountReadyIssues: function (status = {}) {
            const issues = [];
            if (!status.has_phone || !status.has_verified_email) {
                issues.push("contact");
            }
            if (!status.has_password) {
                issues.push("password");
            }
            return issues;
        },
        isAccountReadyTargetPage: function () {
            return ["/dashboard/notice", "/dashboard/pwd"].some((path) => location.pathname.startsWith(path));
        },
        checkAccountReadiness: function () {
            if (this.accountReadyChecking || !User.isLogin()) return;
            if (this.isAccountReadyCompleted()) {
                this.accountReadyIssues = [];
                this.accountReadyIncomplete = false;
                this.accountReadyDialogVisible = false;
                return;
            }

            this.accountReadyChecking = true;
            getMyAccountStatus()
                .then((status) => {
                    const issues = this.buildAccountReadyIssues(status);
                    if (!issues.length) {
                        this.accountReadyIssues = [];
                        this.accountReadyIncomplete = false;
                        this.accountReadyDialogVisible = false;
                        this.markAccountReadyCompleted();
                        return;
                    }
                    this.accountReadyIssues = issues;
                    this.accountReadyIncomplete = true;
                    if (this.isAccountReadyEnabled() && !this.isAccountReadyTargetPage() && !this.isAccountReadyDismissed()) {
                        this.accountReadyDialogVisible = true;
                    }
                })
                .catch(() => {})
                .finally(() => {
                    this.accountReadyChecking = false;
                });
        },
        clearAccountReadyDismissed: function () {
            try {
                localStorage.removeItem(this.getAccountReadyStorageKey());
            } catch (e) {}
        },
        openAccountReadyDialog: function (issues) {
            if (Array.isArray(issues) && issues.length) {
                this.accountReadyIssues = issues;
            }
            if (this.accountReadyIssues.length) {
                this.accountReadyDialogVisible = true;
                return;
            }
            if (!User.isLogin() || this.isAccountReadyCompleted()) return;

            this.accountReadyChecking = true;
            getMyAccountStatus()
                .then((status) => {
                    const freshIssues = this.buildAccountReadyIssues(status);
                    if (!freshIssues.length) {
                        this.accountReadyIssues = [];
                        this.accountReadyIncomplete = false;
                        this.accountReadyDialogVisible = false;
                        this.markAccountReadyCompleted();
                        return;
                    }
                    this.accountReadyIssues = freshIssues;
                    this.accountReadyIncomplete = true;
                    this.accountReadyDialogVisible = true;
                })
                .catch(() => {})
                .finally(() => {
                    this.accountReadyChecking = false;
                });
        },
        goAccountReady: function (url) {
            this.markAccountReadyDismissed();
            window.open(url, "_blank", "noopener");
        },
        updateScreen() {
            this.isMobile = window.innerWidth <= 768;
        },
    },
    created: function () {
        this.init();
        installClientStatReporting();
        if (this.trafficEnabled) {
            try {
                installCommonHeaderTrafficAnalytics({
                    router: this.$router,
                    runtime: window,
                    surface: resolveCurrentClientSurface(),
                    instanceId: ensureClientInstanceId(),
                    resolveTrafficPermission: resolveClientTrafficPermission,
                    webVersion: window.__APP_VERSION__ || process.env.VUE_APP_VERSION || process.env.VITE_APP_VERSION || null,
                }).catch(function () {
                    // Traffic is fail-closed and must never affect the shared header or host page.
                });
            } catch (error) {
                // Storage/privacy failures must not affect the shared header or host page.
            }
        }
        window.addEventListener("resize", this.updateScreen, { passive: true });
        document.addEventListener("visibilitychange", this.handleVisibilityChange);

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
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
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

.c-header-account-ready {
    border-radius: 10px;

    .el-dialog__header {
        margin-right: 0;
        padding: 24px 24px 10px;
    }

    .el-dialog__title {
        font-weight: 700;
        color: #222;
    }

    .el-dialog__body {
        padding: 8px 24px 4px;
    }

    .el-dialog__footer {
        padding: 12px 24px 22px;
    }

    &__body {
        .u-desc {
            margin: 0 0 16px;
            color: #666;
            line-height: 1.7;
        }

        .u-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .u-item {
            padding: 14px 16px;
            border: 1px solid #e8edf5;
            border-radius: 8px;
            background: #f8fbff;
        }

        .u-title {
            margin-bottom: 6px;
            font-size: 15px;
            font-weight: 700;
            color: #1f2937;
        }

        .u-text {
            margin-bottom: 12px;
            color: #5f6b7a;
            line-height: 1.7;
        }
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
    .env-app {
        .c-header {
            .none;
        }
        body {
            padding-top: 0;
        }
    }
}
</style>
