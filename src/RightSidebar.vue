<template>
    <aside class="c-sidebar-right c-sidebar" v-if="!isApp" :class="[isOpen ? 'is-open' : 'is-close', {'show-toggle': showToggle}]">
        <div class="c-sidebar-right-inner">
            <slot></slot>
        </div>

        <template v-if="showToggle">
            <span
                class="c-sidebar-right-toggle"
                :class="!isOpen && 'close-sidebar-right'"
                @click="toggleRightSide"
                :title="isOpen ? '收起侧边栏' : '打开侧边栏'"
            >
                <el-icon>
                    <ArrowLeft v-show="!isOpen" />
                    <ArrowRight v-show="isOpen" />
                </el-icon>
            </span>
        </template>
    </aside>
</template>

<script>
import { isApp } from "../assets/js/app.js";
import Bus from "../utils/bus";
export default {
    name: "RightSidebar",
    props: {
        // 展示收起按钮
        showToggle: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            isOpen: true,
            isApp: isApp(),
        };
    },
    computed: {},
    methods: {
        toggleRightSide: function () {
            Bus.emit("toggleRightSide", !this.isOpen);
        },
    },
    mounted: function () {
        Bus.on("toggleRightSide", (data) => {
            this.isOpen = data;
        });

        if (window.innerWidth <= 1440) {
            this.isOpen = false;
        }
    },
};
</script>

<style lang="less">
@import "../assets/css/common/right-sidebar.less";
</style>
