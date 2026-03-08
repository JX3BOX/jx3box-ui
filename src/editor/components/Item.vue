<template>
    <div
        v-if="source"
        class="c-item"
        :class="{
            'c-item-equipment': source.AucGenre >= 1 && source.AucGenre <= 4,
            'c-item-furniture': source.AucGenre == 21,
        }"
    >
        <div class="c-item-wrapper">
            <!-- 精炼等级 -->
            <div v-if="source.MaxStrengthLevel" class="u-max-strength-level">
                <span v-text="`精炼等级：0 / ${source.MaxStrengthLevel}`"></span>
            </div>
            <!-- 物品名称 -->
            <div class="u-title" :style="{ color: color(source.Quality) }" v-text="source.Name"></div>
            <!-- 绑定状态 -->
            <div v-if="source.BindType > 1" class="u-bind" v-text="bind(source.BindType)"></div>
            <!-- 唯一 -->
            <div v-if="parseInt(source.MaxExistAmount) === 1" class="unique" v-text="'唯一'"></div>
            <!-- 存在时间 -->
            <div
                v-if="parseInt(source.MaxExistTime) > 0"
                class="u-max-exist-time"
                v-text="'限时时间：' + showDuration(source.MaxExistTime)"
            ></div>
            <!-- 最大拥有数 -->
            <div
                v-if="parseInt(source.MaxExistAmount) > 1"
                class="u-max-exist-amount"
                v-text="'最大拥有数：' + source.MaxExistAmount"
            ></div>
            <!-- 武器类别 -->
            <div v-if="source.AucGenre == 1" class="u-weapon-type-label">近身武器</div>
            <div v-if="source.AucGenre == 2" class="u-weapon-type-label">远程武器</div>
            <!-- 物品类型文案 -->
            <div v-if="source.TypeLabel" class="u-type-label" v-text="source.TypeLabel"></div>
            <!-- 装备属性 -->
            <div class="u-attributes" v-if="source.attributes && source.attributes.length">
                <div
                    v-for="(attribute, key) in source.attributes"
                    :key="key"
                    class="u-field"
                    :class="[`u-${attribute.color}`]"
                >
                    <span
                        v-if="
                            attribute.type == 'atMeleeWeaponAttackSpeedBase' ||
                            attribute.type == 'atRangeWeaponAttackSpeedBase'
                        "
                        class="u-value u-speed"
                        v-text="attribute.label"
                    ></span>
                    <span v-else-if="attribute.type == 'atHorseAttribute'" class="u-value u-horse-attribute">
                        <img v-if="attribute.icon_id > 0" class="u-horse-icon" :src="iconLink(attribute.icon_id)" />
                        <div class="u-horse-desc" v-html="attribute.label"></div>
                    </span>
                    <span v-else class="u-value">
                        <game-text :text="attribute.label"></game-text>
                        <!-- <span
                            class="u-yellow"
                            v-text="
                                attribute_percent(
                                    attribute.type,
                                    attribute.value
                                )
                            "
                        ></span>-->
                    </span>
                </div>
            </div>
            <!-- 家具属性 -->
            <div class="u-furniture-attributes" v-if="source.furniture_attributes">
                <div class="u-field u-green" v-if="source.furniture_attributes.view">
                    <span class="u-value" v-text="`观赏提高${source.furniture_attributes.view}`"></span>
                </div>
                <div class="u-field u-green" v-if="source.furniture_attributes.practical">
                    <span class="u-value" v-text="`实用提高${source.furniture_attributes.practical}`"></span>
                </div>
                <div class="u-field u-green" v-if="source.furniture_attributes.hard">
                    <span class="u-value" v-text="`坚固提高${source.furniture_attributes.hard}`"></span>
                </div>
                <div class="u-field u-green" v-if="source.furniture_attributes.geomantic">
                    <span class="u-value" v-text="`风水提高${source.furniture_attributes.geomantic}`"></span>
                </div>
                <div class="u-field u-green" v-if="source.furniture_attributes.interesting">
                    <span class="u-value" v-text="`趣味提高${source.furniture_attributes.interesting}`"></span>
                </div>
            </div>
            <!-- 镶嵌 -->
            <ul v-if="source.Diamonds" class="u-diamonds u-gray">
                <!-- 五行石 -->
                <li class="u-diamond" v-for="(label, key) in source.Diamonds" :key="key">
                    <span class="u-square"></span>
                    <span class="u-text" v-text="`镶嵌孔：${label}`"></span>
                </li>
                <!-- 五彩石 -->
                <li v-if="source.AucGenre == 1" class="u-diamond">
                    <span class="u-square"></span>
                    <span class="u-text">&lt;只能镶嵌五彩石&gt;</span>
                </li>
            </ul>
            <!-- 仅性别可穿戴 -->
            <div v-if="source.Requires && source.Requires[7]" class="u-require-sex" v-text="source.Requires[7]"></div>
            <!-- 需要门派 -->
            <div
                v-if="source.Requires && source.Requires[6]"
                class="u-require-school"
                v-text="source.Requires[6]"
            ></div>
            <!-- 需要等级 -->
            <div v-if="source.Requires && source.Requires[5]" class="u-require-level" v-text="source.Requires[5]"></div>
            <!-- 需要阵营 -->
            <div
                v-if="source.Requires && source.Requires[100]"
                class="u-require-camp"
                v-text="source.Requires[100]"
            ></div>
            <!-- 需求宅邸等级 -->
            <div
                v-if="source.Requires && source.Requires[101]"
                class="u-require-homeland-level"
                v-text="source.Requires[101]"
            ></div>
            <!-- 最大耐久度 -->
            <div
                v-if="source.AucGenre >= 1 && source.AucGenre <= 3"
                class="u-max-durability"
                v-text="'最大耐久度' + source.MaxDurability"
            ></div>
            <!-- 套装信息 -->
            <div v-if="source.Set" class="u-set">
                <br />
                <div class="u-yellow" v-text="`${source.Set.name}(1/${source.Set.siblings.length})`"></div>
                <ul class="u-set-siblings u-gray">
                    <li
                        v-for="(sibling, key) in source.Set.siblings"
                        :key="key"
                        v-text="sibling"
                        :class="{ 'u-yellow': sibling == source.Name }"
                    ></li>
                </ul>
                <br />
                <ul class="u-set-attributes u-gray">
                    <li v-for="(attribute, key) in source.Set.attributes" :key="key">
                        <span>{{ `[${key}]` }}</span>
                        <game-text :client="client" :text="attribute" :ignore-color="true"></game-text>
                    </li>
                </ul>
                <br />
            </div>
            <!-- 图片 -->
            <div class="u-image-url" v-if="source.ImageUrl">
                <img :src="source.ImageUrl" @error.once="source.ImageUrl = null" />
            </div>
            <!-- 描述 -->
            <p v-if="source.Desc" class="u-desc u-yellow">
                <game-text :client="client" :text="source.Desc"></game-text>
            </p>
            <!-- 五彩石属性 -->
            <p v-if="source.WuCaiHtml" class="u-desc" v-html="source.WuCaiHtml"></p>
            <!-- 品质等级 -->
            <div v-if="source.Level" class="u-level u-yellow" v-text="'品质等级' + source.Level"></div>
            <!-- 装备分数 -->
            <div
                v-if="source.EquipmentRating"
                class="u-equipment-rating u-orange"
                v-text="'装备分数' + source.EquipmentRating"
            ></div>
            <!-- 推荐门派心法 -->
            <div v-if="source.Recommend" class="u-equipment-recommend" v-text="'推荐门派：' + source.Recommend"></div>
            <!-- 冷却时间 -->
            <div
                v-if="source.CoolDown"
                class="u-equipment-recommend"
                v-text="'使用间隔' + second_format(source.CoolDown)"
            ></div>
            <!-- 外观名称 -->
            <div v-if="source.Appearance" class="u-appearance" v-text="'外观名称：' + source.Appearance"></div>
            <!-- 可收集门派 -->
            <div v-if="source.CanExterior" class="u-can-exterior" v-text="'外观：' + source.CanExterior"></div>
            <!-- 储物箱共享 -->
            <div v-if="source.CanShared && !(source.AucGenre >= 1 && source.AucGenre <= 4)" class="u-can-shared">
                该物品可以放入账号储物箱共享。
            </div>
            <div v-if="source.CanShared && source.AucGenre >= 1 && source.AucGenre <= 4" class="u-can-shared">
                该装备未精炼、镶嵌、附魔、穿戴前可以放入账号储物箱共享。
            </div>
            <!-- 家具可交互可缩放 -->
            <div v-if="source.furniture_attributes" class="u-furniture-can">
                <span v-if="source.furniture_attributes.interact">可交互</span>
                <span
                    v-if="source.furniture_attributes.scale_range"
                    v-text="`可缩放(${source.furniture_attributes.scale_range.replace(';', ' - ')}倍)`"
                ></span>
            </div>
            <!-- 物品来源 -->
            <div v-if="source.GetType" class="u-get-type" v-text="`物品来源：${source.GetType}`"></div>
        </div>
    </div>
