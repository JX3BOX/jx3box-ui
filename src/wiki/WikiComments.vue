<template>
    <WikiPanel class="c-wiki-comments" scene="detail">
        <template #head-title>
            <i class="el-icon-chat-line-round"></i>
            <span>百科评论</span>
        </template>
        <template #body>
            <div class="m-comments-panel" v-loading="loading">
                <div class="u-empty" v-if="!comments || !comments.length">
                    <span v-if="comments === null">🎉 数据加载中...</span>
                    <span v-if="comments === false">⚠️ 数据加载异常</span>
                    <span v-if="comments && !comments.length">💧 暂无评论</span>
                </div>
                <!-- 递归评论组件 -->
                <wiki-comment :comments="comments" :source-id="sourceId" />
                <el-pagination
                    class="u-pagination-box"
                    background
                    hide-on-single-page
                    :current-page="page"
                    :total="total"
                    :page-size="pageSize"
                    layout="prev, pager, next, total"
                    @current-change="handleCurrentChange"
                ></el-pagination>
                <!-- 回复表单 -->
                <div id="m-reply-form" class="m-reply-form">
                    <h4 class="u-title">
                        <i class="el-icon-chat-dot-round"></i>
                        <span>回复</span>
                    </h4>
                    <textarea class="u-reply-content" v-model="reply_form.content"></textarea>
                    <div class="u-author">
                        <span>昵称：</span>
                        <input v-model="reply_form.user_nickname" type="text" />
                    </div>
                    <el-button type="primary" class="u-submit" @click="create_comment(reply_form)">
                        <i class="el-icon-check"></i>
                        <span>提交</span>
                    </el-button>
                </div>
            </div>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "./WikiPanel";
import Comment from "./WikiComment.vue";
import { wikiComment } from "@jx3box/jx3box-common/js/wiki";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "WikiComments",
    props: {
        type: {
            type: String,
            default: "",
        },
        sourceId: {
            type: [Number, String],
            default: 0,
        },
    },
    data() {
        return {
            comments: null,
            reply_form: {
                content: "",
                user_nickname: User.getInfo().name,
            },
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
        };
    },
    computed: {
        client: function () {
            return location.href.includes("classic") || location.href.includes("origin") ? "origin" : "std";
        },
    },
    methods: {
        get_comments() {
            if (!this.type || !this.sourceId) return;
            this.loading = true;
            wikiComment
                .list({ type: this.type, id: this.sourceId }, { client: this.client, page: this.page })
                .then((res) => {
                    res = res.data;
                    let comments = res.data.list;
                    for (let i = 0; i < comments.length; i++) {
                        comments[i]["reply_form"] = {
                            show: false,
                            content: "",
                            user_nickname: User.getInfo().name,
                        };
                    }
                    this.page = res.data.page;
                    this.total = res.data.total;
                    this.comments = filter(comments, 0);
                    // this.comments = comments;
                    this.loading = false;
                });

            function filter(comments, parent) {
                let outputs = [];
                for (let index in comments) {
                    let c = comments[index];
                    if (!c) continue;
                    if (c.parent_id === parent) {
                        // 递归
                        let children = filter(c.children, c.id);
                        c.children = children.map((item) => {
                            item.parent = {
                                user_id: c.user_id,
                                user_nickname: c.user_nickname,
                                id: c.id,
                            };
                            item.reply_form = {
                                show: false,
                                content: "",
                                user_nickname: User.getInfo().name,
                            };
                            return item;
                        });
                        outputs.push(c);
                    }
                }
                return outputs;
            }
        },
        create_comment(form, parent_id = 0) {
            // 校验评论内容
            if (!form.content) {
                this.$message({
                    message: "请先填写评论内容再尝试提交",
                    type: "warning",
                });
                return;
            }
            const data = {
                type: this.type,
                source_id: this.sourceId,
                parent_id: parent_id,
                user_nickname: form.user_nickname || User.getInfo().name,
                content: form.content,
                client: this.client,
            };
            wikiComment
                .post(data)
                .then((res) => {
                    res = res.data;
                    form.content = "";
                    this.$message({
                        message: "提交成功，请等待审核",
                        type: "success",
                    });
                })
                .finally(() => {
                    form.show = false;
                });
        },
        handleCurrentChange(page) {
            this.page = page;
            this.get_comments();
        },
        star_comment(comment, is_star) {
            wikiComment
                .star(comment.id, {
                    is_star,
                })
                .then(() => {
                    this.page = 1; // 重置页码
                    this.get_comments();
                });
        },
        top_comment(comment, is_top) {
            wikiComment
                .top(comment.id, {
                    is_top,
                })
                .then(() => {
                    this.page = 1; // 重置页码
                    this.get_comments();
                });
        },
    },
    components: {
        WikiPanel,
        "wiki-comment": Comment,
    },
    watch: {
        sourceId: {
            immediate: true,
            handler() {
                this.get_comments();
            },
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/wiki/wiki-comments.less";
</style>
