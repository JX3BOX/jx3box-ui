<template>
    <div>
        <ArticleRender
            :content="content"
            directorybox="#directory"
            style="padding: 20px"
            @contentRendered="test1"
            @directoryRendered="test2"
        ></ArticleRender>
        <div id="directory"></div>
    </div>
</template>

<script>
import ArticleRender from "../src/editor/Article.vue";
import demohtml from "./content_2";

export default {
    name: "APage",
    props: [],
    data: function () {
        return {
            content: demohtml,
        };
    },
    components: {
        ArticleRender,
    },
    methods: {
        test1() {
            console.log("contentRendered");
        },
        test2() {
            console.log("directoryRendered");
        },
    },
};
</script>

<style lang="less">
html {
    padding: 20px;
}
</style>
