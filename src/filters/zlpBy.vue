<template>
    <span class="w-filter-menu">
        <el-dropdown>
            <span class="el-dropdown-link">
                <span class="u-menu-label">
                    <el-icon> <operation /> </el-icon>
                    {{ value ? value : "资料片" }}
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="filter('')">
                        {{ "全部" }}
                    </el-dropdown-item>
                    <el-dropdown-item v-for="item in data" :key="item" @click="filter(item)">{{
                        item
                    }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </span>
</template>

<script>
import zlps from "@jx3box/jx3box-common/data/jx3_zlp.json";
export default {
    name: "zlpBy",
    emits: ["filter"],
    props: ["client"],
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
.w-filter-menu {
    .pointer;
    .u-menu-label {
        i {
            .mr(5px);
        }
        .fz(12px);
    }
}
</style>
