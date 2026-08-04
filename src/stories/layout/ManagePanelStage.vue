<template>
    <div class="manage-preview">
        <div class="manage-preview__header">
            <div class="manage-preview__brand">JX3BOX</div>
            <div class="manage-preview__tools">
                <span class="manage-preview__tool">◯</span>
                <span class="manage-preview__tool">◇</span>
                <span class="manage-preview__tool">♢</span>
                <Manage
                    ref="manage"
                    :header-config-loaded="false"
                    :account-ready-incomplete="true"
                    :account-ready-issues="['contact']"
                />
                <span class="manage-preview__tool">文</span>
                <span class="manage-preview__avatar">侠</span>
            </div>
        </div>
        <main class="manage-preview__body">
            <div class="manage-preview__eyebrow">COMMON HEADER</div>
            <h1>公共头扩展菜单</h1>
            <p>重新梳理信息密度、状态层级与悬浮反馈后的实际组件预览。</p>
        </main>
    </div>
</template>

<script>
import Manage from "../../header/manage.vue";

export default {
    name: "ManagePanelStage",
    components: { Manage },
    mounted() {
        this.$refs.manage.panel = [
            {
                key: "featureUpdate",
                label: "功能更新",
                link: "javascript:;",
                icon: "feature.svg",
                remark: "feature",
                meta: "storybook-preview",
            },
        ];
        this.$refs.manage.showPop = true;
    },
};
</script>

<style lang="less">
.manage-preview {
    min-height: 100vh;
    background:
        radial-gradient(circle at 72% 8%, rgba(79, 70, 229, 0.09), transparent 26rem),
        #f5f7fa;
}

.manage-preview__header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 32px;
    color: #fff;
    background: #202124;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.2);
}

.manage-preview__brand {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.12em;
}

.manage-preview__tools {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
}

.manage-preview__tool {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.88);
    font-size: 19px;
}

.manage-preview__avatar {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    border: 2px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    color: #7c2d12;
    background: #fef3c7;
    font-size: 13px;
    font-weight: 700;
}

.manage-preview .c-header-manage .u-pop-content {
    visibility: visible;
    opacity: 1;
}

.manage-preview__body {
    padding: 112px 9vw;
}

.manage-preview__eyebrow {
    color: #4f46e5;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.14em;
}

.manage-preview__body h1 {
    margin: 12px 0 0;
    color: #111827;
    font-size: 34px;
    line-height: 1.2;
}

.manage-preview__body p {
    margin: 14px 0 0;
    color: #6b7280;
    font-size: 15px;
}
</style>
