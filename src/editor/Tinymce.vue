<template>
    <div class="c-editor-tinymce">
        <slot name="prepend"></slot>

        <div class="c-editor-header">
            <Upload v-if="attachmentEnable" @insert="insertAttachments" />
            <Resource v-if="resourceEnable" @insert="insertResource" />
            <BoxResource v-if="resourceEnable" @insert="insertResource" />
        </div>
        <Emotion class="c-editor-emotion" @selected="emotionSelected"></Emotion>

        <slot></slot>

        <editor
            id="tinymce"
            v-model="data"
            :init="init"
            class="c-tinymce"
            placeholder="✔ 图片可右键粘贴或拖拽至编辑器内自动上传 ✔ 支持word/excel内容一键粘贴"
        />
        <el-alert class="u-tutorial" type="warning" show-icon
            >进入特殊区域（代码块，折叠块等等）脱离或使用工具栏触发后，请使用键盘方向 → ↓
            键进行脱离，回车只是正常在区块内换行。去掉样式点击第二行第一个&lt;清除格式&gt;即可复位。
            <!-- <a href="" target="_blank">[编辑器使用指南]</a> -->
        </el-alert>

        <slot name="append"></slot>
    </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import Upload from "./Upload.vue";
import Resource from "./Resource.vue";
import BoxResource from "./BoxResource.vue";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import Emotion from "@jx3box/jx3box-emotion/src/Emotion2.vue";
import hljs_languages from "../../assets/js/item/hljs_languages.js";
const { __cms, __imgPath } = JX3BOX;
const proxyEnabled = ["1", "true", "yes", "on"].includes(String(process.env.VUE_APP_PROXY_ENABLE || "").toLowerCase());
const proxyPrefix = process.env.VUE_APP_PROXY_PREFIX || "/__proxy";
const API_Root = process.env.NODE_ENV === "production" ? __cms : proxyEnabled ? `${proxyPrefix}/cms/` : "/";
const API = API_Root.replace(/\/+$/, "/") + "api/cms/upload/tinymce";

export default {
    name: "TinyMce",
    props: ["modelValue", "height", "attachmentEnable", "resourceEnable"],
    emits: ["update:modelValue"],
    data: function () {
        return {
            data: "",
            init: {
                // 选择器
                selector: "#tinymce",

                // 语言
                language: "zh_CN",

                // 设置
                convert_urls: false,

                // 样式
                // TODO:
                content_css: `https://oss.jx3box.com/static/tinymce/skins/content/default/content.min.css`,
                // content_css: `http://localhost:5000/skins/content/default/content.min.css`,
                body_class: "c-article c-article-editor c-article-tinymce",
                height: this.height || 800,
                autosave_ask_before_unload: false,

                // UI
                icons: "custom",
                menubar: false,
                branding: false,
                contextmenu: "",
                plugins: [
                    "link autolink",
                    "hr lists advlist table codeinline codesample checklist foldtext latex",
                    "image emoticons media",
                    "code fullscreen wordcount powerpaste pagebreak printpage", // template anchor jx3icon autosave
                ],
                toolbar: [
                    "undo | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough superscript subscript | link unlink | fullscreen code", //restoredraft
                    "removeformat | hr alignleft aligncenter alignright alignjustify indent outdent | bullist numlist checklist table blockquote foldtext codeinline codesample latex | emoticons image media | pagebreak printpage", // template anchor jx3icon
                ],
                mobile: {
                    toolbar_drawer: true,
                    toolbar: [
                        "undo emoticons bold forecolor backcolor removeformat pagebreak fullscreen",
                        "hr alignleft aligncenter alignright alignjustify indent outdent bullist numlist checklist table blockquote codesample latex media",
                    ],
                },
                block_formats: "段落=p;一级标题=h1;二级标题=h2;三级标题=h3;四级标题=h4;五级标题=h5;六级标题=h6;",
                fontsize_formats: "12px 14px 16px 18px 22px 24px 26px 28px 32px 48px 72px",
                color_map: [
                    "FF99CC",
                    "浅粉",
                    "FF3399",
                    "深粉",
                    "FF0000",
                    "正红",
                    "CC99FF",
                    "紫色",
                    "9933ff",
                    "深紫",

                    "FFFF99",
                    "浅黄",
                    "FFFF00",
                    "金黄",
                    "FFCC00",
                    "亮黄",
                    "FFCC99",
                    "浅桃",
                    "FF6600",
                    "橘色",

                    "CCFFCC",
                    "浅绿",
                    "9bf915",
                    "荧光绿",
                    "00FF00",
                    "辣眼绿",
                    "49c10f",
                    "深绿",
                    "008080",
                    "深青",

                    "CCFFFF",
                    "浅蓝",
                    "00FFFF",
                    "参考线",
                    "00CCFF",
                    "天蓝",
                    "99CCFF",
                    "蔚蓝",
                    "0000FF",
                    "辣眼蓝",

                    "CC0000",
                    "深红",
                    "000000",
                    "黑色",
                ],

                codesample_languages: hljs_languages,

                // Image
                image_advtab: true,
                file_picker_types: "file image",
                images_upload_url: API,
                automatic_uploads: true,
                images_upload_credentials: true,
                valid_children: "+body[style]",
            },
            mode: "tinymce",
        };
    },
    watch: {
        data: function (val) {
            this.$emit("update:modelValue", val);
        },
        modelValue: {
            immediate: true,
            handler: function (val) {
                this.data = val;
            },
        },
    },
    methods: {
        setup: function (editor) {
            console.log("ID为: " + editor.id + " 的编辑器即将初始化.");
        },
        ready: function (editor) {
            console.log("ID为: " + editor.id + " 的编辑器已初始化完成.");
        },
        insertAttachments: function (data) {
            tinyMCE.editors["tinymce"].insertContent(data.html);
        },
        insertResource: function (data) {
            tinyMCE.editors["tinymce"].insertContent(data);
        },
        emotionSelected: function (emotion) {
            let src = emotion.filename;
            if (!emotion.filename.startsWith("http")) {
                src = `${__imgPath}emotion/output/${emotion.filename}`;
            }
            const IMAGE = `<img class="t-emotion" src="${src}" alt="${src}" style="max-width:60px; max-height: 60px"/>`;
            tinyMCE.editors["tinymce"].insertContent(IMAGE);
        },
    },
    mounted: function () {},
    components: {
        Editor,
        Upload,
        Emotion,
        Resource,
        BoxResource,
    },
};
</script>

<style lang="less">
@import "../../assets/css/tinymce/_.less";
</style>
