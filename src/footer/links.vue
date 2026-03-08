<template>
    <section class="lg:col-span-3">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div v-for="group in footerGroups" :key="group.title">
                <h3 class="text-sm font-semibold tracking-wide text-white">
                    {{ group.title }}
                </h3>
                <div class="mt-4 space-y-3">
                    <a
                        v-for="item in group.links"
                        :key="item.name"
                        class="block text-xs text-gray-400 transition hover:text-blue-400"
                        :href="item.href"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {{ item.name }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "FooterLinks",
    props: [],
    components: {},
    data: function () {
        return {
            aboutLinks: [
                { name: "团队成员", href: "https://www.jx3box.com/about/" },
                { name: "加入我们", href: "https://www.jx3box.com/notice/21899" },
                { name: "开发文档", href: "https://www.jx3box.com/tool?subtype=4" },
                { name: "代码仓库", href: "https://github.com/JX3BOX" },
            ],
            legalLinks: [
                { name: "用户协议", href: "https://www.jx3box.com/about/license" },
                { name: "创作公约", href: "https://www.jx3box.com/about/treaty" },
                { name: "隐私政策", href: "https://www.jx3box.com/about/privacy" },
                { name: "创作激励", href: "https://www.jx3box.com/about/incentives" },
            ],
            extraLinks: [
                { name: "游戏版本", href: "https://www.jx3box.com/topic" },
                { name: "活动中心", href: "https://www.jx3box.com/event" },
                { name: "全站地图", href: "https://www.jx3box.com/app/" },
            ],
        };
    },
    computed: {
        footerGroups() {
            return [
                {
                    title: "关于我们",
                    links: this.aboutLinks,
                },
                {
                    title: "法律合规",
                    links: this.legalLinks,
                },
                {
                    title: "更多入口",
                    links: this.extraLinks,
                },
            ];
        },
    },
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>
