<template>
    <el-button
        class="u-btn c-author-rss"
        :class="{ 'u-fans-box': isSelf, 'is-subscribed': subscribed }"
        size="small"
        plain
        @click="subscribe"
        :loading="loading"
        :disabled="isSelf"
    >
        <img class="u-icon" svg-inline src="../../assets/img/author/rss.svg" />
        {{ btnText }}</el-button
    >
</template>

<script>
import { getAuthorRss, subscribeAuthor, unsubscribeAuthor } from "@jx3box/jx3box-common/js/rss";
import User from "@jx3box/jx3box-common/js/user";
const jx3box = require("@jx3box/jx3box-common/data/jx3box.json");
import i18nMixin from "../../i18n/mixin";
export default {
    name: "AuthorRss",
    mixins: [i18nMixin],
    props: {
        uid: {
            type: Number,
            default: 0,
        },
        data: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            subscribed: false,
            fansNum: 0,
            loading: false,
        };
    },
    computed: {
        btnText() {
            return this.subscribed
                ? this.$jx3boxT("jx3boxUi.authorRss.followed", "已关注")
                : this.$jx3boxT("jx3boxUi.authorRss.follow", "关注");
        },
        btnType() {
            return !this.subscribed ? "info" : "warning";
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
                val && this.loadRss();
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
        subscribe() {
            if (!this.isLogin) {
                User.toLogin();
                return;
            }
            if (this.subscribed) {
                this.unsubscribe({ id: this.uid });
            } else {
                subscribeAuthor({ id: this.uid, data: { title: this.data?.display_name } })
                    .then(() => {
                        this.subscribed = true;
                        this.$message.success(this.$jx3boxT("jx3boxUi.authorRss.followSuccess", "关注成功"));
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        // 取消订阅
        unsubscribe() {
            // this.$confirm("是否取消订阅", "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning",
            // }).then(() => {
                unsubscribeAuthor({ id: this.uid })
                    .then(() => {
                        this.$message.success(this.$jx3boxT("jx3boxUi.authorRss.success", "操作成功"));
                        this.subscribed = false;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            // });
        },
        loadRss() {
            this.loading = true;
            getAuthorRss({ id: this.uid })
                .then((res) => {
                    this.fansNum = res.data.data.total || 0;
                    this.subscribed = res.data.data.subscribed;
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
/* src/author/AuthorRss.vue */
.c-author-rss.el-button {
    cursor: default;
    &:hover,
    &.is-plain:hover,
    &.is-plain:focus {
        cursor: pointer;
        background-color: @light-pink;
        color: #fff;
        border-color: darken(@light-pink, 2%);
    }
    .u-icon {
        .size(10px);
        fill: currentColor;
        margin-right: 4px;
    }
}

.c-author-rss.el-button.is-subscribed {
    color: #999;
}

@media screen and (max-width: @phone) {
    .el-message-box {
        max-width: 60%;
    }
}
</style>
