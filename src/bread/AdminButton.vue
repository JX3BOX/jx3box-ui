<template>
    <el-button
        v-if="show"
        class="c-admin-button"
        type="primary"
        :size="button_size"
        icon="Setting"
        @click="toggleAdminPanel"
        >管理</el-button
    >
</template>

<script>
import Bus from "../../utils/bus";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "BreadAdminButton",
    props: ["size"],
    data: function () {
        return {
            show: User.isEditor(),
            button_size: this.size || "",
        };
    },
    methods: {
        toggleAdminPanel: function () {
            Bus.emit("toggleAdminPanel");
        },
    },
};
</script>
