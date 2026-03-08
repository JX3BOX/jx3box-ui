<template>
    <nav class="c-header-nav" v-if="finalNav">
        <div class="c-header-nav--pc">
            <div class="u-item-box" v-for="item in finalNav" :key="'header-nav-' + item.key">
                <template v-if="item.status && matchedClient(item.client)">
                    <template v-if="item.children && item.children.length">
                        <el-dropdown class="u-menu" :show-timeout="0" trigger="hover">
                            <a
                                class="u-item el-dropdown-link"
                                :class="{ on: isFocus(item.link) }"
                                :href="item.link"
                                :target="isSelf(item.link)"
                                >{{ item.label }}</a
                            >
                            <template #dropdown>
                                <el-dropdown-menu class="c-header-menu">
                                    <template v-for="(subitem, subIndex) in item.children">
                                        <el-dropdown-item
                                            v-if="subitem.status && matchedClient(subitem.client)"
                                            :key="'header-nav-drop-' + subitem.key + subIndex"
                                            class="u-menu-item"
                                        >
                                            <a :href="subitem.link" :target="isSelf(subitem.link)"
                                                >{{ subitem.label }}
                                                <span v-if="subitem.desc">{{ subitem.desc }}</span></a
                                            >
                                        </el-dropdown-item>
                                    </template>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                    <template v-else>
                        <a class="u-item" :class="{ on: isFocus(item.link) }" :href="item.link">{{ item.label }}</a>
                    </template>
                </template>
            </div>
        </div>
        <!-- <div class="c-header-nav--pad">
            <el-menu mode="horizontal" class="c-quick-menu" :default-active="activeIndex">
                <el-sub-menu index="quick-menu" popper-class="c-quick-menu__submenu">
                    <template #title>快捷导航</template>
                    <template v-for="item in finalNav" :key="'header-nav-' + item.key">
                        <el-sub-menu
                            v-if="matchedClient(item.client) && item.children && item.children.length"
                            :index="item.key"
                            class="c-header-menu"
                        >
                            <template #title>
                                    <a
                                        class="u-menu-item"
                                        :class="{ on: isFocus(item.link) }"
                                        :href="item.link"
                                        :target="isSelf(item.link)"
                                        >{{ item.label }}</a
                                    >
                            </template>
                            <template v-for="(subitem, subIndex) in item.children">
                                <el-menu-item
                                    v-if="subitem.status && matchedClient(subitem.client)"
                                    :key="'header-nav-drop-' + subitem.key + subIndex"
                                    :index="subitem.key"
                                >
                                        <a
                                            class="u-menu-item"
                                            :href="subitem.link"
                                            :target="isSelf(subitem.link)"
                                            >{{ subitem.label }} <span v-if="subitem.desc">{{ subitem.desc }}</span></a
                                        >
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                        <el-menu-item v-else-if="matchedClient(item.client)" :index="item.key">
                                <a
                                    class="u-item"
                                    :class="{ on: isFocus(item.link) }"
                                    :href="item.link"
                                    >{{ item.label }}</a
                                >
                        </el-menu-item>
                    </template>
                </el-sub-menu>
            </el-menu>
        </div> -->
    </nav>
</template>

<script>
const default_nav = [
    { key: "index", link: "/index/", label: "首页", client: "all", status: true, parentKey: "" },
    { key: "macro", link: "/macro/", label: "宏库", client: "all", status: true, parentKey: "" },
    { key: "bps", link: "/bps/", label: "职业", client: "all", status: true, parentKey: "" },
    { key: "pvp", link: "/pvp/", label: "竞技", client: "all", status: true, parentKey: "" },
    { key: "fb", link: "/fb/", label: "副本", client: "all", status: true, parentKey: "" },
    { key: "wiki", link: "/cj/", label: "百科", client: "all", status: true, parentKey: "" },
    { key: "pvx", link: "/pvx/", label: "休闲", client: "all", status: true, parentKey: "" },
    { key: "tool", link: "/tool/", label: "工具", client: "all", status: true, parentKey: "" },
    { key: "bbs", link: "/community/", label: "茶馆", client: "all", status: true, parentKey: "" },
];
const activeNav = {
    index: ["index"],
    macro: ["macro", "pz"],
    tool: ["app", "jx3dat", "dbm", "tool"],
    bps: ["bps", "jcl", "battle"],
    fb: ["fb", "baizhan", "team", "jdt", "rank"],
    cj: ["wiki", "item", "knowledge", "quest", "cj"],
    pvx: [
        "face",
        "adventure",
        "pvg",
        "pvx",
        "homeland",
        "pet",
        "horse",
        "furniture",
        "reputation",
        "book",
        "exam",
        "body",
    ],
    community: ["bbs", "topic", "emotion", "joke", "namespace", "collection", "community"],
    pvp: ["pvp"],
};

import { getMenu } from "../../service/header";
import { trimSlash } from "./utils";

