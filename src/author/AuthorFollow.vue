<template>
    <div class="c-author-follow">
        <el-button
            v-if="!isFollow"
            class="u-btn"
            :class="{ 'is-follow': isFollow, 'u-fans-box': isSelf }"
            plain
            icon="Plus"
            @click="follow"
            :loading="loading"
            :disabled="isSelf"
            >{{ btnText }}</el-button
        >
        <el-popover
            v-else
            placement="bottom"
            trigger="hover"
            popper-class="c-author-follow-popover"
            :visible-arrow="true"
        >
            <div class="u-action-list">
                <div class="u-action-item" v-for="item in actions" :key="item.label" @click.stop="item.action">
                    {{ item.label }}
                </div>
            </div>
            <template #reference>
                <el-button class="u-trigger" :type="btnType" plain icon="Check">{{ btnText }}</el-button>
            </template>
        </el-popover>
    </div>
</template>

<script>
import { follow, unfollow, getFansCount } from "../../service/follow";
import User from "@jx3box/jx3box-common/js/user";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "AuthorFollow",
    mixins: [i18nMixin],
    props: {
        uid: {
            type: [Number, String],
            default: 0,
        },
    },
    data() {
        return {
            isFollow: false,
            fansNum: 0,
            loading: false,
        };
    },
    computed: {
        btnText() {
            return this.isFollow
                ? this.$jx3boxT("jx3boxUi.authorFollow.followed", "已粉")
                : this.$jx3boxT("jx3boxUi.authorFollow.follow", "关注");
        },
        btnType() {
            return this.isFollow ? "info" : "warning";
        },
        actions() {
            return [
                // {
                //     label: "发送私信",
                //     action: () => {
                //         window.open("/dashboard/letter?receiver=" + this.uid);
                //     },
                // },
                {
                    label: this.$jx3boxT("jx3boxUi.authorFollow.unfollow", "取消关注"),
                    action: () => {
                        this.unfollow();
                    },
                },
            ];
        },
        isSelf() {
            return this.uid == this.user.uid;
        },
        user() {
            return User.getInfo();
        },
        isLogin: function () {
            return User.isLogin();
        },
    },
    watch: {
        uid: {
            immediate: true,
            handler(val) {
                val && this.loadFans();
            },
        },
    },
    methods: {
        // 格式化粉丝数
        formatFansNum(num) {
            if (num < 10000) {
                return num === 0 ? "" : num;
            } else {
                return (num / 10000).toFixed(1) + "万";
            }
        },
        // 关注
        follow() {
            if (!this.isLogin) {
                User.toLogin();
                return;
            }
            follow(this.uid)
                .then(() => {
                    this.$message.success(this.$jx3boxT("jx3boxUi.authorFollow.followSuccess", "关注成功"));
                    this.isFollow = true;
                    this.loadFans();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 取消关注
        unfollow() {
            this.$confirm(
                this.$jx3boxT("jx3boxUi.authorFollow.confirmUnfollow", "确定不再关注此人？"),
                this.$jx3boxT("jx3boxUi.common.tip", "提示"),
                {
                confirmButtonText: this.$jx3boxT("jx3boxUi.common.confirm", "确定"),
                cancelButtonText: this.$jx3boxT("jx3boxUi.common.cancel", "取消"),
                type: "warning",
            }).then(() => {
                unfollow(this.uid)
                    .then(() => {
                        this.$message.success(this.$jx3boxT("jx3boxUi.authorFollow.unfollowSuccess", "取关成功"));
                        this.isFollow = false;
                        this.loadFans();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        },
        loadFans() {
            this.loading = true;
            getFansCount(this.uid)
                .then((res) => {
                    this.fansNum = res.data.data.follower_count || 0;
                    this.isFollow = res.data.data.is_followed;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
/* src/author/AuthorFollow.vue */
.c-author-follow {
    .u-btn.el-button {
        cursor: default;
        &:hover {
            cursor: pointer;
            background-color: @light-pink;
            color: #fff;
            border-color: darken(@light-pink, 2%);
        }
    }

    .u-fans-box {
        cursor: not-allowed;
        &:hover {
            cursor: not-allowed;
        }
    }
    .u-trigger {
        &:hover {
            cursor: default;
        }
    }
}
.c-author-follow-popover {
    //.u-follow-popover {
    &.el-popover {
        min-width: 100px;
        padding: 0;
        margin-top: 5px;
        .u-action-list {
            .u-action-item {
                text-align: center;
                cursor: pointer;
                padding: 8px 10px;
                &:hover {
                    background: rgb(248, 248, 251);
                }
            }
        }
    }
    //}
    .u-follow-count {
        margin-left: 5px;
    }
}

@media screen and (max-width: @phone) {
    .el-message-box {
        max-width: 60%;
    }
}
</style>
