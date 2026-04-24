<template>
    <footer class="c-footer--v4">
        <div class="c-footer--v4__container">
            <div class="c-footer--v4__main">
                <section class="c-footer--v4__brand">
                    <a class="c-footer--v4__brand-link" href="/">
                        <img
                            class="c-footer--v4__logo u-logo"
                            svg-inline
                            src="../assets/img/common/logo.svg"
                            alt="JX3BOX"
                        />
                        <span class="c-footer--v4__brand-name">JX3BOX</span>
                    </a>
                    <p class="c-footer--v4__slogan">
                        {{ $jx3boxT("jx3boxUi.commonFooter.slogan1", "一站式剑三工具与资源聚合站。") }}<br />
                        {{ $jx3boxT("jx3boxUi.commonFooter.slogan2", "江湖路远，幸甚有你。") }}
                    </p>
                    <footer-official />
                </section>
                <footer-links />
                <footer-resource />
            </div>
            <footer-copyright />
        </div>
    </footer>
</template>

<script>
import FooterOfficial from "./footer/official.vue";
import FooterLinks from "./footer/links.vue";
import FooterResource from "./footer/resource.vue";
import FooterCopyright from "./footer/copyright.vue";
import i18nMixin from "../i18n/mixin";
export default {
    name: "Footer",
    mixins: [i18nMixin],
    components: {
        FooterOfficial,
        FooterLinks,
        FooterResource,
        FooterCopyright,
    },
    data() {
        return {};
    },
};
</script>

<style lang="less">
/* src/CommonFooter.vue */
body::after {
    bottom: 0;
    background: #111827;
}
.c-footer--v4{
    box-sizing: border-box;
    padding: 3rem 1.5rem;
    background: #111827;
    color: #9ca3af;

    @media (min-width: 768px) {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
    }

    @media (min-width: 1024px) {
        padding-left: 4rem;
        padding-right: 4rem;
    }

    @media (min-width: 1280px) {
        padding-left: 5rem;
        padding-right: 5rem;
    }

    &__container {
        width: 100%;
        margin: 0 auto;
    }

    &__main {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;
        padding-bottom: 2.5rem;

        @media (min-width: 1024px) {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 2rem;
        }
    }

    &__brand {
        @media (min-width: 1024px) {
            grid-column: span 3 / span 3;
        }
    }

    &__brand-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
    }

    &__logo {
        width: 2.25rem;
        height: 2.25rem;
    }

    &__brand-name {
        font-size: 1.5rem;
        line-height: 2rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: #fff;
    }

    &__slogan {
        max-width: 20rem;
        margin-top: 1.25rem;
        font-size: 0.875rem;
        line-height: 1.75rem;
        color: #9ca3af;
    }

    .u-logo{
        fill:#fff;
    }
}
.c-footer--v4__popover {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 12px;
    box-shadow: 0 16px 40px rgba(3, 7, 18, 0.45);
    padding: 0 !important;
}

.c-footer--v4__popover .popper__arrow,
.c-footer--v4__popover .popper__arrow:after,
.c-footer--v4__popover .el-popper__arrow,
.c-footer--v4__popover .el-popper__arrow::before {
    display: none !important;
}
</style>
