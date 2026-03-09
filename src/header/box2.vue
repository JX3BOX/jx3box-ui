<template>
    <transition name="box2-fade">
        <div v-if="status" class="c-jx3box2-mask" @click="closeBox">
            <section class="c-jx3box2" @click.stop>
                <div class="u-topline"></div>

                <div class="u-head">
                    <div class="u-title-wrap">
                        <div class="u-logo">
                            <img svg-inline src="../../assets/img/common/logo.svg" alt="JX3BOX" />
                        </div>
                        <div>
                            <h2 class="u-title">魔盒矩阵</h2>
                            <p class="u-subtitle">THE BOX MATRIX NAVIGATION</p>
                        </div>
                    </div>
                    <div class="u-search">
                        <i class="el-icon-search u-search-icon"></i>
                        <input v-model.trim="searchQuery" class="u-search-input" type="text" placeholder="搜索应用" />
                        <button v-if="searchQuery" class="u-search-clear" type="button" @click="searchQuery = ''">
                            <i class="el-icon-close"></i>
                        </button>
                    </div>
                </div>

                <div class="u-body">
                    <ul class="u-list">
                        <li v-if="homeMatched">
                            <a class="u-item" href="/index">
                                <div class="u-icon-wrap">
                                    <img class="u-pic" svg-inline :src="homeicon" />
                                </div>
                                <span class="u-txt">{{ $jx3boxT("jx3boxUi.header.home", "首页") }}</span>
                            </a>
                        </li>
                        <li v-for="(item, i) in filteredList" :key="i">
                            <a class="u-item" :href="item.href" :target="getTarget(item.href)">
                                <div class="u-icon-wrap">
                                    <img class="u-pic" :src="getBoxIcon(item.img)" />
                                </div>
                                <span class="u-txt">{{ item.abbr }}</span>
                            </a>
                        </li>
                        <li v-if="allMatched && filteredList.length > 0">
                            <a class="u-item" href="/app">
                                <div class="u-icon-wrap">
                                    <img class="u-pic" svg-inline :src="allicon" />
                                </div>
                                <span class="u-txt">{{ $jx3boxT("jx3boxUi.header.all", "全部") }}</span>
                            </a>
                        </li>
                    </ul>
                    <div v-if="searchQuery && !homeMatched && filteredList.length === 0" class="u-empty">
                        未找到匹配应用
                    </div>
                </div>
            </section>
        </div>
    </transition>
</template>

<script>
import Bus from "../../utils/bus";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
import box from "../../assets/data/box.json";
import { getMenu } from "../../service/header.js";
import axios from "axios";
import { flatten } from "lodash";

const { __cdn, __imgPath } = JX3BOX;

export default {
    name: "Box2",
    mixins: [i18nMixin],
    data: function () {
        return {
            status: false,
            searchQuery: "",
            data: [],
            client: location.href.includes("origin") ? "origin" : "std",
        };
    },
    computed: {
        homeicon: function () {
            return this.getBoxIcon("home.svg");
        },
        allicon: function () {
            return this.getBoxIcon("more.svg");
        },
        list: function () {
            return this.data.filter((item) => {
                const currentClient = String(this.client || "").toLowerCase();
                const rawClient = item.client;
                const matchedClient = !rawClient
                    ? true
                    : Array.isArray(rawClient)
                    ? rawClient.map((c) => String(c || "").toLowerCase()).includes(currentClient)
                    : String(rawClient || "").toLowerCase().includes(currentClient);
                return matchedClient;
            });
        },
        filteredList: function () {
            const query = (this.searchQuery || "").toLowerCase();
            if (!query) return this.list;

            const compactQuery = query.replace(/\s+/g, "");
            return this.list.filter((item) => {
                const abbr = String(item.abbr || "").toLowerCase();
                const abbrCompact = abbr.replace(/\s+/g, "");
                const uuid = String(item.uuid || "").toLowerCase();
                return abbr.includes(query) || abbrCompact.includes(compactQuery) || uuid.includes(query);
            });
        },
        homeMatched: function () {
            const query = (this.searchQuery || "").toLowerCase().trim();
            if (!query) return true;
            return this.$jx3boxT("jx3boxUi.header.home", "首页").includes(query);
        },
        allMatched: function () {
            const query = (this.searchQuery || "").toLowerCase().trim();
            if (!query) return true;
            return this.$jx3boxT("jx3boxUi.header.all", "全部").includes(query);
        },
    },
    methods: {
        setPageScrollLock(locked) {
            const docEl = document.documentElement;
            const body = document.body;

            if (locked) {
                if (this.__prevHtmlOverflow === undefined) {
                    this.__prevHtmlOverflow = docEl.style.overflow;
                }
                if (this.__prevBodyOverflow === undefined) {
                    this.__prevBodyOverflow = body.style.overflow;
                }
                docEl.style.overflow = "hidden";
                body.style.overflow = "hidden";
            } else {
                docEl.style.overflow = this.__prevHtmlOverflow ?? "";
                body.style.overflow = this.__prevBodyOverflow ?? "";
                this.__prevHtmlOverflow = undefined;
                this.__prevBodyOverflow = undefined;
            }
        },
        closeBox() {
            this.status = false;
        },
        getBoxIcon(val) {
            val = val && val?.replace(".png", ".svg");
            return __cdn + "logo/logo-dark/" + val;
        },
        getTarget(val) {
            if (window.innerWidth < 768 || val?.startsWith("/")) {
                return "_self";
            } else {
                return "_blank";
            }
        },
        loadMenu() {
            try {
                const data = JSON.parse(sessionStorage.getItem("box"));
                if (data) {
                    this.data = data;
                } else {
                    axios.get(__imgPath + "logo/app.json").then((res) => {
                        const _data = flatten(Object.values(res.data || {}));
                        this.data = _data.map((item) => ({
                            img: item.key + ".svg",
                            uuid: item.key,
                            abbr: item.label,
                            href: item.link,
                            client: item.client || ["std", "origin"],
                        }));

                        if (!this.data.length) this.data = box;
                        sessionStorage.setItem("box", JSON.stringify(this.data));
                    });
                }
            } catch (e) {
                this.data = box;
            }
        },
        onEsc(e) {
            if (e.key === "Escape") {
                this.closeBox();
            }
        },
    },
    created() {
        this.loadMenu();
    },
    mounted() {
        this.__toggleHandler = (status) => {
            if (status === undefined) {
                this.status = !this.status;
            } else {
                this.status = !!status;
            }
        };
        Bus.on("toggleBox", this.__toggleHandler);
        window.addEventListener("keydown", this.onEsc);
    },
    beforeUnmount() {
        if (this.__toggleHandler) {
            Bus.off("toggleBox", this.__toggleHandler);
            this.__toggleHandler = null;
        }
        window.removeEventListener("keydown", this.onEsc);
        this.setPageScrollLock(false);
    },
    watch: {
        status(val) {
            this.setPageScrollLock(!!val);
        },
    },
};
</script>

