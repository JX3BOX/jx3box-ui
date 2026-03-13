<template>
    <div class="c-post-collection" v-if="list && list.length">
        <div class="m-title">
            <div class="c-post-collection-title">
                <el-icon class="u-icon"><Connection>></Connection></el-icon> 关联
            </div>
            <div class="u-op" @click="toggle"><el-icon><DCaret></DCaret></el-icon> 折叠</div>
        </div>
        <transition name="collapse">
            <ul v-show="show" class="c-post-collection-list">
                <li v-for="(item, i) in list" :key="i">
                    <el-tooltip class="item" effect="dark" :content="item.title" placement="left">
                        <a :href="showLink(item)" target="_blank">
                            <el-icon><Link></Link></el-icon>
                            {{ item.title }}
                        </a>
                    </el-tooltip>
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
import { getLink, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getCollection } from "../../service/cms";
const { __imgPath } = JX3BOX;
export default {
    name: "PostCollection",
    props: ["id", "store"],
    components: {},
    data: function () {
        return {
            data: {
                title: "",
                posts: [],
            },
            show: true,
        };
    },
    computed: {
        list: function () {
            return this.store?.posts || this.data?.posts;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function (val) {
                !!~~val && this.loadData();
            },
        },
    },
    methods: {
        loadData: function () {
            getCollection(this.id).then((res) => {
                this.data = res.data?.data;
            });
        },
        showLink: function (item) {
            if (item.type == "custom") {
                return item.url;
            } else {
                return getLink(item.type, item.id);
            }
        },
        getCover: function (val) {
            return val ? resolveImagePath(val) : `${__imgPath}image/collection/default_cover.png`;
        },
        toggle: function () {
            this.show = !this.show;
        },
    },
};
</script>
<style lang="less">
.c-post-collection {
    .m-title {
        .flex;
        justify-content: space-between;
        align-items: center;
        line-height: 24px;
        .u-op {
            font-size: 14px;
            line-height: 18px;
            padding: 0 5px;
            color: #cdd1db;
            cursor: pointer;
            .flex(y);
            &:hover {
                color: #a1a9bb;
            }
        }
    }
    .u-image {
        img {
            .w(100%);
            height: 226px;
            object-fit: cover;
        }
    }
    .c-post-collection-title {
        font-weight: 500;
        line-height: 24px;
        .flex;
        align-items: center;
        font-size: 15px;
        gap: 5px;
        color: #333;
    }
    .u-icon {
        font-size: 18px;
    }
    .c-post-collection-list {
        list-style: none;
        padding: 10px 20px;
        margin: 0;
        overflow: hidden;
        li {
            .fz(13px, 36px);
        }
        a {
            .db;
            color: var(--el-color-primary);
            transition: 0.15s ease-in-out;
            .nobreak;
            &:hover {
                background-color: #e6f0fb;
            }
        }
        i {
            .pr;
            top: 2px;
        }
    }

    .collapse-enter-active,
    .collapse-leave-active {
        transition: max-height 0.25s ease, opacity 0.2s ease, padding 0.25s ease;
    }

    .collapse-enter-from,
    .collapse-leave-to {
        max-height: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
    }

    .collapse-enter-to,
    .collapse-leave-from {
        max-height: 480px;
        opacity: 1;
    }
}
</style>
