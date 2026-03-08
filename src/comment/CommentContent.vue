<template>
    <div class="u-cmt">
        <div
            class="u-text"
            v-if="content != ''"
            v-html="renderContent"
        ></div>
        <div class="u-attachements" v-if="attachments.length">
            <el-image
                v-for="url in attachments"
                :key="url"
                :src="showAttachment(url)"
                :preview-src-list="[showPreview(url)]"
                lazy
            ></el-image>
        </div>
        <div class="u-toolbar u-toolbar--primary">
            <div class="u-toolbar-left">
                <el-button
                    class="u-admin"
                    v-if="!currentUserHadLike"
                    link
                    size="small"
                    @click="doLike(true)"
                    ><img
                        class="u-up"
                        src="../../assets/img/comment/heart_1.svg"
                        alt=""
                    />点赞<span class="u-like-count">{{ likesFormat(hasLikeCount) }}</span></el-button
                >
                <el-button
                    class="u-admin"
                    link
                    size="small"
                    v-if="currentUserHadLike"
                    @click="doLike(false)"
                    ><img
                        class="u-up"
                        src="../../assets/img/comment/heart_2.svg"
                        alt=""
                    />已赞<span class="u-like-count">{{
                        likesFormat(hasLikeCount)
                    }}</span></el-button
                >
                <el-button
                    class="u-admin"
                    link
                    size="small"
                    icon="ChatRound"
                    @click="showForm = !showForm"
                    type="primary"
                    >回复</el-button
                >
                <el-button
                    class="u-admin"
                    v-if="canDelete"
                    link
                    icon="Delete"
                    size="small"
                    @click="deleteComment()"
                    type="danger"
                    >删除</el-button
                >
                <el-button
                    class="u-admin"
                    link
                    size="small"
                    icon="Delete"
                    v-if="canHide"
                    @click="hideComment()"
                    title="拉入黑洞后，仅评论者自己独自可见"
                    >黑洞</el-button
                >
                <el-button
                    class="u-admin"
                    v-if="canSetTop"
                    link
                    icon="Top"
                    size="small"
                    @click="topComment(true)"
                    type="primary"
                    >置顶</el-button
                >
                <el-button
                    class="u-admin"
                    v-if="canCancelTop"
                    link
                    icon="Top"
                    size="small"
                    @click="topComment(false)"
                    type="primary"
                    >取消置顶</el-button
                >
                <el-button
                    class="u-admin"
                    v-if="canSetStar"
                    link
                    icon="Star"
                    size="small"
                    @click="starComment(true)"
                    type="primary"
                    >加精</el-button
                >
                <el-button
                    class="u-admin"
                    v-if="canCancelStar"
                    link
                    icon="StarFilled"
                    size="small"
                    @click="starComment(false)"
                    type="primary"
                    >取消加精</el-button
                >
                <time class="u-date">
                    <i class="Clock"></i>
                    {{ dataFormat(date) }}
                </time>
            </div>
            <div class="u-toolbar-right">
                <el-button
                    class="u-admin u-filter"
                    v-if="canAddWhite"
                    link
                    size="small"
                    @click="setWhiteComment(true)"
                >
                    <img
                        class="u-icon-filter"
                        src="../../assets/img/editor/view.svg"
                        alt="显示"
                    />
                    显示</el-button
                >
                <el-button
                    class="u-admin u-filter"
                    v-if="canRemoveWhite"
                    link
                    size="small"
                    @click="setWhiteComment(false)"
                    ><img
                        class="u-icon-filter"
                        src="../../assets/img/comment/hide.svg"
                        alt="隐藏"
                    />隐藏</el-button
                >
            </div>
        </div>
        <el-form
            v-if="showForm"
            ref="form"
            :model="newComment"
            class="c-comment-subbox"
        >
            <el-form-item>
                <el-input
                    type="textarea"
                    v-model="newComment.content"
                    placeholder="参与评论..."
                    :id="'id' + inputId"
                ></el-input>
            </el-form-item>
            <el-form-item class="c-comment-tool-box">
                <div class="c-comment-tools">
                    <el-icon class="u-upload-icon" @click="showUploader = !showUploader"><Picture /></el-icon>
                    <Emotion
                       class="c-comment-emotion"
                       @selected="handleEmotionSelected"
                       type="pop"
                       :max="6"
                    ></Emotion>
                </div>
                <Uploader
                    v-if="showUploader"
                    ref="uploader"
                    @onFinish="attachmentUploadFinish"
                    @onError="attachmentUplodError"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    size="small"
                    type="primary"
                    @click="submit()"
                    :disabled="disableSubmitBtn"
                    >提交</el-button
                >
                <el-button size="small" link @click="showForm = false" type="primary"
                    >收起</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Uploader from "./Upload.vue";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { resolveImagePath } = utilModule;
import { formatContent } from "../../utils/emotion";
import Emotion from "@jx3box/jx3box-emotion/src/Emotion2.vue";