<style lang="less">
.c-jx3box2-mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1200;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}
@media screen and (max-width: @phone) {
    .c-jx3box2-mask {
        display: none;
    }
}

.box2-fade-enter-active,
.box2-fade-leave-active {
    transition: opacity 0.25s ease;
}

.box2-fade-enter-active .c-jx3box2,
.box2-fade-leave-active .c-jx3box2 {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.box2-fade-enter-from,
.box2-fade-leave-to {
    opacity: 0;
}

.box2-fade-enter-from .c-jx3box2,
.box2-fade-leave-to .c-jx3box2 {
    transform: translateY(16px) scale(0.96);
    opacity: 0;
}

.c-jx3box2 {
    position: relative;
    width: min(1120px, calc(100vw - 40px));
    max-height: min(860px, calc(100vh - 40px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 36px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(21, 25, 35, 0.9);
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.45);
}

.c-jx3box2 {
    .u-topline {
        height: 6px;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
    }

    .u-head {
        padding: 28px 32px 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .u-title-wrap {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .u-logo {
        width: 46px;
        height: 46px;
        border-radius: 14px;
        background: #fff;
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.38);
        padding:5px;
    }

    .u-title {
        margin: 0;
        color: #fff;
        font-size: 28px;
        line-height: 1.1;
        font-weight: 800;
    }

    .u-subtitle {
        margin: 6px 0 0;
        color: #60a5fa;
        font-size: 10px;
        letter-spacing: 0.26em;
        font-weight: 700;
    }

    .u-search {
        width: min(460px, 100%);
        margin-left: auto;
        position: relative;
    }

    .u-search-input {
        width: 100%;
        height: 48px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        outline: none;
        padding: 0 40px 0 40px;
        box-sizing: border-box;
        transition: all 0.2s ease;
    }

    .u-search-input::placeholder {
        color: #6b7280;
    }

    .u-search-input:focus {
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
    }

    .u-search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        font-size: 16px;
    }

    .u-search-clear {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        border: 0;
        background: transparent;
        color: #798192;
        cursor: pointer;
    }

    .u-search-clear:hover {
        color: #fff;
    }

    .u-body {
        padding: 4px 32px 24px;
        flex: 1;
        min-height: 360px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .u-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        gap: 14px;
        align-content: start;
    }

    .u-item {
        height: 116px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.07);
        text-decoration: none;
        transition: all 0.25s ease;
    }

    .u-item:hover {
        transform: translateY(-4px);
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.12);
        box-shadow: 0 14px 26px -12px rgba(0, 0, 0, 0.55), 0 0 16px rgba(59, 130, 246, 0.2);
    }

    .u-icon-wrap {
        width: 54px;
        height: 54px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
    }

    .u-item:hover .u-icon-wrap {
        background: rgba(37, 99, 235, 0.18);
    }

    .u-pic {
        width: 30px;
        height: 30px;
        object-fit: contain;
    }

    .u-txt {
        margin-top: 10px;
        font-size: 12px;
        color: #a8b0be;
        line-height: 1.2;
    }

    .u-item:hover .u-txt {
        color: #fff;
    }

    .u-empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8b95a7;
        font-size: 13px;
    }

    .u-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 32px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        background: rgba(0, 0, 0, 0.24);
    }

    .u-foot-left {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 10px;
        letter-spacing: 0.2em;
        color: #9ba3b2;
        font-weight: 600;
    }

    .u-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #3b82f6;
    }

    .u-close {
        border: 0;
        background: transparent;
        color: #9ba3b2;
        font-size: 11px;
        letter-spacing: 0.12em;
        cursor: pointer;
    }

    .u-close:hover {
        color: #fff;
    }

    @media screen and (max-width: 1200px) {
        .u-list {
            grid-template-columns: repeat(6, minmax(0, 1fr));
        }
    }

    @media screen and (max-width: 992px) {
        .u-list {
            grid-template-columns: repeat(5, minmax(0, 1fr));
        }
    }
}
</style>
