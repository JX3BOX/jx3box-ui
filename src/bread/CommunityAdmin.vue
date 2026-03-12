<template>
    <el-drawer
        class="c-admin c-community-admin"
        title="管理面板"
        v-model="show"
        :before-close="close"
        :append-to-body="true"
        :modal="false"
        :withHeader="false"
        :close-on-click-modal="true"
    >
        <div class="c-admin-wrapper c-community-wrapper">
            <el-divider content-position="left">信息设置</el-divider>
            <div class="c-admin-extend">
                <el-input
                    v-model="form.title"
                    placeholder="请输入标题"
                    class="input-author drawer-item-content"
                >
                    <template #prepend>
                        <el-select
                            v-model="form.category"
                            style="width: 140px"
                            filterable
                            placeholder="请选择"

                        >
                            <el-option
                                v-for="item in categoryList"
                                :value="item.mark"
                                :label="item.name"
                                :key="item.name"
                            >
                            </el-option>
                        </el-select>
                    </template>
                    <template #append>
                        <el-button icon="Edit" @click="onEdit"></el-button>
                    </template>
                </el-input>
            </div>
            <div class="c-admin-extend m-community-tag">
                <div class="w-select">
                    <span class="u-select-label">标签</span>
                    <el-select
                        v-model="form.tags"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择"
                        clearable

                        @change="onTagChange"
                    >
                        <el-option v-for="item in tags" :value="item.label" :label="item.label" :key="item.label">
                        </el-option>
                    </el-select>
                </div>
                <div class="m-community-tag__content">
                    <template v-if="finalTags && finalTags.length">
                        <div class="m-community-tag__list" v-for="item in finalTags" :key="item.uuid">
                            <el-input v-model="item.label" ></el-input>
                            <el-color-picker v-model="item.color" :predefine="color_options"></el-color-picker>
                        </div>
                    </template>
                    <el-alert title="暂未设置标签" v-else type="info" show-icon :closable="false"></el-alert>
                </div>
            </div>
            <div class="c-admin-extend">
                <el-input
                    v-model="form.user_id"
                    placeholder="请输入作者ID"
                    class="input-author drawer-item-content"

                >
                    <template #prepend>
                        <span class="u-keyword">作者ID</span>
                    </template>
                    <template #append>
                        <a class="m-user" :href="authorLink(userInfo.ID)" target="_blank">
                            <el-avatar class="u-avatar" size="small" :src="userInfo.user_avatar" />
                            {{ userInfo.display_name || "匿名" }}
                        </a>
                    </template>
                </el-input>
            </div>

            <el-divider content-position="left">封面海报</el-divider>
            <div class="c-admin-banner">
                <el-upload
                    class="c-admin-upload"
                    :action="uploadurl"
                    :with-credentials="true"
                    :show-file-list="false"
                    :on-success="uploadSuccess"
                    :on-error="uploadFail"
                >
                    <img v-if="post_banner" :src="post_banner" />
                    <el-icon><Plus></Plus></el-icon>
                </el-upload>
                <el-input class="u-banner" v-model="post_banner" >
                    <template #prepend>海报地址</template>
                    <template #append>
                        <span class="u-btn" @click="removeBanner">
                            <el-icon><CircleClose></CircleClose></el-icon> 移除海报
                        </span>
                    </template>
                </el-input>
            </div>

            <el-divider content-position="left">高亮置顶</el-divider>

            <p class="c-admin-space">
                <span class="c-admin-label">置顶：</span>
                <el-checkbox-group v-model="topStatus" class="c-admin-status">
                    <el-checkbox value="is_top">全局置顶</el-checkbox>
                    <el-checkbox value="is_category_top">版内置顶</el-checkbox>
                </el-checkbox-group>
            </p>
            <p class="c-admin-space">
                <span class="c-admin-label">精选：</span>
                <el-switch v-model="form.is_star" :active-value="1" :inactive-value="0" />
            </p>

            <p class="c-admin-space">
                <span class="c-admin-label">高亮：</span>
                <el-switch v-model="form.is_hight" :active-value="1" :inactive-value="0" />
                <span v-show="showColors">
                    <el-color-picker
                        class="c-admin-highlight-block"
                        v-model="form.hight_color"
                        :predefine="color_options"
                    ></el-color-picker>
                    <span class="c-admin-highlight-preview" :style="{ color: color }" style="margin-right: 10px">
                        预览高亮效果
                    </span>
                </span>
            </p>
        </div>
        <template #footer>
            <div class="c-community-buttons">
                <div class="c-community-buttons_left">
                    <el-button type="danger" class="u-delete" icon="Delete" @click="deleteTopic">删除帖子</el-button>
                    <el-button type="warning" class="u-check" icon="RefreshLeft" @click="handleCheck"
                        >转为待审核</el-button
                    >
                </div>
                <div class="c-community-buttons_right">
                    <el-button type="primary" @click="submit" :loading="pushing">提交</el-button>
                    <el-button plain @click="close">取消</el-button>
                </div>
            </div>
        </template>
    </el-drawer>
