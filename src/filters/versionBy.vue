<template>
    <div class="w-filter-client">
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
@import "../../assets/css/filters/client-by.less";
</style>