export default {
    props: [],
    data: function () {
        return {
            nav: default_nav,

            activeIndex: "",
        };
    },
    computed: {
        finalNav: function () {
            const nav = Array.isArray(this.nav) ? this.nav : [];

            // 父节点
            const parents = nav
                .filter((d) => !d.parentKey && d.status)
                .map((d) => ({
                    ...d,
                    children: [],
                }));
            // 子节点
            const navChildren = nav.filter((c) => c.parentKey && c.status);

            navChildren.forEach((child) => {
                const parent = parents.find((n) => n.key === child.parentKey);
                if (parent) parent.children.push(child);
            });

            return parents;
        },
        client() {
            return location.href.includes("origin") ? "origin" : "std";
        },
        prefix() {
            return this.client === "std" ? "www" : "origin";
        },
    },
    methods: {
        isFocus: function (type) {
            let active = "";
            const pathname = location.pathname?.split("/")?.filter(Boolean)?.[0] || "";
            for (const key in activeNav) {
                if (pathname && activeNav[key].includes(pathname)) {
                    active = key;
                    break;
                }
            }
            return active && type.includes(active);
        },
        syncActiveIndex: function () {
            const nav = Array.isArray(this.nav) ? this.nav : default_nav;
            const hit = nav.find((d) => !d.parentKey && d.status && this.isFocus(d.link));
            this.activeIndex = hit ? hit.key : "";
        },
        matchedClient: function (client) {
            return client == "all" ? true : client == this.client;
        },
        isSelf: function (link) {
            return link.startsWith("/") ? "_self" : "_blank";
        },
        loadNav() {
            try {
                const nav = (sessionStorage.getItem("nav") && JSON.parse(sessionStorage.getItem("nav"))) || null;
                if (nav) {
                    this.nav = nav;
                    this.syncActiveIndex();
                } else {
                    getMenu("nav").then((res) => {
                        if (res.data) {
                            this.nav = res?.data?.data?.val;
                            sessionStorage.setItem("nav", JSON.stringify(this.nav));
                            this.syncActiveIndex();
                        }
                    });
                }
            } catch (e) {
                this.nav = default_nav;
                console.log("loadNav error", e);
            }
        },
        trimSlash(link) {
            return trimSlash(`${this.prefix}:${link}`);
        },
    },
    created: function () {
        this.syncActiveIndex();
        this.loadNav();
    },
    components: {},
};
</script>

<style lang="less">
//菜单
.c-header-nav {
    padding: 0 20px;
    .u-item {
        .pointer;
        display: block;

        font-size: 14px;
        font-weight: 500;

        padding: 0 15px;
        line-height: @header-height;

        color: rgba(255, 255, 255, 0.68);
        &:hover {
            color: #fff;
        }
        transition: all 0.15s ease-in;

        &.on {
            // background-color: @primary;
            .pr;
            color: #fff;
            font-weight: 700;
            &:after {
                content: "";
                .db;
                border-bottom: 3px solid @v4focus;
                .pa;
                .lb(0);
                .w(100%);
            }
        }
    }
    .u-menu {
        .fl;
        .u-arrow {
            width: 12px;
            height: 12px;
            color: #8e8e8e;
            margin-left: 4px;
            vertical-align: middle;
        }
    }
}
.c-header-menu {
    .h(auto) !important;
    .u-menu-item {
        padding: 0;
        a {
            color: @color;
            line-height: 16px;
            padding: 10px 30px;
            .db;
            span {
                .fz(12px);
                color: #999;
            }
        }
    }
    .mt(0px) !important;
}

.c-header-nav--pc,
.c-header-nav--pad {
    .flex(y);
}
.c-header-nav--pad {
    .c-quick-menu {
        background: #24292e;
    }
    .el-sub-menu__title {
        color: #fff !important;
        i {
            color: #fff;
        }
        &:hover {
            background: #0366d6 !important;
        }
        height: 64px !important;
    }
}
.c-quick-menu__submenu {
    .el-menu {
        min-width: 150px;
    }
    .u-menu-item,
    .u-item {
        display: block;
        color: @color;
    }
    .el-menu-item {
        min-width: 150px;
        &:hover {
            background-color: #e6f0fb;

            .el-sub-menu__title {
                background-color: #e6f0fb;
            }
        }
    }
    // .el-menu--horizontal {
    //     .el-menu-item {
    //         text-align: center;
    //     }
    // }
}
.c-header-nav--pad {
    .none;
    .c-quick-menu {
        border-bottom: none;
    }
}
// @media screen and (max-width: @ipad) {
//     .c-header-nav--pc {
//         display: none;
//     }
//     .c-header-nav--pad {
//         display: block;
//     }
// }
// @media screen and (max-width: @ipad-y) {
//     .c-header-nav--pad {
//         display: none;
//     }
// }
@media screen and (max-width: @mininote) {
    .c-header-nav {
        display: none;
    }
}
</style>
