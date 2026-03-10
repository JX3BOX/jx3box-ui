<template>
    <div class="sb-shell">
        <div class="sb-shell-page" :class="{ 'has-suspend': showSuspend }">
            <template v-if="placement === 'header'">
                <slot></slot>
            </template>
            <CommonHeader v-else-if="showHeader" v-bind="resolvedHeaderProps"></CommonHeader>

            <template v-if="placement === 'breadcrumb'">
                <slot></slot>
            </template>
            <Breadcrumb v-else-if="showBreadcrumb" v-bind="resolvedBreadcrumbProps">
                <template #logo>
                    <img svg-inline src="../../../assets/img/editor/jx3.svg" />
                </template>
                <template #op-prepend>
                    <slot v-if="placement === 'leftToggle'"></slot>
                    <LeftSideToggle v-else-if="showLeftToggle" :mobileOnly="true" />
                </template>
            </Breadcrumb>

            <LeftSidebar v-if="showLeftSidebar" v-bind="resolvedLeftSidebarProps">
                <slot v-if="placement === 'left'"></slot>
                <div v-else class="sb-shell-card">
                    <div class="sb-shell-card__title">LeftSidebar</div>
                    <div class="sb-shell-card__desc">这里用于承载作者信息、导航或栏目侧边内容。</div>
                </div>
            </LeftSidebar>

            <Main v-if="showMain" v-bind="resolvedMainProps">
                <div class="sb-shell-main">
                    <slot v-if="placement === 'main'"></slot>
                    <div v-else class="sb-shell-article">
                        <div class="sb-shell-article__eyebrow">Storybook Base</div>
                        <h2 class="sb-shell-article__title">全局模块基座</h2>
                        <p class="sb-shell-article__text">
                            这个区域模拟 `App.vue` 中的主内容区，后续内容型组件可以默认挂在这里预览。
                        </p>
                    </div>
                </div>

                <RightSidebar v-if="showRightSidebar" v-bind="resolvedRightSidebarProps">
                    <slot v-if="placement === 'right'" name="right"></slot>
                    <slot v-else-if="placement === 'right'"></slot>
                    <div v-else class="sb-shell-card">
                        <div class="sb-shell-card__title">RightSidebar</div>
                        <div class="sb-shell-card__desc">这里用于目录、推荐信息或详情页补充模块。</div>
                    </div>
                </RightSidebar>
            </Main>

            <div v-if="showSuspend && placement === 'suspend'">
                <slot></slot>
            </div>

            <template v-if="placement === 'footer'">
                <slot></slot>
            </template>
            <CommonFooter v-else-if="showFooter"></CommonFooter>
        </div>
    </div>
</template>

<script>
import CommonHeader from "../../CommonHeader.vue";
import Breadcrumb from "../../Breadcrumb.vue";
import Main from "../../Main.vue";
import LeftSidebar from "../../LeftSidebar.vue";
import LeftSideToggle from "../../LeftSideToggle.vue";
import RightSidebar from "../../RightSidebar.vue";
import CommonFooter from "../../CommonFooter.vue";

export default {
    name: "StorybookShell",
    components: {
        CommonHeader,
        Breadcrumb,
        Main,
        LeftSidebar,
        LeftSideToggle,
        RightSidebar,
        CommonFooter,
    },
    props: {
        placement: {
            type: String,
            default: "main",
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showBreadcrumb: {
            type: Boolean,
            default: true,
        },
        showMain: {
            type: Boolean,
            default: true,
        },
        showLeftSidebar: {
            type: Boolean,
            default: true,
        },
        showLeftToggle: {
            type: Boolean,
            default: true,
        },
        showRightSidebar: {
            type: Boolean,
            default: true,
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
        showSuspend: {
            type: Boolean,
            default: false,
        },
        headerProps: {
            type: Object,
            default: function () {
                return {};
            },
        },
        breadcrumbProps: {
            type: Object,
            default: function () {
                return {};
            },
        },
        mainProps: {
            type: Object,
            default: function () {
                return {};
            },
        },
        leftSidebarProps: {
            type: Object,
            default: function () {
                return {};
            },
        },
        rightSidebarProps: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    computed: {
        resolvedHeaderProps: function () {
            return {
                overlayEnable: false,
                ...this.headerProps,
            };
        },
        resolvedBreadcrumbProps: function () {
            return {
                name: "频道名称",
                slug: "story",
                root: "/story",
                publishEnable: true,
                feedbackEnable: true,
                adminEnable: false,
                crumbEnable: false,
                withoutLeft: !this.showLeftSidebar,
                ...this.breadcrumbProps,
            };
        },
        resolvedMainProps: function () {
            return {
                withoutLeft: !this.showLeftSidebar,
                withoutRight: !this.showRightSidebar,
                ...this.mainProps,
            };
        },
        resolvedLeftSidebarProps: function () {
            return {
                open: true,
                ...this.leftSidebarProps,
            };
        },
        resolvedRightSidebarProps: function () {
            return {
                showToggle: true,
                ...this.rightSidebarProps,
            };
        },
    },
};
</script>

<style lang="less">
.sb-shell {
    min-height: 100vh;
    background:
        radial-gradient(circle at top right, rgba(0, 157, 255, 0.1), transparent 24rem),
        linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%);
}

.sb-shell-page {
    min-height: 100vh;
    padding-top: 60px;
}

.sb-shell-page.has-suspend {
    padding-bottom: 96px;
}

.sb-shell-main {
    padding: 24px;
}

.sb-shell-card,
.sb-shell-article {
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.sb-shell-card {
    padding: 20px;
    margin-bottom: 16px;
}

.sb-shell-card__title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
}

.sb-shell-card__desc {
    margin-top: 8px;
    line-height: 1.7;
    color: #475569;
    font-size: 13px;
}

.sb-shell-article {
    min-height: 360px;
    padding: 32px;
}

.sb-shell-article__eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0ea5e9;
}

.sb-shell-article__title {
    margin: 12px 0 0;
    font-size: 32px;
    line-height: 1.2;
    font-weight: 700;
    color: #0f172a;
}

.sb-shell-article__text {
    max-width: 42rem;
    margin-top: 16px;
    font-size: 15px;
    line-height: 1.9;
    color: #334155;
}

</style>