</template>

<script>
import { get_item } from "../../../service/item.js";

import GameText from "./GameText.vue";

import attribute_percent from "../../../assets/js/item/attribute_percent.js";
import bind from "../../../assets/js/item/bind.js";
import color from "../../../assets/js/item/color.js";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { iconLink } = utilModule;

import second_format from "../../../assets/js/item/second_format.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default {
    name: "ItemComponent",
    props: {
        item: {
            type: Object,
        },
        item_id: {
            type: String,
        },
        client: {
            type: String,
        },
        jx3ClientType: {
            type: Number,
        },
    },
    data() {
        return {
            source: null,
        };
    },
    components: {
        GameText,
    },
    computed: {
        // 兼容旧版传值
        env_client_id: function () {
            return location.href.includes("origin") ? 2 : 1;
        },
        client_id: function () {
            return this.jx3ClientType || this.env_client_id;
        },
        client_by_id: function () {
            return this.client_id == 1 ? "std" : "origin";
        },
        // 新版传值
        final_client: function () {
            return this.client || this.client_by_id;
        },
        cache_key: function () {
            return `item-${this.final_client}-${this.item_id}`;
        },
    },
    methods: {
        iconLink: function (id) {
            return iconLink(id, this.final_client);
        },
        second_format,
        showDuration: function (val) {
            val = Number(val);
            return val && dayjs.duration(val).asDays().toFixed(0) + "天";
        },
        attribute_percent,
        bind,
        color,
        formatDescHtml: function (str) {
            return str.replace(/font=\d+\s>/g, "");
        },
    },
    watch: {
        item: {
            immediate: true,
            handler() {
                if (typeof this.item !== "undefined") this.source = this.item;
            },
        },
        item_id: {
            immediate: true,
            handler(val) {
                if (val) {
                    // 提取本地数据
                    let _cache = sessionStorage.getItem(this.cache_key);

                    // 本地读取缓存
                    if (_cache) {
                        try {
                            this.source = JSON.parse(_cache);
                        } catch (e) {
                            console.log(e, "[Item]无法解析本地缓存");
                        }

                        // 服务端拉取
                    } else {
                        get_item(this.item_id, this.final_client).then((res) => {
                            let data = res.data;
                            if (data.code === 200) {
                                let item = data.data.item;
                                let isValidItem = JSON.stringify(item) !== "{}";
                                if (isValidItem) {
                                    this.source = item;
                                    sessionStorage.setItem(this.cache_key, JSON.stringify(this.source));
                                } else {
                                    this.source = null;
                                }
                            }
                        });
                    }
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "../../../assets/css/module/item.less";
</style>
