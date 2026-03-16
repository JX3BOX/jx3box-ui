<template>
    <div class="m-single-box">
        <!-- 头部 -->
        <PostHeader :post="post" :stat="stat" :anonymous="anonymous">
            <slot name="single-header"></slot>
        </PostHeader>

        <!-- 文章前 -->
        <div class="m-single-prepend">
            <!-- 联合创作者 -->
            <Creators class="m-single-creators" :postId="id" :postType="post_type" @load-authors="loadAuthors" />
            <!-- 文集小册 -->
            <Collection
                class="m-single-collection"
                :id="collection_id"
                :defaultVisible="collection_collapse"
                @collectionUpdate="updateCollection"
            />
            <slot name="single-prepend"></slot>
        </div>

        <!-- 文章内容 -->
        <div class="m-single-post" v-if="visible">
            <el-divider content-position="left">JX3BOX</el-divider>
            <div class="m-single-content">
                <slot></slot>
                <Article :content="post_content" :post_mode="post_mode" @directoryRendered="updateDirectory" />
            </div>
        </div>
        <div class="m-single-null" v-else>
            <el-alert :title="null_tip" type="warning" show-icon></el-alert>
        </div>

        <!-- 文章后 -->
        <div class="m-single-append">
            <slot name="single-append"></slot>

            <!-- 打赏 -->
            <Thx
                class="m-single-thx"
                :postId="id"
                :postType="post_type"
                :postTitle="post_title"
                :userId="author_id"
                :adminBoxcoinEnable="true"
                :userBoxcoinEnable="true"
                :authors="authors"
                :client="post_client"
                showRss
                v-if="showThx"
            />

            <!-- 评论 -->
            <div ref="commentView" class="m-single-comment">
                <el-divider content-position="left">{{ $jx3boxT("jx3boxUi.cmsSingle.comment", "评论") }}</el-divider>
                <Comment :id="id" category="post" v-if="id && allow_comment" />
                <el-alert
                    :title="$jx3boxT('jx3boxUi.cmsSingle.commentDisabled', '作者没有开启评论功能')"
                    type="warning"
                    show-icon
                    v-else
                ></el-alert>
            </div>
        </div>

        <!-- 底部 -->
        <footer class="m-single-footer">
            <slot name="single-footer"></slot>
        </footer>

        <right-affix
            :postId="id"
            :postType="post_type"
            :postTitle="post_title"
            :showComment="id && allow_comment"
            @toComment="toComment($event)"
        ></right-affix>
    </div>
</template>

<script>
import PostHeader from "./PostHeader.vue";
import Creators from "./Creators.vue";
import Collection from "./Collection.vue";
import Thx from "./Thx.vue";
import RightAffix from "./RightAffix.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getAppType } from "@jx3box/jx3box-common/js/utils";
import i18nMixin from "../../i18n/mixin";

const { __visibleMap } = JX3BOX;

export default {
    name: "cms-single",
    mixins: [i18nMixin],
    components: {
        PostHeader,
        Creators,
        Collection,
        Thx,
        Article,
        RightAffix,
    },
    props: {
        post: {
            type: Object,
            default: () => ({}),
        },
        stat: {
            type: Object,
            default: () => ({}),
        },
        showThx: {
            type: Boolean,
            default: true,
        },
    },
    data: function () {
        return {
            collection_data: "",
            directory: false,

            // 创作者
            other_authors: [],
            super_author: "",
        };
    },
    computed: {
        id: function () {
            return ~~this.post?.ID || 0;
        },
        app_type: function () {
            return getAppType();
        },
        post_type: function () {
            return this.post?.post_type;
        },
        post_title: function () {
            return this.post?.post_title;
        },
        author_id: function () {
            return this.post?.post_author;
        },
        collection_id: function () {
            return this.post?.post_collection;
        },
        collection_collapse: function () {
            return this.post?.collection_collapse;
        },
        visible: function () {
            return !!this.post?._check;
        },
        null_tip: function () {
            let str = this.$jx3boxT("jx3boxUi.cmsSingle.authorSet", "作者设置了【");
            str += __visibleMap[this.post?.visible];
            str += "】";
            return str;
        },
        post_content: function () {
            return this.post?.post_content || "";
        },
        post_mode: function () {
            return this.post?.post_mode || "tinymce";
        },
        isMarkdown: function () {
            return this.post_mode == "markdown";
        },
        allow_comment: function () {
            return !this.post?.comment;
        },
        extend_data: function () {
            return {
                collection_data: this.collection_data,
                directory: this.directory,
            };
        },
        authors: function () {
            if (this.other_authors && this.other_authors.length) {
                return [this.super_author, ...this.other_authors];
            }
            return [];
        },
        post_client: function () {
            return this.post?.client || "all";
        },
        community_id: function () {
            return this.post?.community_id || 0;
        },
        anonymous: function () {
            return this.post?.anonymous ==1;
        }
    },
    methods: {
        shouldSkipNavigation: function () {
            if (typeof window === "undefined" || typeof location === "undefined") return false;
            return location.pathname.includes("iframe.html") || !!window.__STORYBOOK_PREVIEW__;
        },
        updateCollection: function (val) {
            this.collection_data = val;
        },
        updateDirectory: function (val) {
            this.directory = val;
        },
        loadAuthors({ super_author, other_authors }) {
            this.super_author = super_author;
            this.other_authors = other_authors;
        },
        toComment() {
            this.$refs.commentView.scrollIntoView({
                block: "start",
                behavior: "auto",
            });
        },
    },
    watch: {
        extend_data: {
            deep: true,
            immediate: true,
            handler: function (val) {
                this.$emit("extendUpdate", val);
            },
        },
        post_type: {
            deep: true,
            immediate: true,
            handler: function (val) {
                if (location.host.includes("localhost") || this.shouldSkipNavigation()) {
                    return;
                }

                if (val && val !== this.app_type) {
                    location.href = `/${val}/${this.id}`;
                }
            },
        },
        community_id: {
            immediate: true,
            handler(val) {
                if (this.shouldSkipNavigation()) {
                    return;
                }
                if (val && val != 0) {
                    // 防止死循环
                    if (location.href.includes(`/community/${val}`)) {
                        return;
                    }
                    location.href = `/community/${val}`;
                }
            },
        },
    },
};
</script>

<style lang="less">
/* src/single/CmsSingle.vue */
@import "../../assets/css/single/cms-single.less";
</style>
