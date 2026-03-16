<template>
    <div class="c-comment-replylist" v-if="data.length">
        <reply-item
            class="c-comment-reply"
            v-for="reply in data"
            :key="reply.id"
            :reply="reply"
            :power="power"
            @deleteReply="deleteReply"
            @addReply="addReply"
            @setLikeComment="setLikeComment"
            @hide="hideReply"
        />
        <!-- 分页 -->
        <el-row v-if="data.length >= 3 || showPager">
            <el-col :span="4">
                <el-button link v-show="showPager" @click="showLess()">{{
                    $jx3boxT("jx3boxUi.replyList.collapse", "收起")
                }}</el-button>
                <el-button link v-show="!showPager" @click="showMore()">{{
                    $jx3boxT("jx3boxUi.replyList.showMore", "查看更多")
                }}</el-button>
            </el-col>
            <el-col :span="20" class="c-comment-reply-pages">
                <el-pagination
                    v-show="showPager"
                    size="small"
                    @current-change="handleCurrentChange"
                    :current-page="pager.index"
                    :page-size="pager.pageSize"
                    layout="total, prev, pager, next"
                    :total="pager.total"
                ></el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ReplyItem from "./ReplyItem.vue";
import i18nMixin from "../../i18n/mixin";
export default {
    mixins: [i18nMixin],
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        power: {
            type: Object,
            default: () => ({}),
        },
        pager: {
            type: Object,
            default: () => ({
                index: 1,
                pageSize: 10,
                pageTotal: 1,
                total: 0,
            }),
        },
    },
    components: {
        ReplyItem,
    },
    data: function () {
        return {
            showPager: false,
        };
    },
    emits: ["goto", "resetReply", "deleteReply", "addNewReply", "setLikeComment", "hide"],
    methods: {
        showMore() {
            this.showPager = true;
            this.$emit("goto", 1);
        },
        showLess() {
            this.showPager = false;
            this.$emit("resetReply");
        },
        handleCurrentChange(gotoIndex) {
            this.$emit("goto", gotoIndex);
        },
        deleteReply(id) {
            this.$emit("deleteReply", id);
        },
        hideReply(id) {
            this.$emit("hide", id);
        },
        setLikeComment(id, isLike) {
            this.$emit("setLikeComment", id, isLike);
        },
        addReply(data) {
            this.$emit("addNewReply", data);
        },
    },
};
</script>

<style lang="less">
/* src/comment/ReplyList.vue */
.c-comment-replylist {
    padding: 10px 0 10px 68px;
    border-top: 1px dashed #eee;
}
.c-comment-reply {
    padding-top: 5px;
    background-size: cover;
    flex-direction: column;
    &:not(:last-of-type) {
        border-bottom: 1px dashed #eee;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .c-comment-avatar {
        margin-right: 10px;
        width: auto;

        .u-avatar {
            float: left;
        }
        .u-avatar-pic {
            width: 28px;
            height: 28px;
            margin-right: 10px;
            border:1px solid #eee;
        }
        .u-avatar-frame{
            display: none;
        }

        .u-name {
            font-size: 13px;
            line-height: 28px;
            padding: 0 !important;
            display: inline;
            white-space: nowrap;
        }
    }
    .u-reply {
        padding: 5px;
        line-height: 1.715;
        .u-attachements {
            margin-top: 10px;
            .el-image {
                margin-right: 20px;
            }
        }
    }
}
.c-comment-reply-pages {
    padding: 7px 0;
}
</style>
