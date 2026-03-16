<template>
    <div class="c-breadcrumb" v-if="!isApp">
        <div class="u-menu" @click.stop="toggleLeftSide" v-if="!withoutLeft">
            <img class="u-toggle" :class="{ on: isOpen }" svg-inline src="../assets/img/bread/menu.svg" />
        </div>
        <a class="u-channel" :href="rootLink" :class="{ on: withoutLeft }">
            <i class="u-channel-logo">
                <img :src="getAppIcon(slug)" v-if="!$slots.logo" />
                <slot name="logo"></slot>
            </i>
            <span class="u-title">{{ name }}</span>
        </a>
        <!-- 面包屑内容 -->
        <Crumb :name="slug" v-if="crumbEnable" />
        <slot></slot>
        <slot v-if="showTitle" name="title"></slot>
        <div class="u-op">
            <slot name="op-append"></slot>
            <a
                v-if="publishEnable"
                :href="publishLink(slug)"
                class="u-publish el-button el-button--primary el-button--medium u-op-public"
            >
                <el-icon><Edit /></el-icon>
                <span>{{ $jx3boxT("jx3boxUi.breadcrumb.publish", "发布") }}</span>
            </a>
            <a
                v-if="feedbackEnable"
                v-show="isNotAdmin"
                :href="feedback"
                class="u-feedback el-button el-button--primary el-button--medium u-op-public"
                target="_blank"
            >
                <el-icon><InfoFilled /></el-icon>
                <span>{{ $jx3boxT("jx3boxUi.breadcrumb.feedback", "反馈") }}</span>
            </a>
            <Admin
                v-if="adminEnable"
                :marksOptions="adminMarks"
                :show-extend="showExtend"
                :app="slug"
                :subtypeMap="subtypeMap"
            />
            <slot name="op-prepend"></slot>
        </div>
    </div>
</template>

<script>
import { throttle } from "lodash";
import { publishLink, getAppIcon } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import Admin from "./bread/Admin.vue";
import Crumb from "./bread/Crumb.vue";
import { isApp } from "../assets/js/app.js";
import Bus from "../utils/bus";
import i18nMixin from "../i18n/mixin";

export default {
    name: "CommonBreadcrumb",
    mixins: [i18nMixin],
    props: {
        name: { type: String, default: "" },
        slug: { type: String, default: "" },
        root: { type: String, default: "" },
        publishEnable: { type: Boolean, default: false },
        adminEnable: { type: Boolean, default: false },
        topicEnable: { type: Boolean, default: false },
        feedbackEnable: { type: Boolean, default: false },
        overlayEnable: { type: Boolean, default: false },
        crumbEnable: { type: Boolean, default: false },
        withoutLeft: { type: Boolean, default: false },
        adminMarks: { type: Object, default: () => ({}) },
        icon: { type: String, default: "" },
        subtypeMap: { type: Object, default: () => ({}) },
        showExtend: { type: Boolean, default: false },
    },
    data: function () {
        return {
            isOpen: true,
            feedback: "/feedback?refer=" + encodeURIComponent(window.location.href),
            isNotAdmin: !User.isEditor(), // 非管理员都显示反馈链接
            isOverlay: false,
            isApp: isApp(),
            showTitle: false,
        };
    },
    computed: {
        rootLink: function () {
            return this.root || `/${this.slug}`;
        },
    },
    methods: {
        toggleLeftSide: function () {
            let status = !this.isOpen;
            Bus.emit("toggleLeftSide", status);
        },
        publishLink,
        getAppIcon,
        onShowTitle() {
            // 小屏不显示
            if (window.innerWidth < 1680) {
                return;
            }
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 100) {
                this.showTitle = true;
            } else {
                this.showTitle = false;
            }
        },
    },
    beforeUnmount() {
        document.removeEventListener("scroll", this.onShowTitle);
        if (this.__toggleLeftSideHandler) {
            Bus.off("toggleLeftSide", this.__toggleLeftSideHandler);
            this.__toggleLeftSideHandler = null;
        }
    },
    mounted: function () {
        document.addEventListener("scroll", this.onShowTitle);
        this.__toggleLeftSideHandler = (data) => {
            this.isOpen = data;
        };
        Bus.on("toggleLeftSide", this.__toggleLeftSideHandler);

        if (window.innerWidth < 1024) {
            this.isOpen = false;
        }

        if (this.overlayEnable) {
            const vm = this;
            window.addEventListener(
                "scroll",
                throttle(() => {
                    vm.isOverlay = window.scrollY > 200 ? true : false;
                }, 200)
            );
        }
    },
    components: {
        Admin,
        Crumb,
    },
};
</script>

<style lang="less">
/* src/Breadcrumb.vue */
@import "../assets/css/bread/breadcrumb.less";
</style>
