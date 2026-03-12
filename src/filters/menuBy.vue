<template>
    <el-dropdown class="w-filter-menu" v-if="data">
        <span class="el-dropdown-link">
            <span class="u-menu-label"
                ><el-icon> <operation /> </el-icon>{{ current ? current : deftext
                }}<el-icon> <arrow-down /> </el-icon
            ></span>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="filter('')">{{ $jx3boxT("jx3boxUi.menuBy.all", "全部") }}</el-dropdown-item>
                <el-dropdown-item v-for="(item, key) in data" :key="key" @click="filter(key)">{{
                    item
                }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "menuBy",
    mixins: [i18nMixin],
    emits: ["filter"],
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        type: {
            type: String,
            default: "menu",
        },
        placeholder: {
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
        current: function () {
            return this.data[this.value];
        },
        deftext: function () {
            return this.placeholder || this.$jx3boxT("jx3boxUi.menuBy.default", "筛选");
        },
    },
    methods: {
        filter: function (key) {
            this.value = key;
            this.$emit("filter", { type: this.type, val: key });
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
.w-filter-menu {
    .pointer;
    .u-menu-label {
        .flex;
        align-items: center;
        gap: 5px;
        .fz(12px);
    }
}
</style>
