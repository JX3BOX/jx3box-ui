<template>
    <div class="w-boxcoin-user">
        <el-button @click="openBoxcoinPop" type="primary" size="small">批量打赏</el-button>
        <el-dialog
            title="品鉴评分"
            v-model="visible"
            class="w-boxcoin-pop"
            :close-on-click-modal="false"
            append-to-body
        >
            <div class="w-boxcoin-admin-content">
                <div class="u-left">
                    <em class="u-label">本月状态</em>
                    已用<b>{{ used }}</b> 剩余<b>{{ left }}</b> 总计<b>{{ total }}</b>
                    <el-progress
                        :percentage="total ? 100 - (used * 100) / total : 0"
                        :stroke-width="15"
                        :text-inside="true"
                    ></el-progress>
                </div>
                <div class="u-list">
                    <em class="u-label">❤️ 品鉴</em>
                    <Contributors v-if="authors && authors.length" :authors="authors" @chosen="handleChosen" />
                    <div class="u-points">
                        <el-radio-group v-model="count">
                            <el-radio :value="item" v-for="item in fitPoints" :key="item" border>
                                <b>{{ item }}</b
                                >盒币
                            </el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="u-msg">
                    <em class="u-label">📝 寄语</em>
                    <div class="u-input">
                        <el-input
                            v-model="remark"
                            placeholder="请输入寄语（必填）"
                            :minlength="2"
                            :maxlength="30"
                            show-word-limit
                        ></el-input>
                        <el-button :disabled="fetchingCurrentRelease" @click="insertCurrentRelease">插入当前版本</el-button>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button type="primary" @click="submit" :disabled="!ready || submitting">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { batchReward } from "../../service/thx.js";
import Contributors from "./Contributors.vue";
import { getBreadcrumb } from "../../service/breadcrumb.js";

export default {
    name: "BatchReward",
    emits: ["updateRecord"],
    components: {
        Contributors,
    },
    props: {
        boxcoin: {
            type: Number,
            default: 0,
        },
        postType: {
            type: String,
            default: "",
        },
        items: {
            type: Array,
            default: () => [],
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
        postId: {
            type: [Number, String, Array],
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 0,
        },
        min: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            visible: false,
            count: 0,
            remark: "辛苦，感谢！",
            left: this.own,
            chargeLink: "/vip/boxcoin?redirect=" + location.href,
            chosen: "",
            submitting: false,
            fetchingCurrentRelease: false,
        };
    },
    computed: {
        used: function () {
            return this.total - this.left;
        },
        ready: function () {
            return this.isEnough && this.count && this.remark;
        },
        isEnough: function () {
            return this.left && this.left >= this.count;
        },
        hostClient: function () {
            return location.href.includes("origin") ? "origin" : "std";
        },
        fitPoints: function () {
            return this.points.filter((item) => item <= this.left);
        },
    },
    watch: {
        own: function (val) {
            this.left = val;
        },
    },
    methods: {
        openBoxcoinPop: function () {
            if (!(this.items && this.items.length)) {
                this.$message({ message: "请选择需要打赏的作品", type: "warning" });
                return;
            }
            this.visible = true;
        },
        handleChosen(userId) {
            this.chosen = userId;
        },
        submit: function () {
            this.submitting = true;
            let client = this.client || this.hostClient;
            if (!["std", "origin", "all"].includes(client)) {
                client = "std";
            }

            batchReward(this.postType, this.count, {
                items: this.items,
                remark: this.remark,
                client: client,
                redirect: this.category ? `/${this.category}/${this.postId}` : undefined,
            })
                .then((res) => {
                    return res.data.data;
                })
                .then((data) => {
                    const success = data?.success || [];
                    const fail = data?.fail || [];
                    success.forEach((item) => {
                        const articleId = this.items?.[item.index]?.article_id ?? item?.article_id ?? "-";
                        this.$message({
                            message: `作品${articleId}打赏成功`,
                            type: "success",
                        });
                        this.left -= this.count;
                    });
                    fail.forEach((item) => {
                        const articleId = this.items?.[item.index]?.article_id ?? item?.article_id ?? "-";
                        this.$message({
                            message: `作品${articleId}打赏失败,原因：${item.msg}`,
                            type: "error",
                        });
                    });
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
                        message: "获取失败",
                        type: "error",
                    });
                })
                .finally(() => {
                    this.fetchingCurrentRelease = false;
                });
        },
    },
};
</script>
