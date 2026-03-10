<template>
    <div class="suspend-stage">
        <div class="suspend-stage__device">
            <div class="suspend-stage__screen">
                <div class="suspend-stage__status"></div>
                <div class="suspend-stage__hero">
                    <div class="suspend-stage__eyebrow">Mobile Preview</div>
                    <h2 class="suspend-stage__title">SuspendCommon</h2>
                    <p class="suspend-stage__text">这里模拟移动端内容页底部场景，便于观察底部浮窗的真实布局效果。</p>
                </div>
                <div class="suspend-stage__card">
                    <div class="suspend-stage__card-title">当前页面</div>
                    <div class="suspend-stage__card-text">轻剑驭风版本攻略示例，向下滚动后底部浮窗依然固定显示。</div>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SuspendCommonStage",
    mounted() {
        document.body.classList.add("storybook-suspend-stage");
    },
    beforeUnmount() {
        document.body.classList.remove("storybook-suspend-stage");
    },
};
</script>

<style lang="less">
.suspend-stage {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background:
        radial-gradient(circle at top, rgba(250, 204, 21, 0.16), transparent 28rem),
        linear-gradient(180deg, #e9eef5 0%, #d8e0ea 100%);
}

.suspend-stage__device {
    position: relative;
    width: 390px;
    height: 844px;
    border-radius: 36px;
    padding: 10px;
    background: #0f172a;
    box-shadow: 0 28px 80px rgba(15, 23, 42, 0.3);
}

.suspend-stage__screen {
    position: relative;
    height: 100%;
    overflow: hidden;
    border-radius: 28px;
    background:
        linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0) 18rem),
        linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.suspend-stage__status {
    width: 140px;
    height: 28px;
    margin: 10px auto 0;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.92);
}

.suspend-stage__hero {
    padding: 28px 24px 18px;
}

.suspend-stage__eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b45309;
}

.suspend-stage__title {
    margin: 10px 0 0;
    font-size: 32px;
    line-height: 1.15;
    font-weight: 700;
    color: #0f172a;
}

.suspend-stage__text {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.8;
    color: #475569;
}

.suspend-stage__card {
    margin: 0 24px;
    padding: 18px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.suspend-stage__card-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
}

.suspend-stage__card-text {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.7;
    color: #64748b;
}

.suspend-stage .p-suspend {
    left: 50%;
    width: 390px;
    transform: translateX(-50%);
    border-radius: 28px 28px 0 0;
}

body.storybook-suspend-stage {
    overflow: hidden;
}

body.storybook-suspend-stage .p-drawer-suspend {
    background: rgba(15, 23, 42, 0.32);
}

body.storybook-suspend-stage .p-drawer-suspend .u-drawer {
    left: 50%;
    right: auto;
    width: 390px !important;
    transform: translateX(-50%);
    border-radius: 28px 28px 0 0;
}
</style>
