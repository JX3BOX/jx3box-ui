<template>
    <footer class="m-bottom">
        <a :href="homepage" target="_blank">&copy; JX3BOX.COM</a>
        <a class="u-feedback" :href="feedback" target="_blank">❤ Help</a>
    </footer>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "CommonBottom",
    data: function () {
        return {
            homepage: JX3BOX.__Root,
            feedback: JX3BOX.feedback + "&subject=" + location.href,
        };
    },
};
</script>

<style lang="less">
@import "../assets/css/common/bottom.less";
</style>
