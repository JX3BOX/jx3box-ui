<template>
    <section class="c-footer-links">
        <div class="c-footer-links__grid">
            <div v-for="group in footerGroups" :key="group.title">
                <h3 class="c-footer-links__title">
                    {{ $jx3boxT(`jx3boxUi.commonFooter.${group.key}`, group.title) }}
                </h3>
                <div class="c-footer-links__list">
                    <a
                        v-for="item in group.links"
                        :key="item.name"
                        class="c-footer-links__link"
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
                { key: "teamMembers", name: "团队成员", href: "/about/" },
                { key: "joinUs", name: "加入我们", href: "/notice/21899" },
                { key: "devDocs", name: "开发文档", href: "/tool?subtype=4" },
                { key: "codeRepo", name: "代码仓库", href: "https://github.com/JX3BOX" },
            ],
            legalLinks: [
                { key: "userAgreement", name: "用户协议", href: "/about/license" },
                { key: "creatorTreaty", name: "创作公约", href: "/about/treaty" },
                { key: "privacyPolicy", name: "隐私政策", href: "/about/privacy" },
                { key: "creatorIncentives", name: "创作激励", href: "/about/incentives" },
            ],
            extraLinks: [
                { key: "gameVersion", name: "游戏版本", href: "/topic" },
                { key: "eventCenter", name: "活动中心", href: "/event" },
                { key: "siteMap", name: "全站地图", href: "/app/" },
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

<style lang="less">
/* src/footer/links.vue */
.c-footer-links {
    @media (min-width: 1024px) {
        grid-column: span 4 / span 4;
    }

    &__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 32px;

        @media (min-width: 640px) {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    &__title {
        margin: 0;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.025em;
    }

    &__list {
        margin-top: 16px;

        > * + * {
            margin-top: 12px;
        }
    }

    &__link {
        display: block;
        color: #9ca3af;
        font-size: 12px;
        line-height: 16px;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
            color: #818cf8;
        }
    }
}
</style>
