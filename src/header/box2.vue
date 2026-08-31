<template>
    <transition name="box2-fade">
        <div v-if="status" class="c-jx3box2-mask">
            <section class="c-jx3box2" @click.stop>
                <div class="u-body">
                    <ul class="u-list">
                        <li>
                            <a class="u-item" href="/index">
                                <div class="u-icon-wrap">
                                    <img class="u-pic" svg-inline :src="homeicon" />
                                </div>
                                <span class="u-txt">{{ $jx3boxT("jx3boxUi.commonHeader.home", "首页") }}</span>
                            </a>
                        </li>
                        <li v-for="(item, i) in list" :key="i">
                            <a class="u-item" :href="item.href" :target="getTarget(item.href)">
                                <div class="u-icon-wrap">
                                    <img class="u-pic" :src="getBoxIcon(item.img)" />
                                </div>
                                <span class="u-txt">{{ item.abbr }}</span>
                            </a>
                        </li>
                        <li v-if="list.length > 0">
                            <a class="u-item" href="/app">
                                <div class="u-icon-wrap">
                                    <img class="u-pic" svg-inline :src="allicon" />
                                </div>
                                <span class="u-txt">{{ $jx3boxT("jx3boxUi.commonHeader.all", "全部") }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="u-actions">
                    <button class="u-collapse" type="button" @click="closeBox">
                        <el-icon><Upload /></el-icon>
                        <span>{{ $jx3boxT("jx3boxUi.commonHeader.collapse", "收起") }}</span>
                    </button>
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
import { loadBoxMenu } from "./box-menu";

const { __cdn } = JX3BOX;

export default {
    name: "Box2",
    mixins: [i18nMixin],
    data: function () {
        return {
            status: false,
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
                const clients = !rawClient
                    ? []
                    : Array.isArray(rawClient)
                    ? rawClient.map((c) => String(c || "").toLowerCase())
                    : String(rawClient || "")
                          .split(",")
                          .map((c) => String(c || "").trim().toLowerCase())
                          .filter(Boolean);
                const matchedClient =
                    !clients.length || clients.includes("all") || clients.includes(currentClient);
                return matchedClient;
            });
        },
    },
    methods: {
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
            loadBoxMenu(box).then((data) => {
                this.data = data;
            });
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
        this.__docClickHandler = () => this.closeBox();
        document.addEventListener("click", this.__docClickHandler);
        window.addEventListener("keydown", this.onEsc);
    },
    beforeUnmount() {
        if (this.__toggleHandler) {
            Bus.off("toggleBox", this.__toggleHandler);
            this.__toggleHandler = null;
        }
        if (this.__docClickHandler) {
            document.removeEventListener("click", this.__docClickHandler);
            this.__docClickHandler = null;
        }
        window.removeEventListener("keydown", this.onEsc);
    },
};
</script>

<style lang="less">
/* src/header/box2.vue */
.c-jx3box2-mask {
    position: fixed;
    left: 0;
    top: @header-height;
    z-index: 800;
    width: 100%;
    max-height: calc(100vh - @header-height);
    overflow: hidden;
    background: rgba(21, 25, 35, 0.98);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.36);
}
@media screen and (max-width: @phone) {
    .c-jx3box2-mask {
        display: none;
    }
}

.box2-fade-enter-active,
.box2-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.box2-fade-enter-from,
.box2-fade-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

.c-jx3box2 {
    position: relative;
    width: 100%;
    max-height: calc(100vh - @header-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: transparent;
}

.c-jx3box2 {
    .u-body {
        width: 100%;
        margin: 0;
        box-sizing: border-box;
        padding: 16px 24px 22px;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .u-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
        gap: 10px;
        align-content: start;
    }

    .u-item {
        height: 88px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.07);
        text-decoration: none;
        transition: all 0.25s ease;
    }

    .u-item:hover {
        transform: translateY(-2px);
        border-color: fade(@v4primary500, 50%);
        background: fade(@v4primary500, 12%);
        box-shadow: 0 14px 26px -12px rgba(0, 0, 0, 0.55), 0 0 16px fade(@v4primary500, 20%);
    }

    .u-icon-wrap {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
    }

    .u-item:hover .u-icon-wrap {
        background: fade(@v4primary, 18%);
    }

    .u-pic {
        width: 26px;
        height: 26px;
        object-fit: contain;
    }

    .u-txt {
        margin-top: 7px;
        font-size: 12px;
        color: #a8b0be;
        line-height: 1.2;
    }

    .u-item:hover .u-txt {
        color: #fff;
    }

    .u-actions {
        width: 100%;
        margin: 0;
        padding: 0 24px 14px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
    }

    .u-collapse {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 7px 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.06);
        color: #a8b0be;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .u-collapse:hover {
        border-color: fade(@v4primary500, 45%);
        background: fade(@v4primary500, 14%);
        color: #fff;
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
        background: @v4primary500;
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
            grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
        }
    }

    @media screen and (max-width: 992px) {
        .u-list {
            grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));
        }
    }
}
</style>
