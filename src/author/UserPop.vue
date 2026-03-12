<template>
    <el-dialog
        class="w-userpop"
        :title="title"
        v-model="visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <div class="u-tip">
            <slot></slot>
        </div>
        <div class="u-input">
            <el-input
                v-model.trim.lazy="search"
                :placeholder="$jx3boxT('jx3boxUi.userPop.placeholder', '请输入用户 UID 或者昵称进行搜索')"
                @keydown.enter="onSearch"
            >
                <template #prepend>
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>
            <el-button  class="u-search-btn" type="primary" @click="onSearch" :disabled="!search">{{
                $jx3boxT("jx3boxUi.userPop.search", "搜索")
            }}</el-button>
        </div>
        <div class="u-preview" v-loading="loading">
            <template v-if="searched && status">
                <a class="u-author" :href="'/author/' + userdata.ID" target="_blank">
                    <img class="u-avatar" :src="showAvatar(userdata.user_avatar)" />
                    <span class="u-name">{{ userdata.display_name || "-" }}</span>
                </a>
            </template>
            <template v-else>
                <img class="u-avatar" :src="showAvatar('')" />
                <span class="u-name">-</span>
                <div class="u-empty">
                    <el-icon><Warning /></el-icon>{{
                        searched
                            ? $jx3boxT("jx3boxUi.userPop.notFound", "未找到匹配项")
                            : $jx3boxT("jx3boxUi.userPop.empty", "请输入搜索条件")
                    }}
                </div>
            </template>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button  @click="cancel">{{ $jx3boxT("jx3boxUi.common.cancel", "取消") }}</el-button>
                <el-button  type="primary" @click="confirm">{{ $jx3boxT("jx3boxUi.common.confirm", "确定") }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { showAvatar } = utilModule;
import { getUserInfoByUidOrName } from "../../service/author";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "UserPop",
    mixins: [i18nMixin],
    props: {
        title: {
            type: String,
            default: "",
        },
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            visible: false,
            search: "",
            searched: false,
            userdata: {
                ID: "",
                name: "",
                avatar: "",
            },
            status: true,
            loading: false,
        };
    },
    emits: ["update:modelValue", "confirm"],
    watch: {
        modelValue: function (val) {
            this.visible = val;
        },
        visible: function (val) {
            this.$emit("update:modelValue", val);
        },
    },
    methods: {
        confirm: function () {
            if (this.status) {
                this.visible = false;
                this.$emit("confirm", this.userdata);
            } else {
                this.$alert(this.$jx3boxT("jx3boxUi.userPop.invalid", "用户不存在 或 UID不正确"), this.$jx3boxT("jx3boxUi.userPop.alertTitle", "提醒"), {
                    confirmButtonText: this.$jx3boxT("jx3boxUi.common.confirm", "确定"),
                });
            }
        },
        showAvatar: function (val) {
            return showAvatar(val, "l");
        },
        onSearch() {
            if (!this.search) {
                this.userdata = {
                    name: "",
                    avatar: "",
                };
                this.status = true;
                return;
            }
            this.loading = true;
            this.searched = false;
            getUserInfoByUidOrName({ search: this.search })
                .then((data) => {
                    if (data) {
                        this.status = true;
                        this.userdata = data;
                    } else {
                        this.status = false;
                        this.userdata = {
                            name: "",
                            avatar: "",
                        };
                    }
                })
                .finally(() => {
                    this.loading = false;
                    this.searched = true;
                });
        },
        cancel() {
            this.visible = false;
            this.search = "";
            this.userdata = {
                name: "",
                avatar: "",
            };
            this.status = true;
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
.w-userpop {
    .fz(1rem, 2.5);
    .el-dialog {
        min-width: 520px;
    }

    .u-avatar {
        .mt(20px);
        .size(120px);
        .db;
        .auto(x);
        border: 1px solid #eee;
        padding: 5px;
    }
    .u-name {
        .bold;
        .x;
        .db;
    }
    .u-author {
        .db;
        max-width: 280px;
        .auto(x);
        &:hover {
            .u-avatar {
                border-color: #ff71b8;
            }
            .u-name {
                color: #ff71b8;
            }
        }
    }
    .u-tip {
        .fz(13px);
    }
    .u-input {
        .flex;
        align-items: center;
        gap: 10px;
    }
    .u-empty {
        color: #999;
        .x;
    }
    .dialog-footer {
        text-align: center;
    }
}

@media screen and (max-width: @phone) {
    .w-userpop .el-dialog {
        .w(100%) !important;
        min-width: 0;
        margin-top: 0 !important;
    }
}
</style>
