<template>
    <div class="c-jx3box" :class="{ on: status, isOverlay: overlayEnable && isOverlay }">
        <!-- search -->
        <header-search @click.stop />

        <!-- list -->
        <ul class="u-list">
            <li>
                <a class="u-item" href="/index">
                    <img class="u-pic" svg-inline :src="homeicon" />
                    <img class="u-pic-hover" svg-inline :src="homeicon" />
                    <span class="u-txt">{{ $jx3boxT("jx3boxUi.commonHeader.home", "首页") }}</span>
                </a>
            </li>
            <li v-for="(item, i) in list" :key="i" :class="{ 'u-app-start': item.lf }">
                <a class="u-item" :href="item.href" :target="getTarget(item.href)">
                    <img class="u-pic" :src="getBoxIcon(item.img)" />
                    <span class="u-txt" :title="item.abbr">{{ getDisplayName(item.abbr) }}</span>
                </a>
            </li>
        </ul>
        <span class="u-close" @click="closeBox($event)">
            <el-icon><Upload /></el-icon>
            <span>{{ $jx3boxT("jx3boxUi.commonHeader.collapse", "收起") }}</span>
        </span>
    </div>
</template>

<script>
import search from "./search.vue";
import _ from "lodash";
import Bus from "../../utils/bus";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
import box from "../../assets/data/box.json";
import { trimSlash } from "./utils";
import { loadBoxMenu } from "./box-menu";

const { __imgPath, __cdn } = JX3BOX;
export default {
    name: "Box",
    mixins: [i18nMixin],
    props: {
        overlayEnable: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            status: false,
            isOverlay: false,
            data: box,
            client: location.href.includes("origin") ? "origin" : "std",
        };
    },
    computed: {
        homeicon: function () {
            return __cdn + "logo/logo-dark/home.svg";
        },
        homeicon_hover: function () {
            return __imgPath + "image/box/home_on.svg";
        },
        originicon: function () {
            return __imgPath + "image/box/origin.svg";
        },
        list: function () {
            return this.data.filter((item) => {
                const visible = item.status == null || !!item.status;
                return visible && this.matchedClient(item.client);
            });
        },
        prefix: function () {
            return this.client === "std" ? "www" : "origin";
        },
    },
    methods: {
        closeBox: function () {
            Bus.emit("toggleBox", false);
        },
        matchedClient: function (client) {
            const clients = Array.isArray(client)
                ? client
                : String(client || "")
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean);
            return !clients.length || clients.includes("all") || clients.includes(this.client);
        },
        getBoxIcon: function (val) {
            val = val && val?.replace(".png", ".svg");
            let web_url = __cdn + "logo/logo-dark/" + val;
            return web_url;
        },
        getDisplayName: function (name) {
            const chars = Array.from(String(name || "").trim());
            if (chars.length === 5) return chars.slice(0, 3).join("");
            if (chars.length === 4) return chars.slice(0, 2).join("");
            return chars.join("");
        },
        getTarget: function (val) {
            if (window.innerWidth < 768 || val?.startsWith("/")) {
                return "_self";
            } else {
                return "_blank";
            }
        },
        loadMenu() {
            loadBoxMenu(box).then((data) => {
                this.data = data;
            });
        },
        trimSlash(link) {
            return trimSlash(`${this.prefix}:${link}`);
        },
    },
    created: function () {
        if (this.overlayEnable) {
            const vm = this;
            window.addEventListener(
                "scroll",
                _.throttle(() => {
                    vm.isOverlay = window.scrollY > 200 ? true : false;
                }, 200)
            );
        }
        this.loadMenu();
    },
    mounted: function () {
        this.__toggleBoxHandler = (status) => {
            if (status == undefined) {
                this.status = !this.status;
            } else {
                this.status = status;
            }
        };
        Bus.on("toggleBox", this.__toggleBoxHandler);

        this.__docClickHandler = () => {
            Bus.emit("toggleBox", false);
        };
        document.addEventListener("click", this.__docClickHandler);
    },
    beforeUnmount() {
        if (this.__toggleBoxHandler) {
            Bus.off("toggleBox", this.__toggleBoxHandler);
            this.__toggleBoxHandler = null;
        }
        if (this.__docClickHandler) {
            document.removeEventListener("click", this.__docClickHandler);
            this.__docClickHandler = null;
        }
    },
    components: {
        "header-search": search,
    },
};
</script>

<style lang="less">
/* src/header/box.vue */
@import "../../assets/css/header/box.less";
</style>

<style lang="less">
/* src/header/box.vue */
.c-jx3box {
    .c-header-search {
        float: none;
        .w(auto);
        margin: 0 20px 10px 20px;
        box-sizing: border-box;
        padding: 0;
        .none;
    }
}
@media screen and (max-width: @phone) {
    .c-jx3box .c-header-search {
        .db;
    }
}
</style>
