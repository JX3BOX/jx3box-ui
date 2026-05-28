<template>
    <section class="c-footer-resource">
        <h3 class="c-footer-resource__title">
            {{ $jx3boxT("jx3boxUi.commonFooter.downloadCenter", "下载中心") }}
        </h3>
        <div class="c-footer-resource__grid">
            <div v-for="item in downloadLinks" :key="item.key">
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
                        <button class="c-footer-resource__download" type="button">
                            <span class="c-footer-resource__download-icon">
                                <img :src="item.icon" alt="" aria-hidden="true" />
                            </span>
                            <span>{{ getDownloadName(item) }}</span>
                        </button>
                    </template>
                </el-popover>
                <button
                    v-else
                    class="c-footer-resource__download"
                    :class="{ 'is-active': activePlatform === item.key && downloadDialogVisible }"
                    type="button"
                    @click="openDownloadDialog(item)"
                >
                    <span class="c-footer-resource__download-icon">
                        <img :src="item.icon" alt="" aria-hidden="true" />
                    </span>
                    <span>{{ getDownloadName(item) }}</span>
                </button>
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

        <el-dialog
            v-model="downloadDialogVisible"
            :title="activeDialogTitle"
            width="960px"
            class="m-footer-app-dialog"
        >
            <div
                v-loading="appConfigLoading"
                class="m-footer-app-download"
            >
                <div class="u-app-header">
                    <img class="u-app-icon" :src="appLogo" :alt="appName" @error="handleLogoError" />
                    <div class="u-app-meta">
                        <div class="u-app-name">{{ appName }}</div>
                        <div class="u-app-version">{{ appVersion }}</div>
                        <div
                            v-if="appDescription"
                            class="u-app-desc-box"
                            :class="{
                                'is-expanded': appDescExpanded,
                                'is-foldable': hasDescFold(appDescription),
                            }"
                            @click="toggleAppDesc"
                        >
                            <el-icon v-if="hasDescFold(appDescription)" class="u-desc-toggle">
                                <ArrowUp v-if="appDescExpanded" />
                                <ArrowDown v-else />
                            </el-icon>
                            <div class="u-app-desc">
                                {{ getFoldedDesc(appDescription, appDescExpanded) }}
                            </div>
                        </div>
                    </div>
                    <div class="u-app-download-action">
                        <el-button
                            class="u-app-store-button"
                            type="primary"
                            :disabled="!activeDownloadUrl"
                            @click="openActiveDownload"
                        >
                            <el-icon class="u-button-icon"><Download /></el-icon>
                            <span>{{ activeDownloadText }}</span>
                        </el-button>
                        <div v-if="activePlatform === 'android'" class="u-app-download-tip">
                            仅支持 Android 10 及以上系统
                        </div>
                        <div
                            v-if="activePlatform === 'harmonyNext'"
                            class="u-app-download-tip"
                        >
                            鸿蒙6.0以下请<a
                                class="u-app-download-tip__link"
                                :class="{ 'is-disabled': !androidDownloadUrl }"
                                :href="androidDownloadUrl || undefined"
                                target="_blank"
                                rel="noopener noreferrer"
                                @click="handleAndroidPackageClick"
                            >安装安卓包</a>
                        </div>
                    </div>
                </div>

                <div class="u-app-preview">
                    <div class="u-app-preview-tabs">
                        <button
                            v-for="device in previewDevices"
                            :key="device.key"
                            type="button"
                            class="u-preview-tab"
                            :class="{ 'is-active': activePreviewDevice === device.key }"
                            @click="activePreviewDevice = device.key"
                        >
                            {{ device.label }}
                        </button>
                    </div>

                    <div class="u-app-preview-list" :class="`is-${activePreviewDevice}`">
                        <div v-for="image in currentPreviewImages" :key="image" class="u-app-preview-card">
                            <el-image
                                class="u-app-preview-image"
                                :src="image"
                                :preview-src-list="currentPreviewImages"
                                :initial-index="currentPreviewImages.indexOf(image)"
                                fit="cover"
                                preview-teleported
                            />
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import { ArrowDown, ArrowUp, Download } from "@element-plus/icons-vue";
import { copyText } from "../../utils";
import i18nMixin from "../../i18n/mixin";
import { getConfig } from "../../service/cms";

