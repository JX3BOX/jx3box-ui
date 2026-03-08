<!--
 * @Author: X3ZvaWQ
 * @Date: 2022-08-20 20:23:57
 * @LastEditors: X3ZvaWQ
 * @LastEditTime: 2022-08-24 22:32:56
 * @Description: 用于渲染游戏内Text标签的文本
-->
<template>
    <span v-html="html"></span>
</template>

<script>
import { extractTextContent, getLink, iconLink } from "@jx3box/jx3box-common/js/utils";
import { getResource as getResourceFromNode } from "../../../service/resource";
import { escape } from "lodash";

export default {
    name: "GameText",
    props: {
        text: {
            type: String,
            default: "",
        },
        ignoreColor: {
            type: Boolean,
            default: false,
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data: function () {
        return {
            html: "",
        };
    },
    methods: {
        /**
         * 渲染某一个单独的Text标签成Span或链接
         * @param {*} school_id
         * @returns
         */
        renderItemHtml: function (item) {
            let content = item.text;
            let style = ``;
            let link = null;
            content = content.replace(/\\n/g, "<br />").replace(/\\/g, "");
            if ([item.r, item.g, item.b].every((v) => v != undefined && v > 0)) {
                style = `color: rgb(${item.r}, ${item.g}, ${item.b});`;
            } else if (item.font != undefined && item.font != 100) {
                const fonts = require("../../../assets/data/game_font.json");
                for (let color in fonts) {
                    if (fonts[color].includes(item.font)) {
                        style = `color: ${color};`;
                        break;
                    }
                }
            }
            if (item.name == "iteminfolink" && item.script) {
                let item_type = item.script?.match(/this\.dwTabType=(\d+)/i)?.[1];
                let item_index = item.script?.match(/this\.dwIndex=(\d+)/i)?.[1];
                if (item_type && item_index) {
                    let item_id = `${item_type}_${item_index}`;
                    link = getLink("item", item_id);
                }
            }
            if (this.ignoreColor) {
                style = "";
            }
            if (link) {
                return `<a style="${style} text-decoration: none;" target="_blank" href="${link}">${content}</a>`;
            } else {
                return `<span style="${style}">${content}</span>`;
            }
        },
        /**
         * 将image标签转换为HTML标签
         */
        renderImageHtml: function (Text) {
            // <image>path="fromiconid" frame=1241 w=29 h=29 </image>
            let matches = Text.match(/<image>(.*?)<\/image>/gims);
            if (!matches) return Text;
            for (let match of matches) {
                let icon_id = match.match(/frame=(\d+)/i)?.[1];
                let w = parseInt(match.match(/w=(\d+)/i)?.[1]) / 1.12;
                let h = parseInt(match.match(/h=(\d+)/i)?.[1]) / 1.12;
                let src = iconLink(icon_id, this.client);
                let html = `<img src="${src}" style="width: ${w}px; height: ${h}px; margin-bottom: -5px" />`;
                Text = Text.replace(match, html);
            }
            return Text;
        },
        /**
         * 将一段游戏内文本转换为Html
         * @param {Object[]} texts 标签对象
         */
        renderTextHtml: function (Text) {
            let result = Text;
            result = this.renderImageHtml(result);
            const matches = Text.match(/<Text>(.*?)<\/text>/gims);
            if (!matches) return Text;
            for (let match of matches) {
                let text = extractTextContent(match);
                let html = this.renderItemHtml(text[0]);
                result = result.replace(match, html);
            }
            return result;
        },
        /**
         * 获取形如<BUFF 110 1 desc>, <ENCHANT 100>的资源字段并转换
         */
        renderBuffResource: async function () {
            const matches = this.html?.match(/<BUFF (\d+) (\d+) (.*?)>/gim);
            if (!matches) return;
            let resourceKeys = [];
            let replaceMap = {};
            //先统计需要的资源，减少请求数量
            for (let match of matches) {
                let [token, id, level, type] = match.match(/<BUFF (\d+) (\d+) (.*?)>/i);
                resourceKeys.push(`${id}_${level}`);
                if (level != 0) resourceKeys.push(`${id}_0`);
                replaceMap[token] = [id, level, type];
            }
            await this.getAllResources("buff", resourceKeys, this.client);
            for (let replace in replaceMap) {
                let [id, level, type] = replaceMap[replace];
                // 持续时间
                if (type === "time") {
                    let interval;
                    let buff = this.getResource("buff", id, level);
                    if (buff["Interval"]) interval = buff["Interval"];
                    else interval = this.getResource("buff", id, 0)["Interval"];
                    if (!interval) {
                        console.log(replace, escape(replace));
                        this.html = this.html.replace(replace, escape(replace));
                        continue;
                    }
                    let time = interval / 16;
                    if (time > 60) {
                        time = Math.floor(time / 60) + "分钟";
                    } else {
                        time = time + "秒";
                    }
                    this.html = this.html.replace(replace, escape(time));
                    continue;
                }
                // buff描述
                if (type === "desc") {
                    let buff = this.getResource("buff", id, level);
                    let desc = buff["Desc"];
                    if (!desc) desc = this.getResource("buff", id, 0)["Desc"];
                    if (!desc) {
                        this.html = this.html.replace(replace, escape(replace));
                        continue;
                    }
                    // buff的描述里面可能会混着一些buff的属性啥的
                    let _matches = desc.match(/<BUFF ([0-9a-zA-Z]+)>/gi);
                    if (_matches) {
                        for (let _m of _matches) {
                            // eslint-disable-next-line no-unused-vars
                            let [_, _attr] = _m.match(/<BUFF ([0-9a-zA-Z]+)>/i);
                            for (let i = 1; i < 15; i++) {
                                if (buff[`BeginAttrib${i}`] == _attr) {
                                    desc = desc.replace(_m, buff[`BeginValue${i}A`]);
                                }
                            }
                        }
                    }
                    this.html = this.html.replace(replace, desc);
                }
            }
        },
        renderEnchantResource: async function () {
            const matches = this.html.match(/<ENCHANT (\d+)>/gim);
            if (!matches) return;
            let resourceKeys = [];
            let replaceMap = {};
            for (let match of matches) {
                let enchant_id = match.match(/<ENCHANT (\d+)>/i)[1];
                resourceKeys.push(enchant_id);
                replaceMap[match] = enchant_id;
            }
            await this.getAllResources("enchant", resourceKeys, this.client);
            for (let replace in replaceMap) {
                try {
                    let enchant_id = replaceMap[replace];
                    let enchant = this.getResource("enchant", enchant_id);
                    let time = enchant.Time;
                    if (time) time = `，持续${parseInt(time) / 60}分钟。`;
                    let result = `${enchant.AttriName}${time ? time : ""}`;
                    this.html = this.html.replace(replace, result);
                } catch (e) {
                    console.log(e);
                    this.html = this.html.replace(replace, escape(replace));
                }
            }
        },
        renderResource: function () {
            this.renderBuffResource();
            this.renderEnchantResource();
        },
        getAllResources: async function (type, ids) {
            let resources = await getResourceFromNode(type, ids, this.client);
            let data = resources.data;
            if (data.length === undefined) data = [data];
            if (type == "buff") {
                for (let item of data) {
                    let buff_token = `${item.BuffID}_${item.Level}`;
                    sessionStorage.setItem(`buff-${this.client}-${buff_token}`, JSON.stringify(item));
                }
            } else if (type == "enchant") {
                for (let item of data) {
                    let enchant_token = `${item.ID}`;
                    sessionStorage.setItem(`enchant-${this.client}-${enchant_token}`, JSON.stringify(item));
                }
            }
        },
        getResource: function (type, id, level) {
            let token = `${id}`;
            if (type == "buff") {
                token = `${id}_${level}`;
            }
            let resource = sessionStorage.getItem(`${type}-${this.client}-${token}`);
            if (resource) return JSON.parse(resource);
            return null;
        },
    },
    watch: {
        text: {
            immediate: true,
            handler: function (val) {
                if (!val) return;
                this.html = this.renderTextHtml(val);
                this.renderResource();
            },
        },
    },
};
</script>

<style></style>