</template>

<script>
import {
    auditTopic,
    deleteTopic,
    getCommunityTags,
    getTopicBucket,
    getTopicDetails,
    updateTopicItem,
    manageTopicAll,
} from "../../service/community";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getUserInfo } from "../../service/author";
import { debounce } from "lodash";
import { authorLink } from "@jx3box/jx3box-common/js/utils";
const { __cms } = JX3BOX;

export default {
    name: "CommunityAdmin",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        postId: {
            type: [Number, String],
            default: 0,
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            tags: [],
            topStatus: [],
            post: null,
            pushing: false,
            categoryList: [],
            color: "rgb(255,0,1)",
            color_options: [
                "rgb(255,0,1)",
                "rgb(2,209,248)",
                "rgb(147,217,25)",
                "rgb(255,154,2)",
                "rgb(255,44,142)",
                "rgb(142,46,255)",
            ],
            form: {
                category: "",
                tags: [],
                is_top: 0,
                is_star: 0,
                is_hight: 0,
                is_category_top: 0,
                hight_color: "rgb(255,0,1)",
                user_id: "",
            },

            finalTags: [],

            // 海报
            uploadurl: __cms + "api/cms/upload",
            banner_preview: "",
            post_banner: "",

            userInfo: {},

            show: false,
        };
    },
    computed: {
        data: function () {
            return {};
        },
        showColors() {
            return this.form.is_hight;
        },
    },
    watch: {
        modelValue: async function (val) {
            if (val) {
                this.show = true;
                await this.getCategoryList();
                await this.getCommunityTags();
                await this.getTopicDetails();
            }
        },
        "form.user_id": debounce(function (id) {
            id &&
                getUserInfo(id).then((res) => {
                    this.userInfo = res || {};
                });
        }, 500),
        show(val) {
            this.$emit("update:modelValue", val);
        },
    },
    methods: {
        authorLink,
        handleCheck() {
            const id = this.post.id;
            if (!id) {
                this.$message.error("ID不存在!");
                return;
            }
            this.$confirm(`此操作将该数据转为【待审核】状态, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                auditTopic(id, "wait").then(() => {
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    this.show = false;
                    window.location.href = "/community";
                });
            });
        },
        async submit() {
            const id = this.post.id;
            if (!id) {
                this.$message.error("ID不存在!");
                return;
            }

            const promises = [];

            promises.push(
                updateTopicItem(id, {
                    ...this.post,
                    user_id: Number(this.form.user_id),
                    title: this.form.title,
                    category: this.form.category,
                    banner_img: this.post_banner,
                })
            );

            promises.push(
                manageTopicAll(id, {
                    is_top: this.topStatus.includes("is_top") ? 1 : 0,
                    is_category_top: this.topStatus.includes("is_category_top") ? 1 : 0,
                    is_star: this.form.is_star,
                    is_hight: this.form.is_hight,
                    hight_color: this.form.hight_color,
                    color_tag: this.finalTags,
                })
            );

            Promise.all(promises).then(() => {
                this.$message({
                    type: "success",
                    message: "操作成功!",
                });
                this.show = false;
                location.reload();
            });
        },
        getCommunityTags() {
            getCommunityTags().then((tags) => {
                this.tags = tags;
            });
        },
        // 关闭
        close() {
            this.form = {
                category: "",
                tags: [],
                is_top: 0,
                is_star: 0,
                is_hight: 0,
            };
            this.isTopStatus = [];
            this.$nextTick(() => {
                this.show = false;
            });
        },
        getCategoryList() {
            getTopicBucket({ type: "community" }).then((res) => {
                this.categoryList = res.data.data;
            });
        },
        deleteTopic() {
            const id = this.post.id;
            if (!id) {
                this.$message.error("ID不存在!");
                return;
            }
            this.$confirm("此操作将【删除】该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                deleteTopic(id).then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    this.show = false;
                    window.location.href = "/community";
                });
            });
        },
        getTopicDetails() {
            getTopicDetails(this.postId).then((res) => {
                this.post = res.data.data;
                this.form = {
                    ...this.form,
                    is_hight: this.post.is_hight,
                    category: this.post.category,
                    is_top: this.post.is_top,
                    is_star: this.post.is_star,
                    is_category_top: this.post.is_category_top,
                    user_id: this.post.user_id,
                    title: this.post.title,
                    hight_color: this.post.hight_color,
                    tags: this.post?.color_tag?.map((item) => item.label) || [],
                };

                this.finalTags = this.post.color_tag;
                this.topStatus = [];
                this.post_banner = this.post.banner_img;
                if (this.post.is_top) {
                    this.topStatus.push("is_top");
                }
                if (this.post.is_category_top) {
                    this.topStatus.push("is_category_top");
                }
            });
        },
        onTagChange() {
            const tags = this.form.tags.map((item) => {
                const tag = this.tags.find((tag) => tag.label === item);

                if (tag) {
                    return tag;
                }

                return {
                    label: item,
                    color: "rgb(255,0,1)",
                };
            });
            this.finalTags = tags;
        },
        // 上传
        uploadSuccess: function (res, file, list) {
            this.banner_preview = URL.createObjectURL(file.raw);
            this.post_banner = res.data[0];
        },
        uploadFail: function (err, file, fileList) {
            this.$message.error("上传失败");
            console.log(err);
        },
        removeBanner: function () {
            this.post_banner = "";
        },
        onEdit() {
            window.open(`/publish/#/community/${this.postId}?from=admin`, "_blank");
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/bread/admin.less";
.c-community-admin {
    .c-admin-space {
        .flex;
        align-items: center;
        flex-wrap: wrap;
        height: 28px;
        gap: 4px;
        margin: 1em 0;
    }
    .c-admin-label {
        font-size: 14px;
        font-weight: 500;
    }

    .c-community-wrapper {
        // height: 100%;
    }
    .c-community-buttons {
        .flex;
        justify-content: space-between;
        align-items: center;
        .pa;
        width: calc(100% - 40px);
        bottom: 20px;
    }
    .c-admin-extend {
        margin-top: 10px;
    }
    .el-input-group__prepend {
        text-align: center;
        min-width: 62px;
        box-sizing: border-box;
    }

    .m-community-tag {
        margin-top: 10px;

        .u-select-label {
            border-bottom-left-radius: 0;
            height: 32px;
            line-height: 32px;
        }
        .el-select__wrapper {
            border-bottom-right-radius: 0;
        }
    }

    .m-community-tag__content {
        border: 1px solid #dcdfe6;
        border-top: none;
        padding: 10px;
    }

    .m-community-tag__list {
        .flex;
        align-items: center;
        gap: 10px;

        &:not(:last-child) {
            margin-bottom: 10px;
        }
    }

    .u-title-condition {
        .flex;
        .el-select {
            margin-left: 0 !important;
            top: 10px;
            left: -10px;
        }
    }
    .m-user {
        .flex;
        align-items: center;
        gap: 5px;
    }

    .u-banner {
        .u-btn {
            .flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
        }
    }
}

@media screen and (max-width: @phone) {
    .c-community-admin {
        .c-community-buttons {
            width: 100%;
            justify-content: space-between;
            .pr;
            bottom: 0;
        }

        .u-delete,
        .u-check {
            span {
                display: none !important;
            }
        }
    }
}
</style>
