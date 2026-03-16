<template>
    <footer class="c-footer--v4 box-border bg-gray-900 px-6 py-12 text-gray-400 md:px-10 lg:px-16 xl:px-20">
        <div class="mx-auto w-full" style="max-width: 92rem">
            <div class="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-12 lg:gap-8">
                <section class="lg:col-span-3">
                    <a class="flex items-center space-x-3 cursor-pointer" href="/">
                        <img class="u-logo h-9 w-9" svg-inline src="../assets/img/common/logo.svg" alt="JX3BOX" />
                        <span class="text-2xl font-bold tracking-tight text-white">JX3BOX</span>
                    </a>
                    <p class="mt-5 text-sm leading-7 text-gray-400" style="max-width: 20rem">
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
