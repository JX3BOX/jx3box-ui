<template>
    <div class="c-article-tinymce c-article-box">
        <!-- <div id="c-article-origin" class="c-article-origin" ref="origin"><slot></slot></div> -->
        <div id="c-article" class="c-article" ref="article" v-if="pageable">
            <div
                class="c-article-chunk"
                v-for="(text, i) in data"
                :key="i"
                v-html="text"
                :class="{ on: i == page - 1 || all == true }"
                :id="'c-article-part' + ~~(i + 1)"
            ></div>
        </div>
        <div id="c-article" class="c-article" ref="article" v-else-if="data && data.length" v-html="data[0]"></div>
        <el-button class="c-article-all" type="primary" v-if="!all && hasPages" @click="showAll">加载全部</el-button>
        <el-pagination
            class="c-article-pages"
            v-if="!all"
            background
            center
            :page-size="1"
            :hide-on-single-page="true"
            @current-change="changePage"
            :current-page="page"
            layout="total, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>

        <div class="w-jx3-element-pop" :style="jx3_element.style">
            <jx3-item :item_id="item.id" :jx3ClientType="item.client" v-show="jx3_element.type == 'item'" />
            <jx3-buff :client="buff.client" :id="buff.id" :level="buff.level" v-show="jx3_element.type == 'buff'" />
            <jx3-skill :client="skill.client" :id="skill.id" :level="skill.level" v-show="jx3_element.type == 'skill'" />
            <jx3-npc :client="npc.client" :id="npc.id" v-show="jx3_element.type === 'npc'" />
            <jx3-author :uid="author.id" v-show="jx3_element.type === 'author'" />
            <jx3-emotion-author :id="emotion.id" v-show="jx3_element.type === 'emotion'" />
        </div>
    </div>
</template>

<script>
import { ElPagination, ElButton } from "element-plus";
import "element-plus/dist/index.css";

// XSS
import execFilterXSS from "../../assets/js/script";
const xss_options = {
    allowCommentTag: true,
};

// 基本文本
import execLazyload from "../../assets/js/img";
import execFilterIframe from "../../assets/js/iframe";
import execFilterLink from "../../assets/js/a";
import execSplitPages from "../../assets/js/nextpage";

// 扩展文本
import renderFoldBlock from "../../assets/js/fold";
import renderDirectory from "../../assets/js/directory";
import {renderKatexAll} from "../../assets/js/katex";
import renderCode from "../../assets/js/code";
import renderImgPreview from "../../assets/js/renderImgPreview";
import renderMacro from "../../assets/js/macro";
import renderTalent from "../../assets/js/qixue";
import renderTalent2 from "../../assets/js/talent2";
import renderPzIframe from "../../assets/js/pz_iframe";
import renderCombo from "../../assets/js/combo";
import renderJx3Element from "../../assets/js/jx3_element";

// 剑三
import Item from "./components/Item.vue";
import Buff from "./components/Buff.vue";
import Skill from "./components/Skill.vue";
import Npc from "./components/Npc.vue";
import Author from "./components/Author.vue";
import PostAuthor from "./components/PostAuthor.vue";

export default {
    name: "ArticleRender",
    props: {
        content: String,
        directorybox: String,
        pageable: {
            type: Boolean,
            default: true,
        },
    },
    data: function () {
        return {
            // 作品
            all: false,
            page: 1,
            data: [],
            mode: "",
            jx3_element: {
                style: {},
                type: "",
            },
            item: {},
            buff: {},
            skill: {},
            npc: {},
            author: {},
            emotion: {},
        };
    },
    computed: {
        total: function () {
            return this.chunks.length;
        },
        hasPages: function () {
            return this.chunks.length > 1;
        },
        origin: function () {
            return this.content;
        },
        chunks: function () {
            return this.pageable ? execSplitPages(this.origin) : [this.origin];
        },
    },
    methods: {
        doReg: function (data) {
            if (data) {
                // 过滤内容
                data = execLazyload(data);
                data = execFilterIframe(data);
                data = execFilterXSS(data, xss_options);
                data = execFilterLink(data);
                return data;
            } else {
                return "";
            }
        },
        doDOM: function ($root) {
            // 折叠块
            renderFoldBlock($root);
            // 代码
            renderCode(`code[class=^'language-']`);
            // Tatex
            renderKatexAll();

            // 画廊（需要在宏、奇穴、物品等之前渲染以排除下方自动生成图片）
            renderImgPreview();
            // 宏
            renderMacro();
            // 奇穴
            renderTalent();
            renderTalent2();
            // 物品
            renderJx3Element(this);
            // 配装
            renderPzIframe();
            // 连招
            renderCombo();
        },
        doDir: function () {
            // 显示局部
            let target = "";
            if (this.hasPages && !this.all) {
                target = "#c-article-part" + this.page;
                // 全部
            } else {
                target = "#c-article";
            }
            let dir = renderDirectory(target, this.directorybox);
            this.$emit("directoryRendered", dir);
        },
        changePage: function (i) {
            this.page = i;
            window.scrollTo(0, 0);
            this.$nextTick(() => {
                this.doDir();
            });
        },
        showAll: function () {
            this.all = true;
            this.$nextTick(() => {
                this.doDir();
            });
        },
        render: function () {
            let result = [];
            for (let chunk of this.chunks) {
                let _chunk = this.doReg(chunk);
                result.push(_chunk);
            }
            this.data = result;
        },
        run: function () {
            this.render();

            // 等待html加载完毕后
            this.$nextTick(() => {
                this.$emit("contentLoaded");

                // 统一DOM处理
                const $root = this.$refs.article;
                this.doDOM($root);
                this.$emit("contentRendered");

                // 目录处理
                this.doDir();
            });
        },
    },
    watch: {
        content: function () {
            this.run();
        },
    },
    mounted: function () {
        const params = new URLSearchParams(location.search);
        this.mode = params.get("mode") || "";
        this.run();
    },
    components: {
        "el-pagination": ElPagination,
        "el-button": ElButton,
        "jx3-item": Item,
        "jx3-buff": Buff,
        "jx3-skill": Skill,
        "jx3-npc": Npc,
        "jx3-author": Author,
        "jx3-emotion-author": PostAuthor,
    },
};
</script>

<style lang="less">
@import "../../assets/css/editor/article.less";
</style>
