<template>
    <div class="story-author-stage">
        <section class="story-author-stage__panel">
            <div class="story-author-stage__preview">
                <SingleAuthor :uid="8" />
            </div>
        </section>
        <section class="story-author-stage__props">
            <StoryPropsTable title="Author" description="详情页作者侧边栏整合组件。" :items="propsInfo" />
        </section>
    </div>
</template>

<script>
import SingleAuthor from "../../single/Author.vue";
import StoryPropsTable from "../components/StoryPropsTable.vue";

export default {
    name: "AuthorStoryStage",
    components: {
        SingleAuthor,
        StoryPropsTable,
    },
    data: function () {
        return {
            propsInfo: [
                { name: "uid", type: "Number | String", default: "0", required: true, description: "作者 UID。" },
                { name: "anonymous", type: "Number | String", default: "0", description: "匿名模式下不展示完整信息。" },
            ],
        };
    },
};
</script>

<style lang="less">
.story-author-stage {
    display: grid;
    gap: 24px;
    justify-items: center;
    padding: 12px 0 0;
}

.story-author-stage__panel,
.story-author-stage__props {
    width: min(100%, 960px);
}

.story-author-stage__preview,
.story-author-stage__props .story-props-table {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.story-author-stage__preview {
    padding: 32px;
}

.story-author-stage__preview .c-author {
    max-width: 320px;
    margin: 0 auto;
}

.story-author-stage__preview .u-label {
    display: flex;
    align-items: center;
    gap: 8px;
}

.story-author-stage__preview .u-label img,
.story-author-stage__preview .u-label svg {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
}

.story-author-stage__preview .u-superauthor img {
    width: 16px;
    height: 16px;
}

.story-author-stage__preview .u-medal-img {
    width: 20px;
    height: 20px;
}

.story-author-stage__preview .u-more img,
.story-author-stage__preview .u-more svg,
.story-author-stage__preview .u-icon {
    width: 12px;
    height: 12px;
    flex: 0 0 12px;
}

.story-author-stage__props {
    display: flex;
    justify-content: center;
}

.story-author-stage__props .story-props-table {
    width: min(100%, 760px);
}
</style>
