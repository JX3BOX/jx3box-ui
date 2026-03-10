<template>
    <div>
        <el-upload
            action="https://cms.jx3box.com/api/cms/upload"
            ref="upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
            :file-list="fileList"
            :limit="maxCount"
            :accept="acceptedExtensions.reduce((acc, cur) => acc + `.${cur},`, '')"
            multiple
            with-credentials
            :on-exceed="onExceed"
            :on-change="onChange"
            :on-success="onSuccess"
            :on-error="onError"
        >
            <el-icon><Plus></Plus></el-icon>
            <template #tip>
                <div class="el-upload__tip">
                    {{
                        $jx3boxT(
                            "jx3boxUi.commentUpload.tip",
                            "最多上传 {count} 张 {types} 格式图片，单张图片不能超过 {size} MB",
                            {
                                count: maxCount,
                                types: acceptedExtensions.join(" / ").toUpperCase(),
                                size: maxSize / 1024 / 1024,
                            }
                        )
                    }}
                </div>
            </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
            <img width="60%" :src="dialogImageUrl" alt />
        </el-dialog>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "CommentUploader",
    mixins: [i18nMixin],
    data() {
        return {
            dialogImageUrl: "",
            dialogVisible: false,
            fileList: [],
            successList: [],

            acceptedExtensions: ["jpg", "jpeg", "png", "gif"],
            maxCount: 5,
            maxSize: 2 * 1024 * 1024,
        };
    },
    emits: ["onFinish", "onError"],
    methods: {
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        onExceed() {
            this.$notify({
                title: "",
                message: this.$jx3boxT("jx3boxUi.commentUpload.exceed", "最多上传 {count} 张图片！", {
                    count: this.maxCount,
                }),
                type: "error",
                duration: 3000,
                position: "bottom-right",
            });
        },
        onChange(file, fileList) {
            if (file.status == "ready") {
                if (file.size > this.maxSize) {
                    this.$notify({
                        title: "",
                        message: this.$jx3boxT(
                            "jx3boxUi.commentUpload.maxSize",
                            "单张图片大小不能超过 {size} MB！",
                            {
                                size: this.maxSize / 1024 / 1024,
                            }
                        ),
                        type: "error",
                        duration: 3000,
                        position: "bottom-right",
                    });
                    fileList.pop();
                } else {
                    this.fileList = fileList;
                }
            }
        },
        upload() {
            if (this.fileList.length > 0) {
                this.$refs.upload.submit();
            } else {
                this.$emit("onFinish", []);
            }
        },
        onSuccess(response) {
            this.successList = this.successList.concat(response.data);
            if (this.successList.length == this.fileList.length) {
                this.$emit("onFinish", this.successList || []);
                this.fileList = [];
                this.successList = [];
            }
        },
        onError() {
            this.$notify({
                title: "",
                message: this.$jx3boxT("jx3boxUi.commentUpload.uploadFailed", "图片上传失败!"),
                type: "error",
                duration: 3000,
                position: "bottom-right",
            });
            this.$emit("onError");
            this.fileList = [];
        },
    },
};
</script>
