<template>
    <div class="c-footer-copyright">
        <div class="c-footer-copyright__main">
            <span>{{
                $jx3boxT("jx3boxUi.commonFooter.copyright", "© 2019-{year} JX3BOX {poweredBy}", {
                    year: new Date().getFullYear(),
                    poweredBy: $jx3boxT("jx3boxUi.commonFooter.poweredBy", "All rights reserved."),
                })
            }}</span>
            <a
                class="c-footer-copyright__link c-footer-copyright__link--underline"
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ $jx3boxT("jx3boxUi.commonFooter.icp", "湘ICP备2021002288号") }}
            </a>
        </div>
        <div class="c-footer-copyright__extra">
            <a
                class="c-footer-copyright__link"
                href="https://rx-planet.com/contact"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ $jx3boxT("jx3boxUi.commonFooter.contactUs", "联系我们") }}
            </a>
            <a
                class="c-footer-copyright__link"
                href="/dashboard/feedback"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ $jx3boxT("jx3boxUi.commonFooter.feedback", "反馈建议") }}
            </a>
        </div>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "FooterCopyright",
    mixins: [i18nMixin],
    props: [],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
/* src/footer/copyright.vue */
.c-footer-copyright {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-top: 32px;
    border-top: 1px solid #374151;
    color: #6b7280;
    font-size: 11px;
    line-height: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
    }

    &__main,
    &__extra {
        display: flex;
        align-items: center;
    }

    &__main {
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px 24px;

        @media (min-width: 768px) {
            justify-content: flex-start;
        }
    }

    &__extra {
        margin-top: 16px;

        > * + * {
            margin-left: 24px;
        }

        @media (min-width: 768px) {
            margin-top: 0;
        }
    }

    &__link {
        color: #6b7280;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
            color: #fff;
        }

        &--underline:hover {
            color: #6b7280;
            text-decoration: underline;
        }
    }
}
</style>
