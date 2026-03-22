<template>
    <div class="w-filter-version">
        <ul>
            <li class="u-client" :class="{on: version == ''}" @click="filter('')">
                {{ $jx3boxT("jx3boxUi.versionBy.all", "双端") }}
            </li>
            <li
                class="u-client"
                :class="{ on: version == value }"
                v-for="(label, value) in versions"
                :key="value"
                @click="filter(value)"
            >{{ label }}</li>
        </ul>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "versionBy",
    mixins: [i18nMixin],
    props: {
        value: {
            type: [String, Number],
            default: "",
        },
    },
    emits: ["filter"],
    data: function () {
        return {
            version: this.value || "",
        };
    },
    computed: {
        versions: function () {
            const versions = {
                0: this.$jx3boxT("jx3boxUi.versionBy.standard", "旗舰"),
                1: this.$jx3boxT("jx3boxUi.versionBy.wujie", "无界"),
            }
            return versions;
        },
    },
    methods: {
        filter: function (val) {
            this.version = val;
            this.$emit("filter", { type: "version", val: val });
            this.$forceUpdate();
        },
    },
};
</script>

<style lang="less">
/* src/filters/versionBy.vue */
.w-filter-version {
    font-size: 0;
    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    ul {
        .clearfix;
        .dbi;
        background-color: @bg-gray;
        border: 1px solid #eee;
        .r(3px);
        overflow: hidden;
    }
    li {
        padding: 5px 10px;
        .fl;
        .fz(12px);
        border-right: 1px solid #eee;
        &:last-child {
            border-right: none;
        }
        .pointer;

        &.on {
            background-color: var(--el-color-primary);
            color: #fff;
            border-color: var(--el-color-primary);
        }
    }
}
</style>
