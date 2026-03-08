<template>
    <div class="c-upload">
        <!-- 上传触发按钮 -->
        <el-button type="primary" @click="dialogVisible = true" :disabled="!enable">
            <el-icon class="u-icon"><UploadFilled /></el-icon>
            {{ btn_txt }}
        </el-button>

        <!-- 弹出界面 -->
        <el-dialog class="c-large-dialog" title="上传" v-model="dialogVisible" @close="closeUpload">
            <!-- 清空按钮 -->
            <el-button class="u-upload-clear" plain size="small" @click="clear"
                ><el-icon><Delete /></el-icon>清空</el-button
            >

            <!-- 限制提示 -->
            <el-alert class="u-upload-tip" :title="tip" type="info" show-icon :closable="false"></el-alert>

            <!-- 文件区 -->
            <el-upload
                :action="API"
                list-type="picture-card"
                :auto-upload="false"
                :limit="10"
                multiple
                with-credentials
                :file-list="fileList"
                :on-change="change"
                ref="uploadBox"
                :accept="accept"
                :key="timeStamp + fileList.length"
            >
                <template #default>
                    <el-icon><Plus /></el-icon>
                </template>

                <!-- 文件项 -->
                <template #file="{ file }">
                    <div
                        class="u-file-wrapper"
                        @click="select(file)"
                        :class="{
                            isSelected: file.selected,
                            disabled: file.status != 'success',
                        }"
                    >
                        <span style="display: none">{{ fileList }}</span>
                        <!-- 图片类型 -->
                        <img v-if="file.is_img" class="el-upload-list__item-thumbnail u-imgbox" :src="file.url" alt />
                        <!-- 其他类型 -->
                        <div v-else class="u-filebox">
                            <img class="u-fileplaceholder" svg-inline src="../../assets/img/editor/file.svg" />
                            <span class="u-filename">{{ file.name }}</span>
                        </div>
                        <!-- 勾选角标 -->
                        <label v-show="file.selected" class="u-file-select-label">
                            <el-icon class="el-icon-upload-success el-icon-check" color="#fff"><Check /></el-icon>
                        </label>
                    </div>
                </template>
            </el-upload>

            <!-- 插入按钮 -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeUpload">取 消</el-button>
                    <el-button type="primary" @click="insert">
                        {{ buttonTXT }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import { cloneDeep } from "lodash";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __cms } = JX3BOX;
const API_Root = process.env.NODE_ENV === "production" ? __cms : "/";
const API = API_Root + "api/cms/upload";
const imgtypes = ["jpg", "png", "gif", "bmp", "webp", "jpeg", "JPG", "PNG", "GIF", "BMP", "WEBP", "JPEG"];

export default {
    name: "EditorUpload",
    props: {
        text: {
            type: String,
        },
        onlyImage: {
            type: Boolean,
        },
        desc: {
            type: String,
        },
        accept: {
            type: String,
        },
        enable: {
            type: Boolean,
            default: true,
        },
        max: {
            type: Number,
            default: 10,
        },
        // 文件大小限制
        sizeLimit: {
            type: Number,
            default: 30,
        },
    },
    data: function () {
        return {
            API: API,
            dialogVisible: false,
            tip:
                this.desc ||
                `一次最多同时上传${this.max}个文件（单个文件不超过${this.sizeLimit}M），格式限常见的图片、文档、数据表及压缩包`,
            btn_txt: this.text || "上传附件",

            fileList: [],
            selectedCount: 0,
            insertList: "",
            timeStamp: null,

            // accept: allow_types.accept,
            // sizeLimit: allow_types.sizeLimit,
        };
    },
    watch: {
        fileList: {
            deep: true,
            handler: function (newVal) {
                this.timeStamp = new Date().getTime() + Math.random();
                this.$emit("update", newVal);
            },
        },
        insertList: function (newVal) {
            this.$emit("htmlUpdate", newVal);
        },
    },
    computed: {
        buttonTXT: function () {
            return this.selectedCount ? "插 入" : "确 定";
        },
    },
    methods: {
        change: function (file) {
            if (file.status != "success") {
                // 判断大小
                // if (file.size > this.sizeLimit) {
                //     this.$message.error("文件超出大小限制");
                //     this.removeFile(fileList, file.uid);
                //     return;
                // }

                // 分析文件类型
                let ext = file.name.split(".").pop();
                let is_img = imgtypes.includes(ext);

                if (this.onlyImage && !is_img) return;

                // 构建数据
                let fdata = new FormData();
                fdata.append("file", file.raw);

                // 异步上传
                axios
                    .post(API, fdata, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                        auth: {
                            username: (localStorage && localStorage.getItem("token")) || "",
                            password: "cms common request",
                        },
                    })
                    .then((res) => {
                        if (res.data.code) {
                            this.$message({
                                message: res.data.msg,
                                type: "error",
                            });
                            return;
                        }
                        // 提醒
                        this.$message({
                            message: "上传成功",
                            type: "success",
                        });

                        // 修改path
                        file.url = res.data.data && res.data.data[0];

                        // 额外赋值
                        file.is_img = is_img;
                        file.selected = true;

                        // 修改状态加入仓库
                        file.status = "success";
                        this.fileList.push(file);
                        this.selectedCount++;
                    })
                    .catch((err) => {
                        if (err.response.data.code) {
                            this.$message.error(`[${err.response.data.code}] ${err.response.data.message}`);
                        } else {
                            this.$message.error("请求异常");
                        }
                    });
            }
        },
        select: function (file) {
            this.fileList = this.fileList.map((item) => {
                if (item.uid == file.uid) {
                    item.selected = !item.selected;
                }
                return item;
            });
            if (file.status == "success") {
                file.selected ? this.selectedCount++ : this.selectedCount--;
            }
        },
        buildHTML: function () {
            const list = cloneDeep(this.fileList)
                .filter((item) => item.selected && item.status == "success")
                .map((file) => {
                    const html = file.is_img
                        ? ` <img src="${file.url}" />`
                        : `<a target="_blank" href="${file.url}">${file.name}</a>`;
                    return html;
                });
            this.insertList = list.join(" \n");
            return this.insertList;
        },
        insert: function () {
            // 关闭窗口
            this.closeUpload();

            //为空不执行插入
            if (!this.selectedCount) return;

            // 传递值
            this.$emit("insert", {
                list: this.fileList.filter((item) => item.selected && item.status == "success"),
                html: this.buildHTML(),
            });

            //移除所有上传图片
            this.clear();
        },

        clear: function () {
            this.$refs.uploadBox.clearFiles();
            this.fileList = [];
            this.selectedCount = 0;
        },
        closeUpload() {
            this.dialogVisible = false;
        },
        removeFile: function (fileList, uid) {
            fileList.forEach((file, i) => {
                if (file.uid == uid) {
                    fileList.splice(i, 1);
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/editor/upload.less";
</style>
