<template>
    <div class="c-comment-upload">
        <el-upload
            action="https://cms.jx3box.com/api/cms/upload"
            ref="upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
            :file-list="fileList"
            :limit="maxCount"
            :accept="acceptedExtensions.reduce((acc, cur) => acc + `.${cur},`, '')"
            :headers="uploadHeaders"
            multiple
            with-credentials
            :on-exceed="onExceed"
            :on-change="onChange"
            :on-remove="onRemove"
            :on-success="onSuccess"
            :on-error="onError"
        >
            <el-icon><Plus></Plus></el-icon>
            <template #file="{ file }">
                <div class="u-file-card">
                    <video
                        v-if="isVideoFile(file)"
                        class="u-file-video"
                        :src="showFilePreview(file)"
                        muted
                        playsinline
                        preload="metadata"
                    ></video>
                    <img v-else class="el-upload-list__item-thumbnail" :src="showFilePreview(file)" alt="" />
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click.stop="handlePictureCardPreview(file)">
                            <el-icon><ZoomIn /></el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click.stop="handleFileRemove(file)">
                            <el-icon><Delete /></el-icon>
                        </span>
                    </span>
                </div>
            </template>
            <template #tip>
                <div class="el-upload__tip">{{ tipText }}</div>
            </template>
        </el-upload>
        <el-dialog v-model="dialogVisible" class="u-preview-dialog" width="min(92vw, 760px)">
            <img v-if="!dialogMediaIsVideo" class="u-preview-image" :src="dialogMediaUrl" alt />
            <video v-else class="u-preview-video" :src="dialogMediaUrl" controls playsinline></video>
        </el-dialog>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
import { getTokenFromUrl } from "@jx3box/jx3box-common/js/utils";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "m4v"];

