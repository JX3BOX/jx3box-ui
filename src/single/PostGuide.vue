<template>
    <div class="w-post-guide" v-if="hasGuide">
        <div class="u-prev">
            <a :href="getPostLink(post?.prev_post)" class="el-button el-button--default el-button--small is-plain" :class="{'is-disabled': !post?.prev_post }">
                <el-icon><ArrowLeft></ArrowLeft></el-icon>
                <span>上一篇</span>
            </a>
            <a :href="getPostLink(post?.prev_post)" class="u-post-title">{{ getPostTitle(post?.prev_post) }}</a>
        </div>
        <div class="u-next">
            <a :href="getPostLink(post?.next_post)" class="el-button el-button--default el-button--small is-plain" :class="{'is-disabled': !post.next_post }">
                <span>下一篇</span>
                <el-icon><ArrowRight></ArrowRight></el-icon>
            </a>
            <a :href="getPostLink(post?.next_post)" class="u-post-title">{{ getPostTitle(post?.next_post) }}</a>
        </div>
    </div>
</template>

<script>
import { getLink } from '@jx3box/jx3box-common/js/utils';
export default {
    name: "PostGuide",
    props: {
        post: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        hasGuide() {
            const isPrevValid = this.post.prev_post && typeof this.post.prev_post === "object";
            const isNextValid = this.post.next_post && typeof this.post.next_post === "object";
            return isPrevValid || isNextValid;
        }
    },
    methods: {
        getPostLink({ ID: id, post_type }) {
            const link = id ? getLink(post_type, id) : "javascript:;";
            return link;
        },
        getPostTitle(item) {
            return item?.post_title || "";
        }
    },
};
</script>

<style lang="less">
/* src/single/PostGuide.vue */
.w-post-guide {
    .flex;
    align-items: center;
    justify-content: space-between;

    .u-post-title {
        margin-left: 10px;
        font-size: 14px;
        // color: #666;

        &:hover {
            // color: #0366d6;
            // box-shadow: 0 1px 0 #0366d6;
            .underline(var(--el-color-primary));
            color:var(--el-color-primary);
        }
    }
}

@media screen and (max-width: @phone) {
    .w-post-guide {
        flex-wrap: wrap;

        .u-prev,.u-next {
            width: 100%;
            .nobreak;
        }

        .u-prev {
            margin-bottom: 10px;
            span{
                margin-left:5px;
            }
        }

        .u-next {
            margin-left: 0;
            span{
                margin-right:5px;
            }
        }
    }
}
</style>
