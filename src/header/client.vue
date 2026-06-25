<template>
    <div class="c-header-client" ref="dropdown">
        <!-- 当前选择展示 (触发器) -->
        <button
            type="button"
            class="u-trigger"
            :class="{ 'is-active': isMenuOpen }"
            @click="toggleMenu"
            :aria-expanded="isMenuOpen"
            aria-haspopup="true"
        >
            <div class="u-client--current">
                <span>{{ currentGameLabel }}</span>
                <svg
                    class="u-arrow"
                    :class="{ 'is-open': isMenuOpen }"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
        </button>

        <!-- 下拉菜单内容 -->
        <div
            class="u-menu"
            :class="{
                'is-open': isMenuOpen
            }"
            role="menu"
        >
            <div class="u-menu__title">
                {{ $jx3boxT("jx3boxUi.commonHeader.chooseGameVersion", "选择游戏版本") }}
            </div>

            <!-- 剑网3 -->
            <a
                href="javascript:void(0)"
                class="u-menu__item"
                role="menuitem"
                @click.prevent="switchGame('std')"
            >
                <div class="u-game">
                    <span class="u-game__icon u-game__icon--std">
                        <img
                            svg-inline
                            src="../../assets/img/common/jx3-www.svg"
                            :alt="$jx3boxT('jx3boxUi.commonHeader.jx3Full', '剑网3 / 无界')"
                        />
                    </span>
                    <div class="u-game__text">
                        <div class="u-game__name">
                            {{ $jx3boxT("jx3boxUi.commonHeader.jx3Full", "剑网3 / 无界") }}
                        </div>
                        <div class="u-game__host">www.jx3box.com</div>
                    </div>
                </div>
                <span class="u-dot" :class="{ 'is-hidden': activeKey !== 'std' }"></span>
            </a>

            <!-- 缘起 -->
            <a
                href="javascript:void(0)"
                class="u-menu__item"
                role="menuitem"
                @click.prevent="switchGame('origin')"
            >
                <div class="u-game">
                    <span class="u-game__icon u-game__icon--origin">
                        <img
                            svg-inline
                            src="../../assets/img/common/jx3-origin.svg"
                            :alt="$jx3boxT('jx3boxUi.commonHeader.originFull', '剑网3·缘起')"
                        />
                    </span>
                    <div class="u-game__text">
                        <div class="u-game__name">
                            {{ $jx3boxT("jx3boxUi.commonHeader.originFull", "剑网3·缘起") }}
                        </div>
                        <div class="u-game__host">origin.jx3box.com</div>
                    </div>
                </div>
                <span class="u-dot" :class="{ 'is-hidden': activeKey !== 'origin' }"></span>
            </a>
        </div>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "clientSwitch",
    mixins: [i18nMixin],
    props: {
        defaultValue: {
            type: String,
            default: "",
        },
    },
    data: function () {
        return {
            activeKey: this.defaultValue || (location.host.includes("origin") ? "origin" : "std"),
            isMenuOpen: false,
        };
    },
    computed: {
        currentGameLabel: function () {
            return this.activeKey === "origin"
                ? this.$jx3boxT("jx3boxUi.commonHeader.originShort", "缘起")
                : this.$jx3boxT("jx3boxUi.commonHeader.jx3Short", "剑网3");
        },
    },
    watch: {
        defaultValue: function (val) {
            if (val) this.activeKey = val;
        },
    },
    methods: {
        toggleMenu: function() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu: function() {
            this.isMenuOpen = false;
        },
        handleClickOutside: function(event) {
            if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
                this.closeMenu();
            }
        },
        switchGame: function (target) {
            if (!target || (target !== "std" && target !== "origin")) return;

            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;
            const currentHash = window.location.hash;
            const protocol = window.location.protocol;

            const targetHost = target === "std" ? "www.jx3box.com" : "origin.jx3box.com";
            const finalUrl = protocol + "//" + targetHost + currentPath + currentSearch + currentHash;

            this.activeKey = target;
            this.closeMenu();
            window.location.href = finalUrl;
        },
    },
    mounted: function () {
        // 监听点击外部区域关闭菜单
        document.addEventListener('click', this.handleClickOutside);
        // 支持触摸设备
        document.addEventListener('touchstart', this.handleClickOutside);
    },
    beforeUnmount: function() {
        // 清理事件监听器
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('touchstart', this.handleClickOutside);
    },
};
</script>

<style lang="less">
/* src/header/client.vue */
.c-header-client {
    .pr;
    height: @header-height;

    * {
        .pointer;
    }

    .u-trigger {
        .pr;
        height: 100%;
        padding: 0 16px;
        .flex(y);
        gap: 8px;
        border: 0;
        background: transparent;
        color: #fff;
        // 为iOS添加触摸反馈
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);

        &::after {
            content: "";
            .db;
            .pa;
            .lb(0);
            .w(90px);
            .h(2px);
            background-color: #e19f3a;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        // 菜单打开时显示激活条
        &.is-active::after {
            opacity: 1;
        }
    }

    .u-client--current {
        background-color: @v4primary500;
        .r(4px);
        padding: 2px 5px;
        .flex(y);
        gap: 4px;
        white-space: nowrap;

        span {
            color: #fff !important;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
        }
        .u-arrow {
            width: 12px;
            height: 12px;
            fill: #fff !important;
            transition: transform 0.3s ease;

            &.is-open {
                transform: rotate(180deg);
            }
        }
    }

    .u-menu {
        .pa;
        top: 100%;
        left: 0;
        z-index: 50;
        width: 224px;
        padding: 8px 0;
        overflow: hidden;
        background: #242424;
        border: 1px solid #374151;
        border-top: 0;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 18px 32px rgba(0, 0, 0, 0.32);
        transform: translateY(-8px);
        transform-origin: top;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;

        &.is-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }
    }

    .u-menu__title {
        padding: 8px 12px;
        margin-bottom: 4px;
        color: #6b7280;
        border-bottom: 1px solid #1f2937;
        font-size: 10px;
        line-height: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .u-menu__item {
        .flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px;
        color: #e5e7eb;
        text-decoration: none;
        transition: background-color 0.2s ease, color 0.2s ease;

        &:hover,
        &:active {
            background-color: rgb(79, 70, 229);
            color: #fff;

            .u-game__name {
                color: #fff;
            }

            .u-game__host {
                color: #c7d2fe;
            }

            .u-game__icon {
                color: #fff;
            }
        }
    }

    .u-game {
        .flex(y);
        min-width: 0;
    }

    .u-game__icon {
        .flex(x);
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        margin-right: 12px;

        &,
        svg,
        img {
            width: 16px !important;
            height: 16px !important;
        }

        svg,
        img {
            display: block;
        }

        &--std {
            color: #818cf8;
        }

        &--origin {
            color: #fbbf24;
        }
    }

    .u-game__text {
        min-width: 0;
    }

    .u-game__name {
        color: #e5e7eb;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        white-space: nowrap;
    }

    .u-game__host {
        color: #6b7280;
        font-size: 10px;
        line-height: 14px;
        white-space: nowrap;
    }

    .u-dot {
        flex: 0 0 auto;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fbbf24;

        &.is-hidden {
            visibility: hidden;
        }
    }
}
</style>
