<template>
    <div class="c-resource">
        <!-- 上传触发按钮 -->
        <el-button class="u-switch" type="primary" @click="openDialog" :disabled="!enable">
            <img class="u-icon u-jx3-icon" svg-inline src="../../assets/img/editor/jx3.svg" />剑三资源
        </el-button>

        <!-- 弹出界面 -->
        <el-dialog class="c-large-dialog" title="剑三数据库" v-model="dialogVisible">
            <div class="c-resource-content" v-loading="loading">
                <div class="m-database-search">
                    <el-radio-group class="u-client" v-model="client" @change="search">
                        <el-radio-button label="std">剑三</el-radio-button>
                        <el-radio-button label="origin">缘起</el-radio-button>
                    </el-radio-group>
                    <el-input
                        class="u-input"
                        placeholder="请输入 ID 或 名称"
                        v-model="query"
                        @change="search"
                        @keyup.enter="search"
                    >
                        <template #prepend>ID ／名称</template>
                        <template #append v-if="isPC">
                            <el-switch
                                v-model="strict"
                                active-text="精确匹配"
                                @change="search"
                                title="仅对Buff/Skill有效"
                            ></el-switch>
                        </template>
                    </el-input>
                </div>

                <el-tabs class="m-database-tabs" v-model="type" type="card" @tab-change="changeType">
                    <el-tab-pane label="Buff" name="buff">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="../../assets/img/editor/buff.svg" />
                                <b>Buff</b>
                                <em class="u-count">{{ stat.buff }}</em>
                            </span>
                        </template>

                        <div v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ total }}</b> 条记录
                            <div class="u-mode">
                                插入模式：
                                <el-radio-group v-model="buff_mode" size="small" @change="changeMode">
                                    <el-radio-button label="simple">简版</el-radio-button>
                                    <el-radio-button label="full">完整版</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <ul class="m-resource-list">
                            <li
                                v-for="(o, i) in buff"
                                class="u-item"
                                :key="i"
                                :class="{ on: !!o.isSelected }"
                                @click="selectBuff(o, i)"
                                ref="buff"
                            >
                                <span class="u-id">
                                    ID:{{ o.BuffID }}
                                    <span class="u-detach">{{ showDetachType(o.DetachType) }}</span>
                                </span>
                                <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                <span class="u-primary">
                                    <span class="u-name">
                                        {{ o.Name }}
                                        <em v-if="o.BuffName">({{ o.BuffName }})</em>
                                    </span>
                                    <span class="u-content">{{ o.Desc }}</span>
                                </span>
                            </li>
                        </ul>
                        <el-alert v-if="!buff.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="技能" name="skill">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="../../assets/img/editor/skill.svg" />
                                <b>技能</b>
                                <em class="u-count">{{ stat.skill }}</em>
                            </span>
                        </template>

                        <div v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ total }}</b> 条记录
                            <div class="u-mode">
                                插入模式：
                                <el-radio-group v-model="skill_mode" size="small" @change="changeMode">
                                    <el-radio-button label="simple">简版</el-radio-button>
                                    <el-radio-button label="full">完整版</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <ul class="m-resource-list">
                            <li
                                v-for="(o, i) in skill"
                                class="u-item"
                                :key="i"
                                :class="{ on: !!o.isSelected }"
                                @click="selectSkill(o, i)"
                                ref="skill"
                            >
                                <span class="u-id">ID:{{ o.SkillID }}</span>
                                <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                <span class="u-primary">
                                    <span class="u-name">
                                        {{ o.Name }}
                                        <em v-if="o.SkillName">({{ o.SkillName }})</em>
                                    </span>
                                    <span class="u-content">
                                        {{ filterRaw(o.Desc) }}
                                    </span>
                                </span>
                            </li>
                        </ul>
                        <el-alert
                            v-if="!skill.length && done"
                            title="没有找到相关条目"
                            type="info"
                            show-icon
                        ></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="物品" name="item">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="../../assets/img/editor/item.svg" />
                                <b>物品</b>
                                <em class="u-count">{{ stat.item }}</em>
                            </span>
                        </template>
                        <p v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ total }}</b> 条记录
                        </p>
                        <ul class="m-resource-list" v-if="item.length">
                            <el-popover
                                popper-class="m-item-pop"
                                :visible-arrow="false"
                                trigger="hover"
                                placement="left"
                                v-for="(o, i) in item"
                                :key="i"
                            >
                                <template #reference>
                                    <li
                                        class="u-item"
                                        :class="{ on: o.isSelected }"
                                        @click="selectItem(o, i)"
                                        ref="item"
                                    >
                                        <span class="u-id">ID:{{ o.id }}</span>
                                        <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                        <span class="u-name">{{ o.Name }}</span>
                                        <span class="u-content">
                                            <game-text :text="o.Desc"></game-text>
                                        </span>
                                        <span class="u-remark">
                                            {{ o.Requirement }}
                                        </span>
                                    </li>
                                </template>

                                <jx3-item :item_id="o.id" :client="client"></jx3-item>
                            </el-popover>
                        </ul>
                        <el-alert v-if="!item.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="Npc" name="npc">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="../../assets/img/npc/skull.svg" />
                                <b>Npc</b>
                                <em class="u-count">{{ stat.npc }}</em>
                            </span>
                        </template>
                        <p v-if="total && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ total }}</b> 条记录
                        </p>
                        <ul class="m-resource-list" v-if="npc.length">
                            <li
                                v-for="(o, i) in npc"
                                :key="i"
                                class="u-item"
                                :class="{ on: o.isSelected }"
                                @click="selectNpc(o, i)"
                                ref="item"
                            >
                                <span class="u-id">ID:{{ o.ID }}</span>
                                <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                                <span class="u-name">
                                    {{ o.Name }}
                                    <em v-if="o.Level">(等级：{{ o.Level }})</em>
                                </span>
                                <span class="u-content">
                                    <span class="u-map">地图：{{ o.MapName }}</span>
                                    <span class="u-life">血量：{{ o.MaxLife }}</span>
                                    <span class="u-mana">内力：{{ o.MaxMana }}</span>
                                </span>
                                <span class="u-remark">
                                    {{ o.Requirement }}
                                </span>
                            </li>
                        </ul>
                        <el-alert v-if="!npc.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                    <el-tab-pane label="图标" name="icon">
                        <template #label>
                            <span class="u-tab-label">
                                <img class="u-icon" svg-inline src="../../assets/img/editor/icons.svg" />
                                <b>图标</b>
                                <em class="u-count">{{ stat.icon }}</em>
                            </span>
                        </template>
                        <p v-if="icon.length && done" class="m-resource-count">
                            <el-icon><Histogram /></el-icon> 共找到 <b>{{ icon.length }}</b> 条记录
                        </p>
                        <ul class="m-resource-iconlist">
                            <li
                                v-for="(o, i) in icon"
                                class="u-item"
                                :key="i"
                                :class="{ on: !!o.isSelected }"
                                @click="selectIcon(o)"
                                ref="icon"
                            >
                                <!-- <el-tooltip
                                    effect="dark"
                                    :content="o.Name || query"
                                    placement="top"
                                >-->
                                <img class="e-jx3-icon" :src="iconURL(o.iconID)" :alt="query" />
                                <!-- </el-tooltip> -->
                            </li>
                        </ul>
                        <el-alert v-if="!icon.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>
                    </el-tab-pane>
                </el-tabs>

                <template v-if="multipage">
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

                <div class="m-database-tip" v-show="isBlank">❤ 请输入搜索条件查询</div>
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
import { loadResource, loadStat, getIcons } from "../../service/database";
import { loadEmotions } from "../../service/cms";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import detach_types from "../../assets/data/detach_type.json";
import { iconLink, getLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
import GameText from "./components/GameText.vue";
import User from "@jx3box/jx3box-common/js/user";
import Item from "./components/Item.vue";

const { __iconPath, __Root, __OriginRoot } = JX3BOX;

export default {
    name: "ResourceDialog",
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

            type: "buff",
            query: "",
            strict: false,
            client: location.hostname.includes("origin") ? "origin" : "std",

            skill: [],
            buff: [],
            item: [],
            icon: [],
            npc: [],
            authors: [],
            selectedAuthor: {},
            emotions: [],

            stat: {
                skill: 0,
                buff: 0,
                item: 0,
                npc: 0,
                icon: 0,
            },

            done: false,
            loading: false,

            isSuper: false,

            html: "",
            isPC: true,

            per: 10,
            page: 1,
            total: 1,
            pages: 1,

            buff_mode: "simple",
            skill_mode: "simple",
        };
    },
    computed: {
        buttonTXT: function () {
            return this.selectedCount ? "插 入" : "确 定";
        },
        isBlank: function () {
            return !this.query && !this[this.type]["length"];
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
            return this.client == "origin" ? "origin_icon" : "icon";
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
    },
    watch: {
        html: function (newval) {
            this.$emit("update", newval);
        },
        client: function () {
            loadStat({ client: this.client }).then((data) => {
                this.stat = data;
                this.actived = true;
            });
        },
    },
    methods: {
        getData: function (page = 1, append = false) {
            if (!this.query) return;

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
            if (this.type == "icon") {
                if (isNaN(query)) {
                    getIcons(query, params)
                        .then((data) => {
                            this.icon = data;
                        })
                        .finally(() => {
                            this.done = true;
                            this.loading = false;
                        });
                } else {
                    let arr = [
                        {
                            iconID: ~~this.query,
                            isSelected: false,
                        },
                    ];
                    this.icon = arr;
                    this.done = true;
                    this.loading = false;
                }
            } else if (this.type === "emotions") {
                this.per = 30;
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
            } else {
                // 非图标
                loadResource(this.type, query, params)
                    .then((data) => {
                        if (!append) this[this.type] = [];
                        let list;
                        if (this.type == "item") {
                            list = this.transformData(data.data);
                            this.pages = data.last_page;
                            this.total = data.total;
                        } else {
                            list = this.transformData(data.list || []);
                            this.pages = data.pages;
                            this.total = data.total;
                        }
                        this[this.type] = this[this.type].concat(list);
                    })
                    .finally(() => {
                        this.done = true;
                        this.loading = false;
                    });
            }
        },
        search: function () {
            this.page = 1;
            this.getData();
        },
        appendPage: function () {
            this.getData(++this.page, true);
        },
        changePage: function (i) {
            this.getData(i);
        },
        changeType: function () {
            this.page = 1;
            this.getData();
        },
        insert: function () {
            this.$emit("insert", this.html);
            this.dialogVisible = false;
        },
        transformData: function (data) {
            data.forEach((item) => {
                item.isSelected = false;
            });
            return data;
        },
        changeMode: function () {
            this.resetItems();
        },
        selectBuff: function (o, i) {
            this.resetItems();
            o.isSelected = true;
            if (this.buff_mode == "simple") {
                // <img src="${this.iconURL(
                //     o.IconID
                // )}">
                this.html = `<a data-type="buff" class="e-jx3-buff w-jx3-element ${
                    o.CanCancel == 1 ? "isBuff" : "isDebuff"
                }" href="${this.getDbLink("buff", this.client, o.BuffID, o.Level)}" data-client="${
                    this.client
                }" data-id="${o.BuffID}" data-level="${o.Level}">[${o.Name}]</a>`;
            } else {
                this.html = `<pre data-type="buff" data-id="${o.BuffID}" class="e-jx3-resource">${
                    this.$refs[this.type][i]["innerHTML"]
                }</pre>`;
            }
        },
        selectSkill: function (o, i) {
            this.resetItems();
            o.isSelected = true;
            if (this.skill_mode == "simple") {
                this.html = `<a data-type="skill" class="e-jx3-skill w-jx3-element" href="${this.getDbLink(
                    "skill",
                    this.client,
                    o.SkillID,
                    o.Level
                )}" data-client="${this.client}" data-id="${o.SkillID}" data-level="${o.Level}">[${o.Name}]</a>`;
            } else {
                this.html = `<pre data-type="skill" data-id="${o.SkillID}" class="e-jx3-resource">${
                    this.$refs[this.type][i]["innerHTML"]
                }</pre>`;
            }
        },
        selectItem: function (o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<a data-type="item" class="e-jx3-item e-jx3-item-q${
                o.Quality
            } w-jx3-element" data-mode="" data-id="${o.id}" data-quality="${o.Quality}" data-client="${
                this.client
            }" target="_blank" href="${this.getLink("item", o.id)}">[${o.Name}]</a>`;
        },
        selectIcon: function (o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<img class="e-jx3-icon" src="${__iconPath}${this.iconDir}/${o.iconID}.png" alt="${o.iconID}"/>`;
        },
        selectNpc: function (o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<a data-type="npc" class="e-jx3-npc w-jx3-element" data-mode="" data-id="${
                o.ID
            }"  data-client="${this.client}" target="_blank" href="${this.getDbLink("npc", this.client, o.ID, "")}">${
                o.Name
            }]</a>`;
        },
        selectEmotion: function (o) {
            this.resetItems();
            o.isSelected = true;
            this.html = `<img class="e-jx3-emotion" style="width:80px;" src="${o.url}" alt="${o.id}"/>`;
        },
        resetItems: function () {
            let data = this[this.type];
            data.forEach((item) => {
                item.isSelected = false;
            });
            this.html = "";
        },
        checkUA: function () {
            this.isPC = window.innerWidth > 720;
        },
        iconURL: function (id) {
            return iconLink(id, this.client);
        },
        getDbLink: function (type, client, id, level) {
            let domain = client == "origin" ? __OriginRoot : __Root;
            return domain + "app/database/?type=" + type + `&query=${id}&level=${level}`;
        },
        getLink: function (type, id) {
            let domain = this.client == "origin" ? __OriginRoot : __Root;
            return domain + getLink(type, id).slice(1);
        },
        userAvatar: function (url) {
            return showAvatar(url, "m");
        },

        // 杂项
        // ==============================
        openDialog: function () {
            this.dialogVisible = true;
            if (!this.actived) {
                loadStat({ client: this.client }).then((data) => {
                    this.stat = data;
                    this.actived = true;
                });
            }
        },
        filterRaw: function (str) {
            return str && str.replace(/\\n/g, "\n");
        },
        showDetachType: function (val) {
            if (val && detach_types[val]) {
                return detach_types[val];
            } else {
                return "";
            }
        },
    },
    created: function () {
        this.checkUA();
    },
    components: {
        "jx3-item": Item,
        GameText,
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
