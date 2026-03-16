<template>
    <div class="c-author-gift">
        <el-button
            class="u-btn"
            icon="Present"
            @click="openGiftDialog"
            :disabled="isSelf || !status"
            :title="btnTitle"
            plain
            size="small"
            >{{ $jx3boxT("jx3boxUi.authorGift.button", "赠礼") }}</el-button
        >

        <el-dialog
            :title="$jx3boxT('jx3boxUi.authorGift.dialogTitle', '赠礼')"
            v-model="visible"
            :append-to-body="true"
            class="c-author-gift-dialog"
            v-if="status"
        >
            <div class="u-content">
                <div class="u-left">
                    <em class="u-label">🌟 {{ $jx3boxT("jx3boxUi.authorGift.leaf", "金箔") }}</em>
                    <b>{{ left }}</b>
                    <a class="u-charge" :href="chargeLink" target="_blank">[{{ $jx3boxT("jx3boxUi.authorGift.recharge", "充值") }}]</a>
                </div>
                <div class="u-list">
                    <em class="u-label">❤️ {{ $jx3boxT("jx3boxUi.authorGift.give", "赠送") }}</em>
                    <div class="u-points">
                        <el-radio-group v-model="count">
                            <el-radio :value="item" v-for="item in fitPoints" :key="item" border>
                                <b>{{ item }}</b
                                >{{ $jx3boxT("jx3boxUi.authorGift.leaf", "金箔") }}
                            </el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="u-msg">
                    <em class="u-label">📝 {{ $jx3boxT("jx3boxUi.authorGift.remark", "寄语") }}</em>
                    <div class="u-input">
                        <el-input
                            v-model="remark"
                            :placeholder="$jx3boxT('jx3boxUi.authorGift.remarkPlaceholder', '请输入寄语（必填）')"
                            :minlength="2"
                            :maxlength="30"
                            show-word-limit
                        ></el-input>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">{{ $jx3boxT("jx3boxUi.common.cancel", "取消") }}</el-button>
                    <el-button type="primary" @click="submit" :disabled="!ready || loading" :loading="loading"
                        >{{ $jx3boxT("jx3boxUi.common.confirm", "确定") }}</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { sendCny, checkCnyStatus, checkGiftStatus } from "../../service/thx";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "AuthorGift",
    mixins: [i18nMixin],
    props: {
        uid: {
            type: [Number, String],
            default: 0,
        },
    },
    components: {},
    data: function () {
        return {
            loading: false,
            visible: false,
            fitPoints: [50, 100, 250, 520, 666, 888, 1314, 2288, 3344, 6666, 8888, 28888, 36888, 68888],

            left: 0, //剩余量
            status: true, //默认可打赏
            chargeLink: "/vip/cny?redirect=" + location.href,

            count: 0, //打赏数量
            remark: this.$jx3boxT("jx3boxUi.authorGift.defaultRemark", "辛苦，感谢！"),
        };
    },
    computed: {
        user() {
            return User.getInfo();
        },
        isSelf() {
            return this.uid == this.user.uid;
        },
        ready: function () {
            // 不能赠送给自己
            // 余额足够
            // 打赏额度不能为空
            // 必须填写赠言
            return !this.isSelf && this.left && this.left >= this.count && this.count && this.remark;
        },
        btnTitle: function () {
            if (this.isSelf) {
                return this.$jx3boxT("jx3boxUi.authorGift.selfDisabled", "不能给自己赠送礼物");
            } else if (!this.status) {
                return this.$jx3boxT("jx3boxUi.authorGift.statusDisabled", "作者没有开启接受礼物");
            }
            return "";
        },
    },
    watch: {
        uid: {
            immediate: true,
            handler: function (val) {
                val && this.load();
            },
        },
    },
    methods: {
        openGiftDialog: function () {
            if (!User.isLogin()) {
                User.toLogin();
                return;
            } else {
                this.visible = true;
            }
        },
        submit: async function () {
            this.loading = true;
            sendCny(this.user.uid, this.uid, this.count, this.remark).then((res) => {
                console.info("[AUTHOR.CNY]发起交易");
                // 消费凭证ID
                const id = res.data.data.id;

                console.info("[AUTHOR.CNY]开始轮询交易结果");
                // 状态轮询
                const loading = this.$loading({
                    lock: true,
                    text: this.$jx3boxT("jx3boxUi.authorGift.processing", "正在处理中"),
                    spinner: "el-icon-loading",
                    background: "rgba(255, 255, 255, 0.8)",
                });

                let n = 0;
                const timer = setInterval(async () => {
                    console.info(`[AUTHOR.CNY]第${n + 1}次轮询开始`);
                    await checkCnyStatus(id)
                        .then((res) => {
                            // 状态
                            let status = res.data.data.finish;

                            // 交易成功
                            if (status) {
                                console.info(`[AUTHOR.CNY]交易成功`);
                                //关闭轮询
                                loading.close();
                                clearInterval(timer);
                                // 关闭加载状态 & 消息提醒
                                this.visible = false;
                                this.loading = false;
                                this.$message({
                                    message: this.$jx3boxT("jx3boxUi.authorGift.success", "赠送成功"),
                                    type: "success",
                                });

                                // 结算与重置
                                this.left = this.left - this.count;
                                this.count = 100;
                                this.remark = this.$jx3boxT("jx3boxUi.authorGift.defaultRemark", "辛苦，感谢！");
                            } else {
                                console.info(`[AUTHOR.CNY]重新轮询`);
                            }
                        })
                        .finally(() => {
                            n += 1;
                            console.info(`[AUTHOR.CNY]第${n}次轮询结束`);
                        });

                    // 最多尝试3次
                    if (n > 5) {
                        console.info(`[AUTHOR.CNY]${n}次轮询未果，退出轮询`);
                        //关闭轮询
                        loading.close();
                        clearInterval(timer);
                        // 关闭加载状态 & 消息提醒
                        this.visible = false;
                        this.loading = false;
                        this.$message(this.$jx3boxT("jx3boxUi.authorGift.busy", "交易繁忙，请稍后再试"));
                    }
                }, 1000);
            });
        },
        load: function () {
            // 加载用户是否接受赠送与当前用户余额，仅当打开时执行一次
            User.isLogin() &&
                checkGiftStatus(this.uid).then((res) => {
                    this.left = res.data.data.cny || 0; // 当前登录用户的余额
                    this.status = res.data.data.targetUserCanReceiveCNY; // 目标用户是否接受充电
                });
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style scoped lang="less">
/* src/author/AuthorGift.vue */
.c-author-gift {
    .u-btn {
        // @color: #f9afd4;
        // background-color: #fff;
        // color: darken(@color, 10%);
        // border-color: darken(@color, 10%);

        &:hover {
            background-color: @light-pink;
            color: #fff;
            border-color: darken(@light-pink, 2%);
        }

        &.is-disabled {
            color: #c0c4cc;
            cursor: not-allowed;
            background-image: none;
            background-color: #fff;
            border-color: #ebeef5;
        }
    }
}
.c-author-gift-dialog {
    .fz(14px,2);

    .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 0;
    }

    .u-left {
        display: flex;
        align-items: center;
        .fz(14px,24px);
        .u-label {
            .mr(10px);
        }
        b {
            // color:#49c10f;
            // color:@color-link;
            color: #fba524;
            .fz(20px,1);
            .dbi;
            .y;
            vertical-align: text-bottom;
        }
        .u-charge {
            .ml(8px);
        }
        .el-progress {
            margin: 10px;
        }
    }
    .u-list {
        .mt(10px);
    }
    .u-points {
        padding: 10px;
        .el-radio {
            .ml(0) !important;
            .mb(10px);
            .w(140px);
            b {
                color: #e81224;
                .mr(5px);
            }
        }
        .el-input-number {
            .ml(0) !important;
            .mb(10px);
            .w(140px);
        }
    }

    .u-label {
        font-style: normal;
        background-color: @bg-gray;
        padding: 5px 10px;
    }
    .u-input {
        padding: 10px 0 10px 10px;
    }
}
</style>
