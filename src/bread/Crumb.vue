<template>
    <div class="c-crumb" v-html="html"></div>
</template>

<script>
import { getBreadcrumb } from "../../service/breadcrumb";

export default {
    name: "BreadCrumb",
    props: {
        name: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            html: "",
        };
    },
    mounted() {
        getBreadcrumb(this.name).then((res) => {
            res = res.data;
            this.html = res.data?.html || "";
        });
    },
};
</script>

<style lang="less">
/* src/bread/Crumb.vue */
@import "../../assets/css/bread/crumb.less";
</style>
