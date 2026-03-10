<template>
    <div class="w-boxcoin-admin" v-if="allowBoxcoin">
        <el-tooltip
            effect="dark"
            :content="$jx3boxT('jx3boxUi.boxcoinAdmin.tooltip', '品鉴')"
            placement="top-start"
        >
            <div class="w-boxcoin-block">
                <img @click="openBoxcoinPop" class="u-icon" svg-inline :src="iconPath" />
            </div>
        </el-tooltip>
        <el-dialog
            :title="$jx3boxT('jx3boxUi.boxcoinAdmin.dialogTitle', '品鉴评分')"
            v-model="visible"
            class="w-boxcoin-pop"
            :close-on-click-modal="false"
            append-to-body
        >
            <div class="w-boxcoin-admin-content">
                <div class="u-left">
                    <em class="u-label">{{ $jx3boxT("jx3boxUi.boxcoinAdmin.monthStatus", "本月状态") }}</em>
                    {{
                        $jx3boxT("jx3boxUi.boxcoinAdmin.monthSummary", "已用{used} 剩余{left} 总计{total}", {
                            used: this.used,
                            left: this.left,
                            total: this.total,
                        })
                    }}
                    <el-progress
                        :percentage="100 - (this.used * 100) / this.total"
                        :stroke-width="15"
                        :text-inside="true"
                    ></el-progress>
                </div>
                <div class="u-list">
                    <em class="u-label">❤️ {{ $jx3boxT("jx3boxUi.boxcoinAdmin.appraise", "品鉴") }}</em>
                    <Contributors v-if="authors && authors.length" :authors="authors" @chosen="handleChosen" />
                    <div class="u-points">
                        <el-radio-group v-model="count">
                            <el-radio :value="item" v-for="item in fitPoints" :key="item" border>
                                <b>{{ item }}</b
                                >{{ $jx3boxT("jx3boxUi.boxcoinAdmin.boxcoin", "盒币") }}
                            </el-radio>
                            <el-radio value="custom" border>{{ $jx3boxT("jx3boxUi.boxcoinAdmin.custom", "自定义") }}</el-radio>
                            <el-input
                                v-model="amount"
                                v-show="count === 'custom'"
                                :placeholder="$jx3boxT('jx3boxUi.boxcoinAdmin.customPlaceholder', '输入自定义数量')"
                            ></el-input>
                        </el-radio-group>
                    </div>
                </div>
                <div class="u-msg">
                    <em class="u-label">📝 {{ $jx3boxT("jx3boxUi.boxcoinAdmin.remark", "寄语") }}</em>
                    <div class="u-input">
                        <el-input
                            v-model="remark"
                            :placeholder="$jx3boxT('jx3boxUi.boxcoinAdmin.remarkPlaceholder', '请输入寄语（必填）')"
                            :minlength="2"
                            :maxlength="30"
                            show-word-limit
                        ></el-input>
                        <el-button :disabled="fetchingCurrentRelease" @click="insertCurrentRelease"
                            >{{ $jx3boxT("jx3boxUi.boxcoinAdmin.insertCurrentRelease", "插入当前版本") }}</el-button
                        >
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">{{ $jx3boxT("jx3boxUi.common.cancel", "取消") }}</el-button>
                    <el-button type="primary" @click="submit" :disabled="!ready || submitting">{{
                        $jx3boxT("jx3boxUi.common.confirm", "确定")
                    }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { grantBoxcoin } from "../../service/thx.js";
import { getBreadcrumb } from "../../service/breadcrumb.js";
import User from "@jx3box/jx3box-common/js/user";
import Contributors from "./Contributors.vue";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "BoxcoinAdmin",
    mixins: [i18nMixin],
    props: {
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
        total: {
            type: Number,
            default: 0,
        },
        points: {
            type: Array,
            default: () => [],
        },
        max: {
            type: Number,
            default: 0,
        },
        min: {
            type: Number,
            default: 0,
        },
        authors: {
            type: Array,
            default: () => [],
        },
        client: {
            type: String,
            default: "",
        },
    },
    components: {
        Contributors,
    },
    data: function () {
        return {
            visible: false,
            count: 0,

            remark: this.$jx3boxT("jx3boxUi.boxcoinAdmin.defaultRemark", "辛苦，感谢！"),
            left: this.own,
            chosen: "", // 被选中的人
            amount: "",

            submitting: false,
            fetchingCurrentRelease: false,
        };
    },
    computed: {
        used: function () {
            return this.total - this.left;
        },
        ready: function () {
            const count = this.count === "custom" ? this.amount : this.count;
            return this.isNotSelf && !this.targetIsSelf && this.isEnough && count && this.remark;
        },
        isNotSelf: function () {
            return this.userId != User.getInfo().uid;
        },
        targetIsSelf: function () {
            return this.chosen == User.getInfo().uid;
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
            return this.points.filter((item) => item <= this.left);
        },
        iconPath() {
            return JX3BOX.__cdn + "design/vector/icon/taste.svg";
        },
    },
    watch: {
        own: function (val) {
            this.left = val;
        },
    },
    methods: {
        openBoxcoinPop: function () {
            this.visible = true;
        },
        // 选择要打赏的对象
        handleChosen(userId) {
            this.chosen = userId;
        },
        submit: function () {
            this.submitting = true;
            const count = this.count === "custom" ? this.amount : this.count;
            grantBoxcoin(this.postType, this.postId, this.chosen || this.userId, count, {
                remark: this.remark,
                client: this.client || this.hostClient,
            })
                .then((res) => {
                    this.$message({
                        message: this.$jx3boxT("jx3boxUi.boxcoinAdmin.success", "操作成功"),
                        type: "success",
                    });
                    return res.data.data;
                })
                .then((data) => {
                    // 1.扣除额度
                    this.left -= this.count;
                    // 2.将修改emit出去
                    this.$emit("updateRecord", data);
                })
                .finally(() => {
                    this.submitting = false;
                    this.visible = false;
                });
        },
        insertCurrentRelease: function () {
            this.fetchingCurrentRelease = true;
            getBreadcrumb(`current-release-${this.hostClient}`)
                .then((res) => {
                    this.remark += res.data.data.html;
                })
                .catch(() => {
                    this.$message({
                        message: this.$jx3boxT("jx3boxUi.boxcoinAdmin.fetchFailed", "获取失败"),
                        type: "error",
                    });
                })
                .finally(() => {
                    this.fetchingCurrentRelease = false;
                });
        },
        init: function () {},
    },
    created: function () {},
    mounted: function () {},
};
</script>
