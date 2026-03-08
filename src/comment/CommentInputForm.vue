<template>
    <el-form ref="form" :model="newComment" class="c-comment-box">
        <div class="u-mask">
            参与评论，需先进行<a href="/dashboard/auth" target="_blank" class="u-link">账号认证</a>。
        </div>
        <el-form-item>
            <el-input
                rows="3"
                type="textarea"
                maxlength="300"
                show-word-limit
                v-model="newComment.content"
                placeholder="参与讨论..."
                :id="inputId"
            ></el-input>
            <div class="c-comment-tools">
                <el-icon class="u-upload-icon" @click="showUploader = !showUploader"><Picture /></el-icon>
                <Emotion
                   class="c-comment-emotion"
                   @selected="handleEmotionSelected"
                   type="pop"
                   :max="6">
                </Emotion>
                <quickReply @reply="onQuickReply"></quickReply>
                <div class="c-comment-secret">
                    <el-checkbox class="u-secret" v-model="is_secret" border size="small">悄悄话
                        <el-tooltip class="item" effect="dark" content="勾选悄悄话后仅作者和你可见，并且不可再变更状态" placement="top">
                            <el-icon><InfoFilled></InfoFilled></el-icon> </el-tooltip></el-checkbox>
                </div>
            </div>
            <Uploader
                class="u-uploader"
                ref="uploader"
                @onFinish="attachmentUploadFinish"
                @onError="attachmentUploadError"
                v-if="showUploader"
            />
            <div class="u-toolbar">
                <el-button
                    type="primary"
                    @click="onSubmit"
                    class="u-publish"
                    :disabled="disableSubmitBtn"
                    >发表评论</el-button
                >
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
import Uploader from "./Upload.vue";
import Emotion from "@jx3box/jx3box-emotion/src/Emotion2.vue";
import QuickReply from "./QuickReply.vue";

export default {
    components: {
        Uploader,
        Emotion,
        QuickReply
    },
    props: {
        // 用于判定该评论组件是否在底部
        isBottom: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if (this.isBottom) this.inputId = "textarea-bottom";
    },
    data: function() {
        return {
            showUploader: false,
            disableSubmitBtn: false,
            newComment: {
                content: ""
            },
            inputId: "textarea-top",
            is_secret: false,
        };
    },
    methods: {
        onSubmit() {
            this.disableSubmitBtn = true;
            if (this.$refs.uploader) {
                this.$refs.uploader.upload();
            } else {
                this.attachmentUploadFinish([]);
            }
        },
        onQuickReply(item) {
            this.$emit("submit", {
                content: item,
                attachmentList: [],
                is_template: 1,
            });
        },
        // 文件上传完成后，进行数据提交
        attachmentUploadFinish(data) {
            this.$emit("submit", {
                content: this.newComment.content,
                attachmentList: data
            });
            this.newComment = {
                content: ""
            };
            this.showUploader = false;

            this.disableSubmitBtn = false;
        },
        attachmentUploadError() {
            this.disableSubmitBtn = false;
        },
        // 处理表情
        handleEmotionSelected(key) {
            this.insertVariable(key);
        },
        /**
         * add emotion to textarea
         * @parma {string} emotionVal emotion key
         */
        async insertVariable(emotionVal) {
            const myField = document.querySelector(`#${this.inputId}`);
            const value = emotionVal.key
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
        }
    }
};
</script>

<style lang="less">
.c-comment-secret {
    margin-left: 15px;

    .u-secret {
        display: flex;
        align-items: center;
        .el-checkbox__inner{
            display:block;
        }
    }
}
.c-comment-box {
    .pr;

    .u-mask {
        .pa;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        z-index: 10;
        display: none;
        text-align: center;
        align-content: center;
    }

    .u-link {
        color: @primary;
    }
}
</style>
