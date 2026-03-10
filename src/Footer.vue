<template>
    <footer class="c-footer" id="c-footer" v-if="!isApp" :class="{ 'is--dark': darkMode }">
        <div class="c-footer-inner">
            <div class="c-footer-left">
                <img class="u-flag" svg-inline src="../assets/img/footer/china.svg" />
                <a href="https://beian.miit.gov.cn/" class="u-beian" target="_blank">{{
                    $jx3boxT("jx3boxUi.footer.icp", "湘ICP备2021002288号")
                }}</a>
            </div>
            <div class="c-footer-right">
                <a class="u-about" :href="about" target="_blank">{{ $jx3boxT("jx3boxUi.footer.about", "关于我们") }}</a>
                <em>|</em>
                <a class="u-doc" href="/help" target="_blank">{{ $jx3boxT("jx3boxUi.footer.doc", "帮助文档") }}</a>
                <em>|</em>
                <a class="u-log" href="https://github.com/JX3BOX" target="_blank">{{
                    $jx3boxT("jx3boxUi.footer.repo", "代码仓库")
                }}</a>
                <em>|</em>
                <a class="u-feedback" :href="feedback" target="_blank">{{
                    $jx3boxT("jx3boxUi.footer.feedback", "反馈建议")
                }}</a>
            </div>
            <slot></slot>
        </div>
    </footer>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { isApp } from "../assets/js/app.js";
import i18nMixin from "../i18n/mixin";
export default {
    name: "CommonFooter",
    mixins: [i18nMixin],
    props: {
        darkMode: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            about: JX3BOX.__Root + "about",
            feedback: JX3BOX.feedback + "&subject=" + location.href,
            isApp: isApp(),
        };
    },
};
</script>

<style lang="less">
@import "../assets/css/common/footer.less";
</style>
