<template>
    <section class="lg:col-span-4">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div v-for="group in footerGroups" :key="group.title">
                <h3 class="text-sm font-semibold tracking-wide text-white">
                    {{ $jx3boxT(`jx3boxUi.commonFooter.${group.key}`, group.title) }}
                </h3>
                <div class="mt-4 space-y-3">
                    <a
                        v-for="item in group.links"
                        :key="item.name"
                        class="block text-xs text-gray-400 transition hover:text-indigo-400"
                        :href="item.href"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {{ $jx3boxT(`jx3boxUi.commonFooter.${item.key}`, item.name) }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "FooterLinks",
    mixins: [i18nMixin],
    props: [],
    components: {},
    data: function () {
        return {
            aboutLinks: [
                { key: "teamMembers", name: "团队成员", href: "https://www.jx3box.com/about/" },
                { key: "joinUs", name: "加入我们", href: "https://www.jx3box.com/notice/21899" },
                { key: "devDocs", name: "开发文档", href: "https://www.jx3box.com/tool?subtype=4" },
                { key: "codeRepo", name: "代码仓库", href: "https://github.com/JX3BOX" },
            ],
            legalLinks: [
                { key: "userAgreement", name: "用户协议", href: "https://www.jx3box.com/about/license" },
                { key: "creatorTreaty", name: "创作公约", href: "https://www.jx3box.com/about/treaty" },
                { key: "privacyPolicy", name: "隐私政策", href: "https://www.jx3box.com/about/privacy" },
                { key: "creatorIncentives", name: "创作激励", href: "https://www.jx3box.com/about/incentives" },
            ],
            extraLinks: [
                { key: "gameVersion", name: "游戏版本", href: "https://www.jx3box.com/topic" },
                { key: "eventCenter", name: "活动中心", href: "https://www.jx3box.com/event" },
                { key: "siteMap", name: "全站地图", href: "https://www.jx3box.com/app/" },
            ],
        };
    },
    computed: {
        footerGroups() {
            return [
                {
                    key: "linksAbout",
                    title: "关于我们",
                    links: this.aboutLinks,
                },
                {
                    key: "linksLegal",
                    title: "法律合规",
                    links: this.legalLinks,
                },
                {
                    key: "linksMore",
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
