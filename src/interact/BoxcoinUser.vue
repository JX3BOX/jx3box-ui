<template>
    <div class="w-boxcoin-user" v-if="allowBoxcoin">
        <el-tooltip
            effect="dark"
            :content="$jx3boxT('jx3boxUi.boxcoinUser.tooltip', '投币')"
            placement="top-start"
            v-if="canGift"
        >
            <div class="w-boxcoin-block" @click="openBoxcoinPop">
                <img class="u-icon" svg-inline :src="iconPath" />
                <span class="u-count" v-if="boxcoin">{{ boxcoin }}</span>
            </div>
        </el-tooltip>
        <el-tooltip
            effect="dark"
            :content="$jx3boxT('jx3boxUi.boxcoinUser.disabledTooltip', '您当前等级不够，不能够进行投币。')"
            placement="top"
            v-else
        >
            <div class="w-boxcoin-block disabled">
                <img class="u-icon" svg-inline :src="iconPath" />
                <span class="u-count" v-if="boxcoin">{{ boxcoin }}</span>
            </div>
        </el-tooltip>
        <el-dialog
            :title="$jx3boxT('jx3boxUi.boxcoinUser.dialogTitle', '投币打赏')"
            v-model="visible"
            class="w-boxcoin-pop"
            append-to-body
            :close-on-click-modal="false"
        >
            <div class="w-boxcoin-user-content">
                <div class="u-left">
                    <em class="u-label">{{ $jx3boxT("jx3boxUi.boxcoinUser.currentBoxcoin", "当前拥有盒币") }}</em>
                    <b>{{ left }}</b>
                    <a class="u-charge" :href="chargeLink" target="_blank">[{{ $jx3boxT("jx3boxUi.boxcoinUser.recharge", "充值") }}]</a>
                </div>
                <div class="u-list">
                    <em class="u-label">❤️ {{ $jx3boxT("jx3boxUi.boxcoinUser.reward", "打赏") }}</em>
                    <Contributors v-if="authors && authors.length" :authors="authors" @chosen="handleChosen" />
                    <div class="u-points">
                        <el-radio-group v-model="count">
                            <el-radio :value="item" v-for="item in fitPoints" :key="item" border>
                                <b>{{ item }}</b
                                >{{ $jx3boxT("jx3boxUi.boxcoinUser.boxcoin", "盒币") }}
                            </el-radio>
                            <el-radio value="custom" border>{{ $jx3boxT("jx3boxUi.boxcoinUser.custom", "自定义") }}</el-radio>
                            <el-input
                                v-model="amount"
                                v-show="count === 'custom'"
                                :placeholder="$jx3boxT('jx3boxUi.boxcoinUser.customPlaceholder', '输入自定义数量')"
                            ></el-input>
                        </el-radio-group>
                    </div>
                </div>
                <div class="u-msg">
                    <em class="u-label">📝 {{ $jx3boxT("jx3boxUi.boxcoinUser.remark", "寄语") }}</em>
                    <div class="u-input">
                        <el-input
                            v-model="remark"
                            :placeholder="$jx3boxT('jx3boxUi.boxcoinUser.remarkPlaceholder', '请输入寄语（必填）')"
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
                    <el-button type="primary" @click="submit" :disabled="!ready">{{
                        $jx3boxT("jx3boxUi.common.confirm", "确定")
                    }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { rewardBoxcoin } from "../../service/thx.js";
import User from "@jx3box/jx3box-common/js/user";
import Contributors from "./Contributors.vue";
import { debounce } from "lodash";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "BoxcoinUser",
    mixins: [i18nMixin],
    props: {
        boxcoin: {
            type: Number,
            default: 0,
        },
        postType: {
            type: String,
            default: "",
        },
        postId: {
            type: [String, Number],
            default: "",
        },
        userId: {
            type: [String, Number],
            default: "",
        },
        own: {
            type: Number,
            default: 0,
        },
        points: {
            type: Array,
            default: () => [],
        },
        authors: {
            type: Array,
            default: () => [],
        },
        client: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "",
        },
        canGift: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        Contributors,
    },
    data: function () {
        return {
            visible: false,

            count: 0,
            remark: this.$jx3boxT("jx3boxUi.boxcoinUser.defaultRemark", "辛苦了，谢谢大大！"),
            amount: "",

            left: this.own,

            chargeLink: "/vip/boxcoin?redirect=" + location.href,

            chosen: "", // 被选中的人
        };
    },
    computed: {
        ready: function () {
            const count = this.count === "custom" ? this.amount : this.count;
            return this.isNotSelf && this.isEnough && count && this.remark;
        },
        isNotSelf: function () {
            return this.userId != User.getInfo().uid;
        },
        isEnough: function () {
            const count = this.count === "custom" ? this.amount : this.count;
            return this.left && this.left >= count;
        },
        allowBoxcoin: function () {
            return this.postType && this.postId && (this.userId || (this.authors && this.authors.length));
        },
        hostClient: function () {
            return location.href.includes("origin") ? "origin" : "std";
        },
        fitPoints: function () {
            return this.points; //.filter(item => item <= this.left)
        },
        iconPath() {
            return JX3BOX.__cdn + "design/vector/icon/reward.svg";
        },
    },
    watch: {
        own: function (val) {
            this.left = val;
        },
    },
    methods: {
        openBoxcoinPop: function () {
            if (User.isLogin()) {
                this.likeImg = require("../../assets/img/widget/like4ing.gif");
                this.visible = true;

                debounce(() => {
                    this.likeImg = require("../../assets/img/widget/like4.png");
                }, 2800)();
            } else {
                User.toLogin();
            }
        },
        // 选择要打赏的对象
        handleChosen(userId) {
            this.chosen = userId;
        },
        submit: function () {
            const count = this.count === "custom" ? this.amount : this.count;
            rewardBoxcoin(this.postType, this.postId, this.chosen || this.userId, count, {
                remark: this.remark,
                client: this.client || this.hostClient,
                redirect: this.category ? `/${this.category}/${this.postId}` : undefined,
            })
                .then((res) => {
                    this.$message({
                        message: this.$jx3boxT("jx3boxUi.boxcoinUser.success", "操作成功"),
                        type: "success",
                    });
                    return res.data.data;
                })
                .then((data) => {
                    // 1.扣除额度
                    this.left -= this.count;
                    // 2. 将新增emit出去
                    this.$emit("updateRecord", data);
                })
                .finally(() => {
                    this.visible = false;
                });
        },
        init: function () {},
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
/* src/interact/BoxcoinUser.vue */
.w-boxcoin-user {
    .dbi;
    .x(left);
    .w-boxcoin-block {
        .flex;
        align-items: center;
    }
    .u-icon {
        .size(26px);
        .y;
        .pr;
    }
    .u-count {
        color: #888;
        .ml(10px);
    }
    .u-charge {
        .underline(var(--el-color-primary));
        .ml(10px);
    }
}
</style>
