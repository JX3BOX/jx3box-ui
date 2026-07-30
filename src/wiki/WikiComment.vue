<template>
    <ul class="u-comments">
        <li class="u-comment-panel" v-for="(comment, key) in comments" :key="key">
            <div class="u-comment">
                <!-- 评论内容 -->
                <div class="u-nickname-panel">
                    <a
                        class="u-nickname"
                        :href="comment.user_id ? author_url(comment.user_id) : null"
                        target="_blank"
                        v-text="comment.user_nickname"
                    ></a>
                    <template v-if="comment.parent_id">
                        <span>&nbsp;{{ $jx3boxT("jx3boxUi.wiki.reply", "回复") }}&nbsp;</span>
                        <a
                            class="u-nickname"
                            :href="comment.parent.user_id ? author_url(comment.parent.user_id) : null"
                            target="_blank"
                            v-text="comment.parent.user_nickname"
                        ></a>
                    </template>
                    <span class="u-mark u-top" v-if="comment.is_top">
                        <i class="el-icon-download"></i>
                        {{ $jx3boxT("jx3boxUi.wikiComment.top", "置顶") }}
                    </span>
                    <span class="u-mark u-star" v-if="comment.is_star">
                        <i class="el-icon-star-on"></i>
                        {{ $jx3boxT("jx3boxUi.wikiComment.star", "精华") }}
                    </span>
                </div>
                <p class="u-content" v-html="comment.content"></p>
                <!-- 其他 -->
                <div class="m-reply">
                    <!-- 展开、收起 -->
                    <el-button
                        type="default"
                        v-if="comment.reply_form && comment.reply_form.show"
                        class="u-reply"
                        @click="comment.reply_form.show = !comment.reply_form.show"
                        size="small"
                        :aria-expanded="true"
                        :aria-controls="`wiki-comment-reply-${comment.id}`"
                    >
                        <i class="el-icon-arrow-up"></i>
                        <span>{{ $jx3boxT("jx3boxUi.wikiComment.collapse", "收起") }}</span>
                    </el-button>
                    <el-button
                        type="primary"
                        plain
                        v-else
                        class="u-reply"
                        @click="comment.reply_form.show = !comment.reply_form.show"
                        icon="ChatDotRound"
                        size="small"
                        :aria-expanded="false"
                        :aria-controls="`wiki-comment-reply-${comment.id}`"
                    >
                        <span>{{ $jx3boxT("jx3boxUi.wiki.reply", "回复") }}</span>
                    </el-button>
                    <template v-if="isEditor && !comment.parent_id">
                        <el-button
                            type="primary"
                            class="u-reply"
                            @click="onStar(comment)"
                            plain
                            :icon="comment.is_star ? 'StarFilled' : 'Star'"
                            size="small"
                            >{{
                                comment.is_star
                                    ? $jx3boxT("jx3boxUi.wikiComment.cancelStar", "取消加精")
                                    : $jx3boxT("jx3boxUi.wikiComment.setStar", "加精")
                            }}</el-button
                        >
                        <el-button type="primary" class="u-reply" @click="onTop(comment)" plain icon="Top" size="small">{{
                            comment.is_top
                                ? $jx3boxT("jx3boxUi.wikiComment.cancelTop", "取消置顶")
                                : $jx3boxT("jx3boxUi.wikiComment.setTop", "置顶")
                        }}</el-button>
                    </template>
                    <!-- 更新时间 -->
                    <span class="u-time" v-text="ts2str(comment.updated)"></span>
                </div>
                <!-- 评论回复表单 -->
                <div
                    class="m-reply-form"
                    :id="`wiki-comment-reply-${comment.id}`"
                    v-if="comment.reply_form && comment.reply_form.show"
                >
                    <textarea
                        class="u-reply-content"
                        v-model="comment.reply_form.content"
                        :aria-label="$jx3boxT('jx3boxUi.wiki.reply', '回复')"
                    ></textarea>
                    <div class="u-author">
                        <span>{{ $jx3boxT("jx3boxUi.wiki.nickname", "昵称：") }}</span>
                        <input
                            v-model="comment.reply_form.user_nickname"
                            type="text"
                            :aria-label="$jx3boxT('jx3boxUi.wiki.nickname', '昵称：')"
                        />
                    </div>
                    <el-button type="primary" class="u-submit" @click="create_comment(comment.reply_form, comment.id)">
                        <i class="el-icon-check"></i>
                        <span>{{ $jx3boxT("jx3boxUi.common.submit", "提交") }}</span>
                    </el-button>
                </div>
            </div>
            <WikiComment v-if="comment.children.length" :comments="comment.children" :source-id="sourceId" />
        </li>
    </ul>
</template>

<script>
import { authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "WikiComment",
    props: {
        comments: {
            type: Array,
            default: () => [],
        },
        sourceId: {
            type: [Number, String],
            default: 0,
        },
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
    },
    methods: {
        author_url: authorLink,
        ts2str,
        create_comment(form, parent_id) {
            let app = this.$parent;
            if (!app.create_comment) app = app.$parent;
            if (!app.create_comment) {
                this.$message({
                    message: this.$jx3boxT(
                        "jx3boxUi.wikiComment.publishUnavailable",
                        "发布评论异常，请联系管理员"
                    ),
                    type: "warning",
                });
                return;
            }
            app.create_comment(form, parent_id);
        },
        isParent(comment) {
            return !comment.parent_id;
        },
        onStar(comment) {
            let app = this.$parent;
            if (!app.star_comment) app = app.$parent;
            if (!app.star_comment) {
                this.$message({
                    message: this.$jx3boxT(
                        "jx3boxUi.wikiComment.actionUnavailable",
                        "操作异常，请联系管理员"
                    ),
                    type: "warning",
                });
                return;
            }
            app.star_comment(comment, comment.is_star ? 0 : 1);
        },
        onTop(comment) {
            let app = this.$parent;
            if (!app.top_comment) app = app.$parent;
            if (!app.top_comment) {
                this.$message({
                    message: this.$jx3boxT(
                        "jx3boxUi.wikiComment.actionUnavailable",
                        "操作异常，请联系管理员"
                    ),
                    type: "warning",
                });
                return;
            }
            app.top_comment(comment, comment.is_top ? 0 : 1);
        },
    },
};
</script>
