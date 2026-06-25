<template>
    <!-- 增加交互反馈样式和键盘聚焦样式 -->
    <div
        ref="trigger"
        class="w-copy-container"
        role="button"
        :aria-label="defaultSuccessText"
        tabindex="0"
        @click="handleCopy"
        @keydown.enter.prevent="handleCopy"
        @keydown.space.prevent="handleCopy"
    >
        <slot></slot>
    </div>

    <!-- 传送门到 Body 确保不受父级 overflow 限制 -->
    <teleport to="body">
        <transition name="copy-toast-fade">
            <div v-if="toastVisible" class="w-copy-toast" :style="{ left: `${toastX}px`, top: `${toastY}px` }">
                <div class="w-copy-toast__content">
                    <template v-if="showDefaultTip">
                        <svg class="w-copy-toast__svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="currentColor"
                                d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
                            ></path>
                        </svg>
                        <span class="w-copy-toast__text">{{ defaultSuccessText }}</span>
                    </template>
                    <template v-else>
                        <span class="w-copy-toast__text">{{ tipText }}</span>
                    </template>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import throttleFn from "lodash/throttle";
import i18nMixin from "../../i18n/mixin";

export default {
    name: "CopyComp",
    mixins: [i18nMixin],
    props: {
        // 支持字符串、数字，或返回这些类型的函数（用于实时获取最新数据）
        value: {
            type: [String, Number, Function],
            default: "",
        },
        tip: {
            type: String,
            default: "",
        },
        throttle: {
            type: Number,
            default: 1500, // 默认防抖时间
        },
    },
    emits: ["success", "error"],
    data() {
        return {
            toastVisible: false,
            toastX: 0,
            toastY: 0,
            hideTimer: null,
            throttledCopy: null,
        };
    },
    computed: {
        tipText() {
            return this.tip;
        },
        showDefaultTip() {
            return !this.tipText;
        },
        defaultSuccessText() {
            return this.$jx3boxT ? this.$jx3boxT("jx3boxUi.common.copySuccessToast", "复制成功") : "复制成功";
        },
    },
    created() {
        this.throttledCopy = throttleFn(
            (payload) => {
                this.executeCopy(payload);
            },
            this.throttle,
            { leading: true, trailing: false }
        );
    },
    methods: {
        handleCopy(event) {
            const payload = {
                target: event.currentTarget,
            };
            this.throttledCopy(payload);
        },
        async executeCopy(payload) {
            try {
                // 获取待复制内容（支持函数调用）
                const rawValue = typeof this.value === "function" ? this.value() : this.value;
                const content = `${rawValue ?? ""}`;

                if (!content) return;

                const isSuccess = await this.copyToClipboard(content);

                if (isSuccess) {
                    this.calculatePosition(payload);
                    this.showToast();
                    this.$emit("success", content);
                } else {
                    this.$emit("error", "ExecCommand failed");
                }
            } catch (err) {
                this.$emit("error", err);
            }
        },
        // 核心复制逻辑：优先 Clipboard API，降级使用 textarea
        async copyToClipboard(text) {
            if (navigator?.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (e) {
                    console.warn("Clipboard API failed, falling back...");
                }
            }

            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        },
        calculatePosition(payload) {
            const { target } = payload;
            if (!target) return;

            // 固定在触发文字上方约 30px，不再跟随鼠标坐标
            const rect = target.getBoundingClientRect();
            this.toastX = rect.left + rect.width / 2;
            this.toastY = rect.top - 30;
        },
        showToast() {
            clearTimeout(this.hideTimer);
            this.toastVisible = true;
            this.hideTimer = setTimeout(() => {
                this.toastVisible = false;
            }, 1800);
        },
    },
    beforeUnmount() {
        clearTimeout(this.hideTimer);
        this.throttledCopy?.cancel?.();
    },
};
</script>

<style lang="less">
.w-copy-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: transform 0.1s ease-out, opacity 0.2s ease;
    border-radius: 4px;
    vertical-align: middle;
    will-change: transform; // 优化渲染，防止抖动

    // 点击时的缩放反馈：缩小比例幅度，防止视觉抖动过大
    &:active {
        transform: scale(0.97);
        opacity: 0.85;
    }

    // 键盘聚焦样式
    &:focus-visible {
        outline: 2px solid #22c55e;
        outline-offset: 2px;
    }
}

.w-copy-toast {
    position: fixed;
    z-index: 9999;
    transform: translate(-50%, -100%);
    pointer-events: none;
    will-change: transform, opacity;
}

.w-copy-toast__content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: rgba(31, 45, 61, 0.9); // 深色背景，对比度更高
    backdrop-filter: blur(8px); // 磨砂玻璃效果
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    color: #ffffff;
    font-size: 13px;
    white-space: nowrap;
}

.w-copy-toast__svg {
    width: 14px;
    height: 14px;
    color: #22c55e; // 成功绿色
}

/* 优化后的过渡动画：带有一点向上漂浮的感觉 */
.copy-toast-fade-enter-active {
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.copy-toast-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.755, 0.05, 0.855, 0.06);
}

.copy-toast-fade-enter-from {
    opacity: 0;
    transform: translate(-50%, -60%) scale(0.9);
}

.copy-toast-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -140%) scale(0.95);
}
</style>