const APP_LOGO_FALLBACK = "https://cdn.jx3box.com/design/app/logo/jx3box-icon-512.png";
const APP_CONFIG_KEYS = ["android_apk", "android_versions", "app_logo", "app_version_desc", "apple_url", "harmony_url"];

export default {
    name: "FooterResource",
    mixins: [i18nMixin],
    props: [],
    components: { ArrowDown, ArrowUp, Download },
    data: function () {
        return {
            downloadDialogVisible: false,
            activePlatform: "appStore",
            activePreviewDevice: "phone",
            appDescExpanded: false,
            appConfig: {},
            appConfigLoading: false,
            appConfigLoaded: false,
            previewDevices: [
                { key: "phone", label: "Phone" },
                { key: "pad", label: "Pad" },
            ],
            previewImages: {
                phone: [
                    "https://cdn.jx3box.com/design/app/phone/phone1.jpg",
                    "https://cdn.jx3box.com/design/app/phone/phone2.jpg",
                    "https://cdn.jx3box.com/design/app/phone/phone3.jpg",
                ],
                pad: [
                    "https://cdn.jx3box.com/design/app/pad/pad1.jpg",
                    "https://cdn.jx3box.com/design/app/pad/pad2.jpg",
                    "https://cdn.jx3box.com/design/app/pad/pad3.jpg",
                ],
            },
            downloadLinks: [
                {
                    key: "appStore",
                    name: "App Store",
                    icon: require("../../assets/img/common/ios.svg"),
                },
                {
                    key: "android",
                    name: "Android",
                    icon: require("../../assets/img/common/android.svg"),
                },
                {
                    key: "harmonyNext",
                    name: "鸿蒙 NEXT",
                    icon: require("../../assets/img/common/harmony.svg"),
                },
                {
                    key: "miniProgram",
                    name: "小程序",
                    labelKey: "jx3boxHelper",
                    label: "JX3BOX小助手",
                    icon: require("../../assets/img/common/miniprogram.svg"),
                    qrcode: require("../../assets/img/common/miniprogram.jpg"),
                },
            ],
        };
    },
    computed: {
        activePlatformItem() {
            return this.downloadLinks.find((item) => item.key === this.activePlatform) || this.downloadLinks[0];
        },
        activePlatformLabel() {
            return this.getDownloadName(this.activePlatformItem);
        },
        activeDialogTitle() {
            const map = {
                appStore: "App Store",
                android: "Android",
                harmonyNext: "鸿蒙NEXT",
            };
            return map[this.activePlatform] || this.activePlatformLabel;
        },
        appLogo() {
            return this.appConfig.app_logo || APP_LOGO_FALLBACK;
        },
        appName() {
            return "剑网3魔盒";
        },
        appVersion() {
            return this.appConfig.android_versions || "";
        },
        appDescription() {
            return this.appConfig.app_version_desc || "";
        },
        androidDownloadUrl() {
            return this.appConfig.android_apk || "";
        },
        appleDownloadUrl() {
            return this.appConfig.apple_url || "";
        },
        harmonyDownloadUrl() {
            return this.appConfig.harmony_url || "";
        },
        activeDownloadUrl() {
            if (this.activePlatform === "android") return this.androidDownloadUrl;
            if (this.activePlatform === "harmonyNext") return this.harmonyDownloadUrl;
            return this.appleDownloadUrl;
        },
        activeDownloadText() {
            const map = {
                appStore: "前往苹果商店",
                android: "下载 Android",
                harmonyNext: "前往鸿蒙商店",
            };
            return map[this.activePlatform] || "立即下载";
        },
        currentPreviewImages() {
            return this.previewImages[this.activePreviewDevice] || [];
        },
    },
    watch: {},
    methods: {
        copyText,
        getDownloadName(item) {
            if (!item?.key) return item?.name || "";
            return this.$jx3boxT(`jx3boxUi.commonFooter.${item.key}`, item.name || item.key);
        },
        getDownloadLabel(item) {
            if (item?.labelKey) {
                return this.$jx3boxT(`jx3boxUi.commonFooter.${item.labelKey}`, item.label || item.labelKey);
            }
            return item?.label || "";
        },
        openDownloadDialog(item) {
            this.activePlatform = item.key;
            this.activePreviewDevice = "phone";
            this.appDescExpanded = false;
            this.downloadDialogVisible = true;
            this.loadAppConfig();
        },
        openActiveDownload() {
            if (!this.activeDownloadUrl) return;
            window.open(this.activeDownloadUrl, "_blank", "noopener,noreferrer");
        },
        loadAppConfig() {
            const storeConfig = this.getStoreAppConfig();
            if (storeConfig) {
                this.appConfig = {
                    ...this.appConfig,
                    ...storeConfig,
                };
                this.appConfigLoaded = true;
                return Promise.resolve();
            }
            if (this.appConfigLoading || this.appConfigLoaded) return Promise.resolve();
            this.appConfigLoading = true;
            return getConfig({ subtype: "app" })
                .then((items) => {
                    this.appConfig = this.getAppConfigFromItems(items);
                    this.appConfigLoaded = true;
                })
                .catch(() => {
                    this.appConfig = {};
                })
                .finally(() => {
                    this.appConfigLoading = false;
                });
        },
        getStoreAppConfig() {
            const config = this.$store?.state?.config || {};
            const appConfig = APP_CONFIG_KEYS.reduce((result, key) => {
                if (config[key]) result[key] = config[key];
                return result;
            }, {});
            return Object.keys(appConfig).length ? appConfig : null;
        },
        getAppConfigFromItems(items) {
            if (!Array.isArray(items)) return {};
            return items.reduce((config, item) => {
                if (!item?.key || !APP_CONFIG_KEYS.includes(item.key)) return config;
                if (item.subtype && item.subtype !== "app") return config;
                config[item.key] = item.val;
                return config;
            }, {});
        },
        getDescLines(description) {
            return String(description || "")
                .replace(/\\r\\n|\\n|\\r/g, "\n")
                .split(/\r?\n/);
        },
        hasDescFold(description) {
            return this.getDescLines(description).length > 1;
        },
        getFoldedDesc(description, expanded = false) {
            const lines = this.getDescLines(description);
            return expanded ? lines.join("\n") : lines[0] || "";
        },
        toggleAppDesc() {
            if (!this.hasDescFold(this.appDescription)) return;
            this.appDescExpanded = !this.appDescExpanded;
        },
        handleLogoError(e) {
            e.target.src = APP_LOGO_FALLBACK;
        },
        handleAndroidPackageClick(e) {
            if (this.androidDownloadUrl) return;
            e.preventDefault();
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
        letter-spacing: 0;
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

    &__download {
        display: flex;
        align-items: center;
        width: 100%;
        height: 48px;
        padding: 0 16px;
        border: 1px solid #374151;
        border-radius: 12px;
        background: #1f2937;
        color: #d1d5db;
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

        &:hover,
        &.is-active {
            border-color: #3b82f6;
            background: #374151;
            color: #fff;
        }
    }

    &__download-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-right: 10px;
        flex-shrink: 0;

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
        letter-spacing: 0;
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

.m-footer-app-dialog {
    margin-top: 5vh !important;
    width: min(960px, calc(100vw - 32px)) !important;

    .el-dialog__header {
        margin-right: 0;
        padding: 20px 24px 12px;
        border-bottom: 1px solid #e5eaf4;
    }

    .el-dialog__title {
        color: #1f2937;
        font-size: 18px;
        font-weight: 700;
    }

    .el-dialog__body {
        padding: 24px;
    }

    .m-footer-app-download {
        min-height: 280px;
    }

    .u-app-header {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 0 0 24px;
        border-bottom: 1px solid #e5eaf4;
    }

    .u-app-icon {
        width: 72px;
        height: 72px;
        border: 1px solid #e5eaf4;
        border-radius: 18px;
        object-fit: cover;
        flex-shrink: 0;
        box-shadow: 0 10px 24px rgba(79, 115, 201, 0.14);
    }

    .u-app-meta {
        flex: 1;
        min-width: 0;
    }

    .u-app-name {
        color: #111827;
        font-size: 22px;
        font-weight: 700;
        line-height: 1.3;
        word-break: break-word;
    }

    .u-app-version {
        margin-top: 6px;
        color: #2d63ef;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5;
    }

    .u-app-desc-box {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        margin-top: 10px;
        color: #4b5563;

        &.is-foldable {
            cursor: pointer;
        }

        &.is-expanded {
            .u-app-desc {
                display: block;
                white-space: pre-wrap;
            }
        }
    }

    .u-desc-toggle {
        margin-top: 6px;
        color: #8a94a6;
        flex-shrink: 0;
    }

    .u-app-desc {
        display: -webkit-box;
        overflow: hidden;
        color: #4b5563;
        font-size: 14px;
        line-height: 1.8;
        white-space: pre-wrap;
        word-break: break-word;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .u-app-download-action {
        margin-left: auto;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
    }

    .u-app-store-button {
        flex-shrink: 0;

        .u-button-icon {
            margin-right: 6px;
        }
    }

    .u-app-download-tip {
        color: #8a94a6;
        font-size: 12px;
        line-height: 18px;
        white-space: nowrap;

        &__link {
            color: inherit;
            text-decoration: underline;
            text-underline-offset: 2px;

            &:hover {
                color: inherit;
            }

            &.is-disabled {
                cursor: not-allowed;
                opacity: 0.6;
                pointer-events: none;
            }
        }
    }

    .u-app-preview {
        padding-top: 24px;
    }

    .u-app-preview-tabs {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 20px;
    }

    .u-preview-tab {
        min-width: 108px;
        padding: 10px 18px;
        border: 1px solid #d7e1f5;
        border-radius: 999px;
        background: #f7f9fe;
        color: #5c6b84;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            border-color: #9ab6ff;
            color: #2d63ef;
        }

        &.is-active {
            border-color: #4f73c9;
            background: linear-gradient(135deg, #eff4ff 0%, #dfe9ff 100%);
            color: #2349a6;
            box-shadow: 0 10px 20px rgba(79, 115, 201, 0.16);
        }
    }

    .u-app-preview-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;

        &.is-phone {
            .u-app-preview-card {
                aspect-ratio: 9 / 16;
            }
        }

        &.is-pad {
            .u-app-preview-card {
                aspect-ratio: 3 / 4;
            }
        }
    }

    .u-app-preview-card {
        padding: 10px;
        border: 1px solid #e0e8f7;
        border-radius: 18px;
        background: linear-gradient(180deg, #f9fbff 0%, #eef3ff 100%);
        box-shadow: 0 10px 24px rgba(79, 115, 201, 0.08);
    }

    .u-app-preview-image {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 12px;
        background: #fff;
        cursor: pointer;

        .el-image__inner {
            width: 100%;
            height: 100%;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-footer-app-dialog {
        width: calc(100vw - 24px) !important;

        .el-dialog__header {
            padding: 18px 16px 12px;
        }

        .el-dialog__body {
            padding: 16px;
        }

        .u-app-header {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr);
            gap: 14px;
            padding-bottom: 18px;
        }

        .u-app-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
        }

        .u-app-name {
            font-size: 20px;
        }

        .u-app-download-action {
            grid-column: 1 / -1;
            width: 100%;
            margin-left: 0;
            align-items: stretch;
        }

        .u-app-store-button {
            width: 100%;
        }

        .u-app-download-tip {
            text-align: center;
        }

        .u-app-preview {
            padding-top: 18px;
        }

        .u-app-preview-tabs {
            gap: 10px;
            margin-bottom: 16px;
        }

        .u-preview-tab {
            min-width: 0;
            flex: 1;
            padding: 10px 12px;
        }

        .u-app-preview-list {
            grid-template-columns: 1fr;
        }
    }
}
</style>
