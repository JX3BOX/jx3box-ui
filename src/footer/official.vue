<template>
    <div class="c-footer-official">
        <div v-for="item in socials" :key="item.name">
            <el-popover
                v-if="item.qrcode"
                ref="officialPopover"
                trigger="hover"
                placement="top"
                popper-class="c-footer--v4__popover"
                @show="handlePopoverShow"
            >
                <div class="c-footer-official__qrcode">
                    <img
                        class="c-footer-official__qrcode-img"
                        :src="item.qrcode"
                        :alt="getSocialName(item)"
                        @load="handleQrcodeLoad"
                    />
                    <span class="c-footer-official__qrcode-label">{{ item.label || getSocialName(item) }}</span>
                </div>
                <template #reference>
                    <a
                        class="u-link"
                        :title="item.label"
                        href="javascript:;"
                    >
                        <img class="u-link__icon" :src="item.icon" :alt="getSocialName(item)" />
                    </a>
                </template>
            </el-popover>
            <a
                v-else
                class="u-link"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                :title="item.label"
            >
                <img class="u-link__icon" :src="item.icon" :alt="getSocialName(item)" />
            </a>
        </div>
    </div>
</template>

<script>
// import wechatIcon from "@/assets/img/icons/wechat.svg?url";
// import bilibiliIcon from "@/assets/img/icons/bilibili.svg?url";
// import weiboIcon from "@/assets/img/icons/weibo.svg?url";
// import douyinIcon from "@/assets/img/icons/douyin.svg?url";
// import wechatQrcode from "@/assets/img/icons/mp.jpg";

import i18nMixin from "../../i18n/mixin";

export default {
    name: "FooterOfficial",
    mixins: [i18nMixin],
    props: [],
    components: {},
    data: function () {
        return {
            socials: [
                {
                    name: "公众号",
                    key: "wechat",
                    href: "",
                    icon: require('../../assets/img/common/wechat.svg'),
                    qrcode: require('../../assets/img/common/mp.jpg'),
                    label: "剑三魔盒",
                },
                {
                    name: "B站",
                    key: "bilibili",
                    href: "https://space.bilibili.com/2066064028",
                    icon: require('../../assets/img/common/bilibili.svg'),
                    label: "剑网3魔盒",
                },
                {
                    name: "微博",
                    key: "weibo",
                    href: "https://weibo.com/jx3box",
                    icon: require('../../assets/img/common/weibo.svg'),
                    label: "剑网3魔盒",
                },
                {
                    name: "抖音",
                    key: "douyin",
                    href: "https://www.douyin.com/user/MS4wLjABAAAAP3OHPy-BYsW6IMiPZfP1FP3J_zYAAYNVVlk9XyoKhOs",
                    icon: require('../../assets/img/common/douyin.svg'),
                    label: "剑网3魔盒",
                },
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {
        getPopoverInstance() {
            const popoverRef = this.$refs?.officialPopover;
            if (Array.isArray(popoverRef)) return popoverRef[0] || null;
            return popoverRef || null;
        },
        updatePopoverPosition() {
            const popover = this.getPopoverInstance();
            if (popover && typeof popover.updatePopper === "function") popover.updatePopper();
        },
        handlePopoverShow() {
            this.$nextTick(() => {
                this.updatePopoverPosition();
                if (typeof requestAnimationFrame === "function") {
                    requestAnimationFrame(() => this.updatePopoverPosition());
                }
            });
        },
        handleQrcodeLoad() {
            this.$nextTick(() => this.updatePopoverPosition());
        },
        getSocialName(item) {
            if (!item?.key) return item?.name || "";
            const map = {
                wechat: "wechatOA",
                bilibili: "bilibili",
                weibo: "weibo",
                douyin: "douyin",
            };
            const tKey = map[item.key] || item.key;
            return this.$jx3boxT(`jx3boxUi.commonFooter.${tKey}`, item.name || tKey);
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
/* src/footer/official.vue */
.c-footer-official {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;

    .u-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border: 1px solid #374151;
        border-radius: 50%;
        background: #1f2937;
        transition: background-color 0.2s ease, border-color 0.2s ease;

        &:hover {
            background-color: rgba(255, 255, 255, 1);
        }
    }

    .u-link__icon {
        display: block;
        width: 20px;
        height: 20px;
    }

    &__qrcode {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 144px;
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
}
</style>
