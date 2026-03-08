<template>
    <div class="w-filter-tag" :class="{ on: visible }">
        <span class="u-label" @click="toggleFilter">
            <span class="u-current-filter"
                ><el-icon>
                    <collection-tag />
                </el-icon>
                {{ current || "全部" }}</span
            >
            <span class="u-toggle">
                <el-icon class="el-icon-arrow-down">
                    <arrow-down />
                </el-icon>
                <el-icon class="el-icon-arrow-up">
                    <arrow-up />
                </el-icon>
            </span>
        </span>
        <span class="u-options">
            <span class="u-mode u-all" :class="{ on: value === '' }" @click="filter('', '')"
                ><el-icon>
                    <collection-tag />
                </el-icon>
                全部</span
            >
            <span
                v-for="(item, key) in data"
                :key="key"
                class="u-mode"
                :class="{ on: item == current }"
                @click="filter(key)"
                ><el-icon>
                    <collection-tag />
                </el-icon>
                {{ item }}</span
            >
            <slot></slot>
        </span>
    </div>
</template>

<script>
export default {
    name: "tagBy",
    emits: ["filter"],
    props: ["data", "type"],
    data: function () {
        return {
            visible: false,
            value: "",
        };
    },
    computed: {
        current: function () {
            return this.data[this.value];
        },
    },
    methods: {
        toggleFilter: function () {
            this.visible = !this.visible;
        },
        filter: function (key) {
            this.value = key;
            this.$emit("filter", { type: this.type, val: key });
            this.visible = false;
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
.w-filter-tag {
    .fz(12px);

    .u-label {
        .none;
    }
    .u-current-filter {
        .flex;
        align-items: center;
        gap: 5px;
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
    }
    .u-mode {
        .flex;
        align-items: center;
        gap: 2px;
        .pointer;
        &.on {
            color: @primary;
        }
        &:hover {
            color: @pink;
        }
    }
}
@media screen and (max-width: @ipad) {
    .w-filter-tag {
        .pr;
        background-color: @bg-light;
        border: 1px solid #ddd;
        .r(4px);
        user-select: none;
        padding: 6px 0;
        padding-right: 20px;

        &.on {
            .u-options {
                flex-direction: column;
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
            flex-direction: column;
            .pa;
            .lt(-1px, 29px);
            padding: 5px 0;
            .w(100%);
            background-color: #fff;
            border: 1px solid #ddd;
            .z(2);
            .u-mode {
                .flex;
                align-items: center;
                gap: 5px;
                padding: 7px 10px;
                .pr;
                .ml(0);
            }
            .none;
        }
    }
}
@media screen and (max-width: @phone) {
    .w-filter-tag {
        .none;
    }
}
</style>
