<template>
    <div class="w-filter-order" :class="{ on: visible }">
        <span class="u-label" @click="toggleFilter">
            <span class="u-current-order">{{
                $jx3boxT("jx3boxUi.orderBy.sortLabel", "排序 : {current}", {
                    current: current || $jx3boxT("jx3boxUi.orderBy.lastUpdate", "最后更新"),
                })
            }}</span>
            <span class="u-toggle">
                <i class="el-icon-arrow-down"> </i>
                <i class="el-icon-arrow-up"> </i>
            </span>
        </span>
        <span class="u-options">
            <span class="u-mode u-update" :class="{ on: order == 'update' }" @click="filter('update')"
                ><el-icon>
                    <refresh />
                </el-icon>
                {{ $jx3boxT("jx3boxUi.orderBy.lastUpdate", "最后更新") }}</span
            >
            <span class="u-mode u-podate" :class="{ on: order == 'podate' }" @click="filter('podate')"
                ><el-icon>
                    <sort />
                </el-icon>
                {{ $jx3boxT("jx3boxUi.orderBy.earliestPublish", "最早发布") }}</span
            >
            <slot></slot>
        </span>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "orderBy",
    mixins: [i18nMixin],
    emits: ["filter"],
    props: {},
    data: function () {
        return {
            visible: false,
            order: "update",
        };
    },
    computed: {
        current: function () {
            const orderMap = {
                update: this.$jx3boxT("jx3boxUi.orderBy.lastUpdate", "最后更新"),
                podate: this.$jx3boxT("jx3boxUi.orderBy.earliestPublish", "最早发布"),
                favs: this.$jx3boxT("jx3boxUi.orderBy.mostFavs", "收藏最多"),
                likes: this.$jx3boxT("jx3boxUi.orderBy.mostLikes", "点赞最多"),
                downs: this.$jx3boxT("jx3boxUi.orderBy.mostDownloads", "下载最多"),
            };
            return orderMap[this.order];
        },
    },
    methods: {
        toggleFilter: function () {
            this.visible = !this.visible;
        },
        filter: function (key) {
            this.order = key;
            this.$emit("filter", { type: "order", val: key });
            this.visible = false;
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
/* src/filters/orderBy.vue */
.w-filter-order {
    .fz(12px);

    .u-label {
        .none;
    }
    .u-toggle {
        .pa;
        .rt(0);
        padding: 6px 10px;
        .pointer;

        .el-icon-arrow-up {
            .none;
        }

        &.on {
            .el-icon-arrow-down {
                .none;
            }
            .el-icon-arrow-up {
                .db;
            }
        }
    }
    .u-options {
        .flex;
        gap: 15px;
        align-items: center;
    }
    .u-mode {
        .flex;
        gap: 2px;
        align-items: center;
        .pointer;
        &.on {
            color: var(--el-color-primary);
        }
        &:hover {
            color: @pink;
        }
    }
}
@media screen and (max-width: @ipad) {
    .w-filter-order {
        .pr;
        background-color: #f6f8fa;
        border: 1px solid #eee;
        .r(4px);
        user-select: none;
        padding: 5px 0;
        padding-right: 20px;
        .w(150px);

        &.on {
            .u-options {
                .flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0;
            }

            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .u-label {
            padding: 0 10px;
            .pointer;
            .db;
        }
        .u-options {
            .pa;
            .lt(-1px, 29px);
            padding: 5px 0;
            .w(100%);
            background-color: #fff;
            border: 1px solid #ddd;
            .z(2);
            .flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            .u-mode {
                .flex;
                align-items: center;
                gap: 2px;
                padding: 7px 10px;
                .pr;
                .ml(0);
            }
            .none;
        }
    }
}
@media screen and (max-width: @phone) {
    .w-filter-order {
        .none;
    }
}
</style>
