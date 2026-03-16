<template>
    <el-dropdown class="w-filter-menu w-filter-zlp">
        <span class="el-dropdown-link">
            <span class="u-menu-label">
                <el-icon> <operation /> </el-icon>
                {{ value ? value : $jx3boxT("jx3boxUi.zlpBy.default", "资料片") }}
                <el-icon>
                    <arrow-down />
                </el-icon>
            </span>
        </span>
        <template #dropdown>
            <el-dropdown-menu class="w-filter-zlp__list">
                <el-dropdown-item @click="filter('')">
                    {{ $jx3boxT("jx3boxUi.zlpBy.all", "全部") }}
                </el-dropdown-item>
                <el-dropdown-item v-for="item in data" :key="item" @click="filter(item)">{{
                    item
                }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import zlps from "@jx3box/jx3box-common/data/jx3_zlp.json";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "zlpBy",
    mixins: [i18nMixin],
    emits: ["filter"],
    props: {
        client: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            value: "",
        };
    },
    computed: {
        data: function () {
            let client = this.client || "all";
            return zlps[client];
        },
    },
    watch: {
        client: function () {
            this.value = "";
        },
    },
    methods: {
        filter: function (key) {
            this.value = key;
            this.$emit("filter", { type: "zlp", val: key });
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
/* src/filters/zlpBy.vue */
.w-filter-menu {
    .pointer;
    .u-menu-label {
        .flex;
        align-items: center;
        gap: 5px;
        .fz(12px);
    }
}
.w-filter-zlp__list{
    max-height: 200px;
    overflow-y: auto;
}
</style>
