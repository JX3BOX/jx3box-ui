<template>
    <div class="c-resource c-resource__jx3box">
        <!-- 上传触发按钮 -->
        <el-button class="u-switch" type="primary" @click="openDialog" :disabled="!enable">
            <img class="u-icon" svg-inline :src="boxIcon" />魔盒资源
        </el-button>

        <!-- 弹出界面 -->
        <el-dialog class="c-large-dialog" title="魔盒资源库" v-model="dialogVisible">
            <div class="c-resource-content" v-loading="loading">
                <div class="m-database-search">
                    <el-radio-group class="u-client" v-model="comboClient" @change="search" v-if="type === 'combo'">
                        <el-radio-button label="std">剑三</el-radio-button>
                        <el-radio-button label="origin">缘起</el-radio-button>
                    </el-radio-group>
                    <el-input
                        class="u-input"
                        :placeholder="placeholderText"
                        v-model="query"
                        @change="search"
                        @keyup.enter="search"
                    >
                        <template #prepend>关键词</template>
                        <template #append>
                            <el-switch v-model="strict" active-text="精确匹配"></el-switch>
                        </template>
                    </el-input>
                </div>

                <el-tabs class="m-database-tabs" v-model="type" type="card" @tab-change="changeType">
                    <el-tab-pane label="魔盒用户" name="authors">
                        <template #label>
                            <span class="u-tab-label">
                                <el-icon style="margin-right: 5px"><Avatar></Avatar> </el-icon>
                                <b>用户</b>
                                <i class="u-lv-box">Lv2+</i>
                            </span>
                        </template>
                        <p v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ total }}</b> 条记录
                        </p>
                        <ul class="m-resource-list">
                            <li
                                v-for="(o, i) in authors"
                                class="u-item"
                                :key="i"
                                :class="{ on: !!o.isSelected }"
                                @click="selectAuthor(o, i)"
                                ref="author"
                            >
                                <span class="u-id">ID:{{ o.ID }}</span>
                                <img
                                    class="u-pic"
                                    :title="'AuthorID:' + o.display_name"
                                    :src="userAvatar(o.user_avatar)"
                                />
                                <span class="u-primary">
                                    <span class="u-name">
                                        {{ o.display_name }}
                                    </span>
                                    <div class="u-remark">
                                        {{ o.user_bio }}
                                    </div>
                                </span>
                            </li>
                        </ul>
                        <el-alert
                            v-if="!authors.length && done"
                            title="没有找到相关条目"
                            type="info"
                            show-icon
                        ></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="剑三趣图" name="emotions">
                        <template #label>
                            <span class="u-tab-label">
                                <el-icon style="margin-right: 5px"><Sugar /></el-icon>
                                <b>趣图</b>
                            </span>
                        </template>

                        <p v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ total }}</b> 条记录
                        </p>
                        <ul class="m-resource-emotion">
                            <li
                                v-for="o in emotions"
                                class="u-item"
                                :key="o.id"
                                :class="{ on: !!o.isSelected }"
                                @click="selectEmotion(o)"
                                ref="emotion"
                            >
                                <img class="e-jx3-emotion" :src="resolveImagePath(o.url)" :alt="query" />
                            </li>
                        </ul>
                        <el-alert
                            v-if="!emotions.length && done"
                            title="没有找到相关条目"
                            type="info"
                            show-icon
                        ></el-alert>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="连招" name="combo">
                        <template #label>
                            <span class="u-tab-label">
                                <el-icon style="margin-right: 5px"><Lollipop /></el-icon>
                                <b>连招</b>
                            </span>
                        </template>
                        <ComboVue :query="query" ref="combo" :client="comboClient" :strict="strict"></ComboVue>
                    </el-tab-pane> -->
                </el-tabs>

                <template v-if="multipage && type !== 'combo'">
                    <!-- 下一页 -->
                    <el-button
                        class="m-archive-more"
                        :class="{ show: hasNextPage }"
                        type="primary"
                        icon="ArrowDown"
                        @click="appendPage"
                        >加载更多</el-button
                    >
                    <!-- 分页 -->
                    <el-pagination
                        class="m-archive-pages"
                        background
                        layout="total, prev, pager, next,jumper"
                        :hide-on-single-page="true"
                        :page-size="per"
                        :total="total"
                        v-model:current-page="page"
                        @current-change="changePage"
                    ></el-pagination>
                </template>

                <div class="m-database-tip" v-show="isBlank && type !== 'combo'">❤ 请输入搜索条件查询</div>
            </div>

            <!-- 插入按钮 -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="insert">
                        {{ buttonTXT }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { loadStat } from "../../service/database";
import { loadAuthors, loadEmotions } from "../../service/cms";
import { getUserInfo } from "../../service/author";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getLink, showAvatar, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
const { __Root, __OriginRoot, __imgPath } = JX3BOX;

// import ComboVue from "./components/Combo.vue";
export default {
    name: "BoxResource",
    components: {
        // ComboVue,
    },
    props: {
        enable: {
            type: Boolean,
            default: true,
        },
    },
    data: function () {
        return {
            dialogVisible: false,
            actived: false,
            userInfo: {},

            type: "authors",
            query: "",
            strict: false,
            client: location.hostname.includes("origin") ? "origin" : "std",
            comboClient: "std",

            skill: [],
            buff: [],
            item: [],
            icon: [],
            npc: [],
            authors: [],
            selectedAuthor: {},
            emotions: [],

            done: false,
            loading: false,

            isSuper: false,

            html: "",

            per: 10,
            page: 1,
            total: 1,
            pages: 1,

            placeholderTexts: {
                authors: "请输入 ID 或 名称",
            },
        };
    },
    computed: {
        placeholderText: function () {
            return this.placeholderTexts[this.type];
        },
        buttonTXT: function () {
            return this.selectedCount ? "插 入" : "确 定";
        },
        isBlank: function () {
            return !this.query && !this[this.type]?.["length"];
        },
        selectedCount: function () {
            return !!this.html;
        },
        isNumber: function () {
            return !isNaN(this.query);
        },
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
        multipage: function () {
            return this.type !== "icon" && this.done && this.pages > 1;
        },
        iconDir: function () {
            return this.client === "origin" ? "origin_icon" : "icon";
        },
        userStatus: function () {
            return User.getInfo().status;
        },
        uid: function () {
            return User.getInfo().uid;
        },
        canInsertAuthor: function () {
            return User.getLevel(this.userInfo && this.userInfo.experience) >= 2;
        },
        boxIcon: function () {
            return __imgPath + "image/common/jx3box_white.svg";
        },
    },
    watch: {
        html: function (newval) {
            this.$emit("update", newval);
        },
    },
    methods: {
        getData: function (page = 1, append = false) {
            this.loading = true;
            this.per = 10;
            this.done = false;
            let query = this.query;
            let params = {
                strict: ~~this.strict,
                per: this.per,
                page: page,
                client: this.client,
            };

            // 图标
            if (this.type === "authors") {
                if (!this.query) {
                    this.loading = false;
                    return;
                }

                params = {
                    ...params,
                    name: query,
                };
                loadAuthors(params)
                    .then((res) => {
                        if (!append) this.authors = [];
                        let list = this.transformData(res.data.data.list);
                        this.authors = this.authors.concat(list);
                        this.pages = res.data.data.pages;
                        this.total = res.data.data.total;
                    })
                    .finally(() => {
                        this.done = true;
                        this.loading = false;
                    });
            } else if (this.type === "emotions") {
                this.per = 24;
                params = {
                    per: this.per,
                    page: page,
                    search: query,
                };
                loadEmotions(params)
                    .then((res) => {
                        if (!append) this.emotions = [];
                        let list = this.transformData(res.data.data.list);
                        this.emotions = this.emotions.concat(list);
                        this.pages = res.data.data.pages;
                        this.total = res.data.data.total;
                    })
                    .finally(() => {
                        this.done = true;
                        this.loading = false;
                    });
            }
        },
        search: function () {
            if (this.type === "combo") {
                this.$refs.combo?.search();
            } else {
                this.page = 1;
                this.getData();
            }
        },
        appendPage: function () {
            this.getData(++this.page, true);
        },
        changePage: function (i) {
            this.getData(i);
        },
        changeType: function () {
            this.page = 1;
            if (this.type === "combo") {
                this.done = false;
                return;
            }
            this.getData();
        },
        setAuthors: function () {
            try {
                let author = sessionStorage.getItem("atAuthor");
                if (author) {
                    author = JSON.parse(author);
                    author = author.split(",") || [];
                    if (this.selectedAuthor.ID && !author.includes(String(this.selectedAuthor.ID))) {
                        author.push(this.selectedAuthor.ID);
                    }
                    sessionStorage.setItem("atAuthor", JSON.stringify(author.join(",")));
                } else {
                    sessionStorage.setItem("atAuthor", JSON.stringify(String(this.selectedAuthor.ID)));
                }
            } catch (error) {
                console.log(error);
            }
        },
        insert: function () {
            if (this.type === "authors") {
                if (this.userStatus == 0 && this.canInsertAuthor) {
                    if (this.selectedAuthor.ID) {
                        this.setAuthors();
                        this.$emit("insert", this.html);
                        this.dialogVisible = false;
                        this.selectedAuthor = {};
                    } else {
                        this.$message.warning("请选择一个用户");
                    }
                } else {
                    this.$alert("您的等级不足或无权限（Lv2以上可用）", "消息");
                }
            } else {
                if (this.type === "combo") {
                    const html = this.$refs.combo.renderVal();
                    this.$emit("insert", html);
                } else {
                    this.$emit("insert", this.html);
                }
                this.dialogVisible = false;
            }
        },
        transformData: function (data) {
            data.forEach((item) => {
                item.isSelected = false;
            });
            return data;
        },
        selectAuthor: function (o) {
            this.resetItems();
            this.selectedAuthor = o;
            o.isSelected = true;
            this.html = `<a data-type="author" class="e-jx3-author w-jx3-element" data-mode="" data-id="${o.ID}" target="_blank" href="/author/${o.ID}">@${o.display_name}</a>`;
        },
        selectEmotion: function (o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<a data-type="emotion" class="e-jx3-emotion w-jx3-element" data-id="${o.id}" target="_blank" href="/emotion/${o.id}"><img class="e-jx3-emotion-img" data-type="emotion" data-id="${o.id}" style="width:180px;" src="${o.url}" alt="${o.id}"/></a>`;
        },
        resetItems: function () {
            let data = this[this.type];
            data.forEach((item) => {
                item.isSelected = false;
            });
            this.html = "";
        },
        getLink: function (type, id) {
            let domain = this.client == "origin" ? __OriginRoot : __Root;
            return domain + getLink(type, id).slice(1);
        },
        userAvatar: function (url) {
            return showAvatar(url, "m");
        },
        loadUserInfo: function () {
            if (!this.uid) return;
            getUserInfo(this.uid).then((res) => {
                this.userInfo = res;
            });
        },

        // 杂项
        // ==============================
        openDialog: function () {
            this.dialogVisible = true;
            if (!this.actived) {
                loadStat().then((data) => {
                    this.stat = data;
                    this.actived = true;
                });
            }
        },
        resolveImagePath,
    },
    created: function () {
        this.loadUserInfo();
    },
};
</script>

<style lang="less">
@import "../../assets/css/editor/resource.less";

.m-item-pop {
    padding: 0 !important;
    background: none !important;
    border: none;
}
</style>