export default {
    name: "CommentUploader",
    mixins: [i18nMixin],
    props: {
        supportVideo: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dialogMediaUrl: "",
            dialogMediaIsVideo: false,
            dialogVisible: false,
            fileList: [],
            successList: [],
            uploadedMap: {},

            maxCount: 5,
            imageMaxSize: 2 * 1024 * 1024,
            videoMaxSize: 30 * 1024 * 1024,
        };
    },
    emits: ["onFinish", "onError"],
    computed: {
        acceptedExtensions() {
            return this.supportVideo ? [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS] : [...IMAGE_EXTENSIONS];
        },
        acceptedLabels() {
            return this.acceptedExtensions;
        },
        tipText() {
            if (this.supportVideo) {
                return this.$jx3boxT(
                    "jx3boxUi.commentUpload.tipWithVideo",
                    "最多上传 {count} 个附件，支持 {types}，图片不超过 {imageSize} MB，视频不超过 {videoSize} MB",
                    {
                        count: this.maxCount,
                        types: this.acceptedLabels.join(" / ").toUpperCase(),
                        imageSize: this.imageMaxSize / 1024 / 1024,
                        videoSize: this.videoMaxSize / 1024 / 1024,
                    }
                );
            }

            return this.$jx3boxT("jx3boxUi.commentUpload.tip", "最多上传 {count} 张 {types} 格式图片，单张图片不能超过 {size} MB", {
                count: this.maxCount,
                types: this.acceptedLabels.join(" / ").toUpperCase(),
                size: this.imageMaxSize / 1024 / 1024,
            });
        },
        uploadHeaders() {
            const token = this.readAuthToken();
            if (!token) return {};
            return {
                Authorization: `Basic ${btoa(`${token}:cms common request`)}`,
            };
        },
    },
    methods: {
        readAuthToken() {
            const tokenFromUrl = getTokenFromUrl();
            if (tokenFromUrl) return tokenFromUrl;
            if (typeof localStorage === "undefined") return "";
            return localStorage.getItem("__token") || localStorage.getItem("token") || "";
        },
        handlePictureCardPreview(file) {
            const source = this.showFilePreview(file);
            this.dialogMediaUrl = source;
            this.dialogMediaIsVideo = this.isVideoFile(file);
            this.dialogVisible = true;
        },
        handleFileRemove(file) {
            if (this.$refs.upload?.handleRemove) {
                this.$refs.upload.handleRemove(file);
            } else {
                this.removeFile(file.uid);
            }
        },
        onExceed() {
            this.$notify({
                title: "",
                message: this.supportVideo
                    ? this.$jx3boxT("jx3boxUi.commentUpload.exceedWithVideo", "最多上传 {count} 个附件！", {
                          count: this.maxCount,
                      })
                    : this.$jx3boxT("jx3boxUi.commentUpload.exceed", "最多上传 {count} 张图片！", {
                          count: this.maxCount,
                      }),
                type: "error",
                duration: 3000,
                position: "bottom-right",
            });
        },
        onChange(file, fileList) {
            this.fileList = fileList;
            if (file.status !== "ready" || !file.raw) return;

            const ext = (file.name.split(".").pop() || "").toLowerCase();
            if (!this.acceptedExtensions.includes(ext)) {
                this.$notify({
                    title: "",
                    message: this.supportVideo
                        ? this.$jx3boxT("jx3boxUi.commentUpload.onlyTypesWithVideo", "仅支持 {types} 格式的图片和视频！", {
                              types: this.acceptedLabels.join(" / ").toUpperCase(),
                          })
                        : this.$jx3boxT("jx3boxUi.commentUpload.onlyTypes", "仅支持 {types} 格式图片！", {
                              types: this.acceptedLabels.join(" / ").toUpperCase(),
                          }),
                    type: "error",
                    duration: 3000,
                    position: "bottom-right",
                });
                this.removeFile(file.uid);
                return;
            }

            const isVideo = this.isVideoFile(file);
            const maxSize = isVideo ? this.videoMaxSize : this.imageMaxSize;
            if (file.size > maxSize) {
                this.$notify({
                    title: "",
                    message: isVideo
                        ? this.$jx3boxT("jx3boxUi.commentUpload.maxSizeVideo", "单个视频大小不能超过 {size} MB！", {
                              size: this.videoMaxSize / 1024 / 1024,
                          })
                        : this.$jx3boxT("jx3boxUi.commentUpload.maxSize", "单张图片大小不能超过 {size} MB！", {
                              size: this.imageMaxSize / 1024 / 1024,
                          }),
                    type: "error",
                    duration: 3000,
                    position: "bottom-right",
                });
                this.removeFile(file.uid);
                return;
            }

            if (!file.url && file.raw) {
                file.url = URL.createObjectURL(file.raw);
            }
        },
        onRemove(file, fileList) {
            this.fileList = fileList;
            if (file?.uid && this.uploadedMap[file.uid]) delete this.uploadedMap[file.uid];
            this.successList = this.fileList.map((f) => this.uploadedMap[f.uid]).filter(Boolean);
        },
        upload() {
            if (this.fileList.length > 0) {
                this.$refs.upload.submit();
            } else {
                this.$emit("onFinish", []);
            }
        },
        onSuccess(response, file, fileList) {
            this.fileList = fileList;
            const url = response?.data?.[0];
            if (url && file?.uid) {
                this.uploadedMap[file.uid] = url;
                file.url = url;
            }
            this.successList = this.fileList.map((f) => this.uploadedMap[f.uid]).filter(Boolean);
            if (this.successList.length == this.fileList.length) {
                this.$emit("onFinish", this.successList || []);
                this.fileList = [];
                this.successList = [];
                this.uploadedMap = {};
            }
        },
        onError() {
            this.$notify({
                title: "",
                message: this.supportVideo
                    ? this.$jx3boxT("jx3boxUi.commentUpload.uploadFailedWithVideo", "附件上传失败!")
                    : this.$jx3boxT("jx3boxUi.commentUpload.uploadFailed", "图片上传失败!"),
                type: "error",
                duration: 3000,
                position: "bottom-right",
            });
            this.$emit("onError");
            this.fileList = [];
        },
        addFile(file) {
            if (this.$refs.upload && this.$refs.upload.handleStart) {
                this.$refs.upload.handleStart(file);
            }
        },
        isVideoFile(file) {
            const ext = (file?.name || file?.url || "").split(".").pop()?.toLowerCase() || "";
            return VIDEO_EXTENSIONS.includes(ext);
        },
        showFilePreview(file) {
            return file?.url || (file?.raw ? URL.createObjectURL(file.raw) : "");
        },
        removeFile(uid) {
            this.fileList = this.fileList.filter((item) => item.uid !== uid);
            if (uid && this.uploadedMap[uid]) delete this.uploadedMap[uid];
            this.successList = this.fileList.map((f) => this.uploadedMap[f.uid]).filter(Boolean);
        },
    },
};
</script>

<style lang="less">
.c-comment-upload {
    .u-file-card {
        width: 100%;
        height: 100%;
    }

    .u-file-video {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        background: #f5f7fa;
    }

}

.u-preview-dialog {
    margin-top: 5vh;

    .el-dialog__body {
        max-height: calc(100vh - 120px);
        padding: 12px;
        overflow: hidden;
        text-align: center;
    }
}

.u-preview-image,
.u-preview-video {
    max-width: 100%;
    max-height: calc(100vh - 160px);
    display: block;
    margin: 0 auto;
    object-fit: contain;
}

.u-preview-video {
    width: auto;
    background: #000;
}
</style>
