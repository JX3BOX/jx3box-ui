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
            :on-remove="onRemove"
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
            uploadedMap: {},

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
            this.fileList = fileList;
            if (file.status !== "ready" || !file.raw) return;

            const ext = (file.name.split(".").pop() || "").toLowerCase();
            if (!this.acceptedExtensions.includes(ext)) {
                this.$notify({
                    title: "",
                    message: this.$jx3boxT(
                        "jx3boxUi.commentUpload.onlyTypes",
                        "仅支持 {types} 格式图片！",
                        { types: this.acceptedExtensions.join(" / ").toUpperCase() }
                    ),
                    type: "error",
                    duration: 3000,
                    position: "bottom-right",
                });
                this.removeFile(file.uid);
                return;
            }

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
                this.removeFile(file.uid);
                return;
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
                message: this.$jx3boxT("jx3boxUi.commentUpload.uploadFailed", "图片上传失败!"),
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
        removeFile(uid) {
            this.fileList = this.fileList.filter((item) => item.uid !== uid);
            if (uid && this.uploadedMap[uid]) delete this.uploadedMap[uid];
            this.successList = this.fileList.map((f) => this.uploadedMap[f.uid]).filter(Boolean);
        },
    },
};
</script>
