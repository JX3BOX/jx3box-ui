<template>
    <div class="w-responsive-code-diff">
        <div v-if="isMobile" class="m-stacked-diff">
            <section v-for="side in ['old', 'new']" :key="side" class="m-version-panel" :class="'is-' + side">
                <h3>{{ side === 'old' ? filename : newFilename }}</h3>
                <CodeDiff v-bind="$attrs" :old-string="oldString" :new-string="newString" :context="Number.MAX_SAFE_INTEGER" output-format="side-by-side" :hide-header="true" :max-height="mobileMaxHeight" />
            </section>
        </div>
        <CodeDiff v-else v-bind="$attrs" :old-string="oldString" :new-string="newString" :filename="filename" :new-filename="newFilename" :context="context" output-format="side-by-side" :max-height="maxHeight" />
    </div>
</template>

<script>
import { CodeDiff } from "v-code-diff";

export default {
    name: "ResponsiveCodeDiff",
    inheritAttrs: false,
    components: { CodeDiff },
    props: {
        oldString: { type: String, default: "" },
        newString: { type: String, default: "" },
        filename: { type: String, default: "" },
        newFilename: { type: String, default: "" },
        context: { type: Number, default: 1024 },
        maxHeight: { type: String, default: "600px" },
        mobileMaxHeight: { type: String, default: "420px" },
    },
    data() {
        return { isMobile: typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches };
    },
    mounted() {
        this.mobileQuery = window.matchMedia("(max-width: 720px)");
        this.isMobile = this.mobileQuery.matches;
        this.mobileQuery.addEventListener("change", this.updateLayout);
    },
    beforeUnmount() {
        this.mobileQuery?.removeEventListener("change", this.updateLayout);
    },
    methods: {
        updateLayout(event) { this.isMobile = event.matches; },
    },
};
</script>

<style lang="less">
.w-responsive-code-diff {
    width: 100%;
    min-width: 0;
    .file-header .file-info { height: auto; min-height: 24px; flex-wrap: wrap; gap: 8px; }
    .file-header .info-left, .file-header .info-right { min-width: 0; overflow-wrap: anywhere; }
        .m-stacked-diff {
            display: grid;
            gap: 16px;
        }

        .m-version-panel {
            min-width: 0;
            border: 1px solid #e4e7ed;
            border-radius: 8px;
            overflow: hidden;

            h3 {
                margin: 0;
                padding: 10px 12px;
                background: #f6f7fa;
                border-bottom: 1px solid #e4e7ed;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.6;
                white-space: normal;
                overflow-wrap: anywhere;
            }

            .code-diff-view { margin: 0; border: 0; border-radius: 0; }
            .diff-table { table-layout: fixed; }
            .blob-num { min-width: 32px; padding: 0 5px; font-size: 11px; }
            .blob-code { padding: 0 8px; font-size: 12px; }
            .blob-code-inner { white-space: pre-wrap; overflow-wrap: anywhere; }

            &.is-old {
                col:nth-child(n + 3), td:nth-child(n + 3) { display: none; }
                col:first-child { width: 32px; }
            }
            &.is-new {
                col:nth-child(-n + 2), td:nth-child(-n + 2) { display: none; }
                col:nth-child(3) { width: 32px; }
            }
        }


}
</style>
