<template>
    <div class="m-resource-combo">
        <div class="m-combo-list">
            <div v-if="total && done" class="m-resource-count">
                <i class="el-icon-s-data"></i> 共找到 <b>{{ total }}</b> 条记录
            </div>
            <ul class="m-resource-list">
                <li
                    v-for="(o, i) in skill"
                    class="u-item"
                    :key="i"
                    @click="selectSkill(o, i)"
                    ref="skill"
                >
                    <span class="u-id">ID:{{ o.SkillID }}</span>
                    <img
                        class="u-pic"
                        :title="'IconID:' + o.IconID"
                        :src="iconURL(o.IconID)"
                    />
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

            <template v-if="multipage">
                <!-- 下一页 -->
                <el-button
                    class="m-archive-more"
                    :class="{ show: hasNextPage }"
                    type="primary"
                    icon="el-icon-arrow-down"
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

            <div class="m-database-tip" v-show="isBlank">
                ❤ 请输入搜索条件查询
            </div>
        </div>

        <el-divider>已选技能</el-divider>
        <div class="m-selected-skills">
            <ul class="m-skills-list">
                <li
                    v-for="(skill, index) in selected"
                    :key="index + skill.SkillID"
                    class="m-skill"
                    @contextmenu.prevent="(event) => onContextmenu(event, skill)"
                >
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img
                            class="u-skill-icon"
                            :src="iconURL(skill.IconID)"
                            :alt="skill.IconID"
                        />
                        <i class="u-gcd-icon" v-show="skill.WithoutGcd">
                            <i class="el-icon-time"></i>
                        </i>
                        <i
                            class="u-remove-icon"
                            title="移除"
                            @click="removeSelected(index)"
                            ><i class="el-icon-close"></i
                        ></i>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { iconLink } = utilModule;
import { getSkill } from "../../service/resource";
import Sortable from "sortablejs";
import { cloneDeep } from "lodash";

import LoadScript from 'vue-plugin-load-script';
Vue.use(LoadScript);

import contextmenu from "vue-contextmenujs"
Vue.use(contextmenu)
export default {
    name: "ComboComponent",
    props: {
        query: {
            type: String,
            default: "",
        },
        client: {
            type: String,
            default: "std",
        },
        strict: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            done: false,
            per: 10,
            page: 1,
            total: 1,
            pages: 1,

            selected: [],
            skill: [],
        };
    },
    computed: {
        multipage: function () {
            return this.done && this.pages > 1;
        },
        isBlank: function () {
            return !this.query && !this.skill?.["length"];
        },
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.initSkillSort();
        });
    },
    methods: {
        getData(page = 1, append = false) {
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

            getSkill(query, params)
                .then((data) => {
                    if (!append) this.skill = [];
                    const list = (data.list || [])?.map((item) => {
                        item.isSelected = false;
                        return item;
                    });
                    this.pages = data.pages;
                    this.total = data.total;
                    this.skill = this.skill.concat(list);
                })
                .finally(() => {
                    this.done = true;
                    this.loading = false;
                });
        },
        iconURL: function (id) {
            return iconLink(id, this.client);
        },
        filterRaw: function (str) {
            return str && str.replace(/\\n/g, "\n");
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
        selectSkill: function (o) {
            this.selected.push(o);
        },
        removeSelected: function (index) {
            this.selected.splice(index, 1);
        },
        initSkillSort() {
            const el = document.querySelector(`.m-selected-skills .m-skills-list`);
            if (!el) return;
            const _this = this;
            Sortable.create(el, {
                animation: 200,
                onEnd({ newIndex, oldIndex }) {
                    const newSkills = cloneDeep(_this.selected);
                    const [removed] = newSkills.splice(oldIndex, 1);
                    newSkills.splice(newIndex, 0, removed);
                    _this.selected = newSkills;
                },
            });
        },
        onContextmenu(event, skill) {
            this.$contextmenu({
                items: [
                    {
                        label: !skill?.WithoutGcd ? "设置为无GCD技能" : "设置为有GCD技能",
                        onClick: () => {
                            this.$set(skill, "WithoutGcd", !skill.WithoutGcd);
                        },
                        icon: !skill?.WithoutGcd ? "el-icon-check" : "el-icon-close"
                    },
                ],
                event,
                customClass: "custom-class",
                zIndex: 99999,
                minWidth: 200,
            });
            return false;
        },

        renderVal() {
            const {selected} = this;
            let skills_html = ''
            selected.forEach(item => {
                const obj = {
                    gcd: item.WithoutGcd ? 0: 1
                }
                skills_html += `<li class="w-skill-combo-item">${item.SkillID},${item.Name},${item.IconID},${JSON.stringify(obj)}</li>`
            })
            const html = `<ul class="e-skill-combo w-skill-combo">${skills_html}</ul>`
            return html;
        },
    },
};
</script>

<style lang="less">
@import "../../../assets/css/editor/combo.less";
</style>
