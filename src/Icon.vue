<template>
    <img v-if="renderMode === 'inline'" svg-inline :src="path" :style="boxStyle" />

    <i v-else-if="renderMode === 'font-awesome'" :class="name" :style="fontSizeStyle"></i>

    <i v-else-if="renderMode === 'lucide'" :data-lucide="name" :style="boxStyle"></i>

    <svg v-else-if="renderMode === 'sprite'" class="rx-icon" :width="size" :height="size" role="img" :style="{ fill: 'currentColor' }">
        <!-- 同时写 href 与 xlink:href，兼容性更好 -->
        <use :href="symbolId" :xlink:href="symbolId" />
    </svg>
</template>

<script>
export default {
    name: "Icon",
    props: {
        // type 缺省：使用 path + svg-inline
        // type=font-awesome：name 直接传入 "fa-xxx fa-solid" 等 class
        // type=lucide：name 直接传入 lucide 的 icon name（如 "activity"）
        // type=sprite：使用雪碧图（prefix + name）
        type: { type: String, default: "inline" },
        name: { type: String, default: "" },
        path: { type: String, default: "" },
        prefix: { type: String, default: "icon-" }, // 与插件的 symbolId 前缀一致
        size: { type: [Number, String], default: 24 }, // 图标大小，单位 px
    },
    computed: {
        renderMode() {
            const t = (this.type || "").trim();
            if (!t) return this.path ? "inline" : "";
            if (t === "font-awesome") return this.name ? "font-awesome" : "";
            if (t === "lucide") return this.name ? "lucide" : "";
            if (t === "sprite") return this.name ? "sprite" : "";
            return this.name ? "sprite" : "";
        },
        sizePx() {
            if (typeof this.size === "number") return `${this.size}px`;
            if (!this.size) return "24px";
            return String(this.size).match(/^\d+$/) ? `${this.size}px` : String(this.size);
        },
        fontSizeStyle() {
            return { fontSize: this.sizePx };
        },
        boxStyle() {
            return { width: this.sizePx, height: this.sizePx };
        },
        symbolId() {
            return `#${this.prefix}${this.name}`;
        },
    },
};
</script>
