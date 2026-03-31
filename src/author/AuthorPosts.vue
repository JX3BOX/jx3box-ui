<template>
    <div class="c-author-posts" v-if="ready">
        <div class="u-label">
            <img svg-inline src="../../assets/img/leftsidebar/post.svg" />
            <span>{{ $jx3boxT("jx3boxUi.authorPosts.latest", "最新作品") }}</span>
            <a :href="authorLink(uid)" class="u-more" target="_blank"
                ><img svg-inline src="../../assets/img/leftsidebar/more.svg"
            /></a>
        </div>

        <ul class="u-list" v-if="data && data.length">
            <li v-for="(item, i) in data" :key="i">
                <a class="u-item" :href="url(item.ID, item.post_type)" target="_blank">
                    <!-- <i class="u-icon">+</i> -->
                    <span class="u-title">{{
                        item.post_title ||
                        $jx3boxT("jx3boxUi.authorPosts.noTitle", "{type}/无标题", { type: item.post_type })
                    }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { authorLink, getLink } from "@jx3box/jx3box-common/js/utils";
import { getUserPosts } from "../../service/author";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "AuthorPosts",
    mixins: [i18nMixin],
    props: ["uid"],
    data: function () {
        return {
            data: [],
        };
    },
    computed: {
        ready: function () {
            return this.uid && this.data && this.data.length;
        },
    },
    watch: {
        uid: {
            immediate: true,
            handler: function (val) {
                val && this.init();
            },
        },
    },
    methods: {
        url: function (pid, type) {
            return getLink(type, pid);
        },
        init: function () {
            getUserPosts(this.uid)
                .then((data) => {
                    this.data = data.slice(0, 5);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        authorLink,
    },
};
</script>

<style lang="less">
/* src/author/AuthorPosts.vue */
.c-author-posts {
    ul {
        list-style: none;
        margin: 0;
        padding: 0 0 0 10px;
    }
    li {
        // .db;
        &::marker {
            content: "+";
            font-size: 10px;
            color: #999;
        }
        list-style-position: outside;
        &:hover{
            &::marker {
                color: @v4primary;
            }
        }
    }
    .u-item {
        // display: flex;
        // align-items: center;
        display: block;
        gap: 5px;
        padding: 3px 2px 3px 5px;
        .nobreak;
        .fz(12px,2);
        color: @color;
        // border-bottom: 1px solid transparent;
        &:hover {
            color: @v4primary;
            .underline(3px,solid,@v4primary);
            font-weight: 500;
            // .u-icon {
            //     transform: translateX(5px);
            // }
        }
    }
    .u-icon {
        .fz(12px);
        .size(12px);
        .pr;
        top: -1px;
        // .y;
        color: #999;
        flex: 0 0 auto;
        // .mr(5px);
        transition: all 0.3s;
        font-style: normal;
        margin-right: 8px;
    }
    .u-title {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .u-label {
        .pr;
        .u-more {
            .fz(12px);
            .pa;
            .rb(0,10px);
            color: #999;
            &:hover {
                color: @v4primary;
                fill: @v4primary;
            }
        }
    }
}
</style>
