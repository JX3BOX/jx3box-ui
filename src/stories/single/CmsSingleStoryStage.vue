<template>
    <div class="story-cmssingle-stage">
        <section class="story-cmssingle-stage__panel">
            <div class="story-cmssingle-stage__preview">
                <CmsSingle :post="mockPost" :stat="mockStat" :show-thx="false" />
            </div>
        </section>
        <section class="story-cmssingle-stage__props">
            <StoryPropsTable title="CmsSingle" description="单页详情整合容器。" :items="propsInfo" />
        </section>
    </div>
</template>

<script>
import CmsSingle from "../../single/CmsSingle.vue";
import StoryPropsTable from "../components/StoryPropsTable.vue";
import { mockPost, mockStat } from "../mockData";

export default {
    name: "CmsSingleStoryStage",
    components: {
        CmsSingle,
        StoryPropsTable,
    },
    data: function () {
        return {
            mockPost,
            mockStat,
            propsInfo: [
                { name: "post", type: "Object", default: "{}", required: true, description: "完整文章数据对象。" },
                { name: "stat", type: "Object", default: "{}", description: "统计信息对象。" },
                { name: "showThx", type: "Boolean", default: "true", description: "是否展示打赏互动区。" },
            ],
        };
    },
};
</script>

<style lang="less">
/* src/stories/single/CmsSingleStoryStage.vue */
.story-cmssingle-stage {
    display: grid;
    gap: 24px;
    justify-items: center;
    padding: 12px 0 0;
}

.story-cmssingle-stage__panel,
.story-cmssingle-stage__props {
    width: min(100%, 1120px);
}

.story-cmssingle-stage__preview,
.story-cmssingle-stage__props .story-props-table {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.story-cmssingle-stage__preview {
    padding: 24px 32px 32px;
}

.story-cmssingle-stage__preview .m-single-box {
    max-width: 100%;
}

.story-cmssingle-stage__preview .m-single-info svg,
.story-cmssingle-stage__preview .m-single-info img,
.story-cmssingle-stage__preview .w-creators img,
.story-cmssingle-stage__preview .w-collection svg,
.story-cmssingle-stage__preview .w-thx-panel svg,
.story-cmssingle-stage__preview .w-thx-panel img,
.story-cmssingle-stage__preview .w-boxcoin-records svg,
.story-cmssingle-stage__preview .w-boxcoin-records img,
.story-cmssingle-stage__preview .m-comment-box svg,
.story-cmssingle-stage__preview .m-comment-box img {
    max-width: none;
}

.story-cmssingle-stage__preview .m-single-info .u-author svg,
.story-cmssingle-stage__preview .m-single-info .u-icon-podate svg,
.story-cmssingle-stage__preview .m-single-info .u-icon-modate svg {
    width: 16px;
    height: 16px;
}

.story-cmssingle-stage__preview .w-creators .u-avatar,
.story-cmssingle-stage__preview .w-boxcoin-records .u-user-avatar,
.story-cmssingle-stage__preview .m-comment-box .u-avatar img {
    width: 48px;
    height: 48px;
    object-fit: cover;
}

.story-cmssingle-stage__preview .w-collection .el-icon,
.story-cmssingle-stage__preview .w-thx-panel .u-icon,
.story-cmssingle-stage__preview .w-thx-panel .el-icon,
.story-cmssingle-stage__preview .w-boxcoin-records .el-icon,
.story-cmssingle-stage__preview .m-comment-box .el-icon {
    width: 16px;
    height: 16px;
    font-size: 16px;
}

.story-cmssingle-stage__preview .w-thx-panel .u-icon {
    width: 26px;
    height: 26px;
}

.story-cmssingle-stage__props {
    display: flex;
    justify-content: center;
}

.story-cmssingle-stage__props .story-props-table {
    width: min(100%, 820px);
}
</style>