function fillZero(num) {
    return num > 9 ? num : `0${num}`;
}
export default {
    props: [
    "content",
        "date",
        "hasReply",
        "canDelete",
        "canSetTop",
        "canCancelTop",
        "canHide",
        "isLike", // 是否已点赞
        "likes", // 点赞数
        "canSetStar",
        "canCancelStar",
        "attachments",
        "commentId",
        "canAddWhite", // 是否可以添加到过滤白名单， 因为对于一般用户，它看不到非白名单的评论，所以“可以添加到白名单”的权限不要在加一次用户层面的权限判定
        "canRemoveWhite", // 是否可以从过滤白名单移除
    ],
    components: {
        Uploader,
        Emotion,
    },
    data: function () {
        return {
            newComment: {
                content: "",
            },
            showForm: false,
            disableSubmitBtn: false,
            showUploader: false,
            inputId: "",
            previewList: [],
            currentUserHadLike: this.isLike,
            hasLikeCount: this.likes,

            renderContent: "",
        };
    },
    mounted() {
        if (this.commentId) this.inputId = this.commentId;
    },
    computed: {
        _attachments: function () {
            return this.attachments.map((val) => {
                return resolveImagePath(val);
            });
        },
    },
    watch: {
        content: {
            handler: function (val) {
                this.formatContent(val);
            },
            immediate: true,
        },
    },
    methods: {
        doLike(setLike) {
            if (setLike === this.currentUserHadLike) {
                return;
            }
            this.currentUserHadLike = setLike;
            this.hasLikeCount = setLike
                ? this.hasLikeCount + 1
                : this.hasLikeCount - 1;
            this.$emit("setLikeComment", setLike);
        },
        topComment(setTop) {
            this.$emit("setTopComment", setTop);
        },
        starComment(setStar) {
            this.$emit("setStarComment", setStar);
        },
        setWhiteComment(white) {
            this.$emit("setWhiteComment", white);
        },
        deleteComment() {
            this.$confirm("确定删除该评论吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$emit("deleteComment");
                })
                .catch(() => {});
        },
        hideComment() {
            this.$confirm("确定隐藏该评论吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$emit("hide", this.commentId);
                })
                .catch(() => {});
        },
        dataFormat(str) {
            let d = new Date(str);
            return (
                d.getFullYear() +
                "-" +
                fillZero(d.getMonth() + 1) +
                "-" +
                fillZero(d.getDate()) +
                " " +
                fillZero(d.getHours()) +
                ":" +
                fillZero(d.getMinutes()) +
                ":" +
                fillZero(d.getSeconds())
            );
        },
        likesFormat(count) {
            return count > 0 ? count : "";
        },
        attachmentUploadFinish(data) {
            this.disableSubmitBtn = false;
            this.$emit("addNewReply", {
                content: this.newComment.content,
                attachmentList: data,
            });
            this.showUploader = false;
            this.newComment = {
                content: "",
            };
        },
        attachmentUplodError() {
            this.disableSubmitBtn = false;
        },

        submit() {
            this.disableSubmitBtn = true;
            if (this.$refs.uploader) {
                this.$refs.uploader.upload();
            } else {
                this.attachmentUploadFinish([]);
            }
        },
        hideForm() {},
        async formatContent(str) {
            this.renderContent = await formatContent(str);
        },
        async handleEmotionSelected(emotionVal) {
            const myField = document.querySelector(`#id${this.inputId}`);
            const value = emotionVal.key;
            if (myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;

                this.newComment.content =
                    myField.value.substring(0, startPos) +
                    value +
                    myField.value.substring(endPos, myField.value.length);

                await this.$nextTick();

                myField.focus();
                myField.setSelectionRange(
                    endPos + value.length,
                    endPos + value.length
                );
            } else {
                this.newComment.content = value;
            }
        },
        showPreview: function (val) {
            return resolveImagePath(val);
        },
        showAttachment: function (val) {
            return resolveImagePath(val) + "?x-oss-process=style/comment_thumb";
        },
    },
};
</script>

<style lang="less">
.c-comment-cmt {
    flex-grow: 1;
    position: relative;
    .u-toolbar {
        font-size: 12px;

        .el-button + .el-button {
            margin-left: 20px;
        }

        &.u-toolbar--primary {
            display: flex;
            justify-content: space-between;

            .u-toolbar-right {
                padding-right: 5px;
            }
        }

        .u-filter span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .u-icon-filter {
            width: 16px;
            height: 16px;
        }
    }
    .u-date {
        color: #c0c4cc;
        margin-left: 20px;
        i {
            margin-right: 5px;
        }
    }
    .u-cmt {
        padding: 5px 0 10px 0;
        position: relative;
        .u-text {
            line-height: 1.715;
            img {
                vertical-align: -3px;
            }
            white-space: pre-line;
        }
        .u-action {
            margin-top: 10px;
        }
        .u-attachements {
            margin-top: 10px;
            .el-image {
                margin-right: 20px;
            }
        }
    }
    .u-up {
        width: 12px;
        height: 12px;
        position: relative;
        top: 1px;
        margin-right: 5px;
    }
    .u-like-count {
        margin-left: 3px;
        // &:before {
        //     content: "(";
        // }
        // &:after {
        //     content: ")";
        // }
        color: #999;
    }
}
@media screen and (max-width: 767px) {
    .c-comment-cmt {
        .u-toolbar {
            position: static;
            margin-top: 10px;

            &.u-toolbar--primary {
                display: block !important;
            }
        }
    }
}

.c-comment-subbox {
    margin-top: 10px;
    .el-form-item {
        margin-bottom: 0px;
    }
    textarea {
        font-family: inherit;
    }

    .c-comment-tool-box {
        .el-form-item__content {
            flex-direction: column;
            align-items: flex-start;
        }
    }
}
</style>
