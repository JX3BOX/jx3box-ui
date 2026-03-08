<template>
    <div class="c-footer-official mt-6 flex flex-wrap gap-3">
        <div v-for="item in socials" :key="item.name">
            <el-popover v-if="item.qrcode" trigger="hover" placement="top" popper-class="c-footer-v4__popover">
                <div class="flex w-36 flex-col items-center p-3">
                    <img class="h-32 w-32 rounded-md object-cover" :src="item.qrcode" :alt="item.name" />
                    <span class="mt-2 text-xs">{{ item.label || item.name }}</span>
                </div>
                <template #reference>
                    <a
                        class="u-link flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-gray-800 transition"
                        :title="item.label"
                        href="javascript:;"
                    >
                        <img class="h-5 w-5" :src="item.icon" :alt="item.name" />
                    </a>
                </template>
            </el-popover>
            <a
                v-else
                class="u-link flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-gray-800 transition"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                :title="item.label"
            >
                <img class="h-5 w-5" :src="item.icon" :alt="item.name" />
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

export default {
    name: "FooterOfficial",
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
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
.c-footer-official {
    .u-link {
        &:hover {
            background-color: rgba(255, 255, 255, 1);
        }
    }
}
</style>
