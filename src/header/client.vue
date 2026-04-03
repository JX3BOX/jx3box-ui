<template>
    <div class="relative h-full c-header-client" ref="dropdown">
        <!-- 当前选择展示 (触发器) -->
        <button
            type="button"
            class="u-trigger h-full px-4 flex items-center gap-2 transition-colors duration-200"
            :class="{ 'is-active': isMenuOpen }"
            @click="toggleMenu"
            :aria-expanded="isMenuOpen"
            aria-haspopup="true"
        >
            <div class="u-client--current">
                <span class="text-sm font-medium text-gray-200">{{ currentGameLabel }}</span>
                <svg
                    class="w-3 h-3 text-gray-400 transition-transform duration-300"
                    :class="{ 'rotate-180': isMenuOpen }"
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
            class="absolute top-full left-0 w-56 bg-[#242424] border border-gray-700 rounded-b-lg shadow-2xl py-2 overflow-hidden z-50 transition duration-200 ease-out origin-top"
            :class="{
                'opacity-100 translate-y-0 visible pointer-events-auto': isMenuOpen,
                'opacity-0 -translate-y-2 invisible pointer-events-none': !isMenuOpen
            }"
            role="menu"
        >
            <div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800 mb-1">
                {{ $jx3boxT("jx3boxUi.commonHeader.chooseGameVersion", "选择游戏版本") }}
            </div>

            <!-- 剑网3 -->
            <a
                href="javascript:void(0)"
                class="flex items-center justify-between px-4 py-3 hover:bg-indigo-600 active:bg-indigo-700 transition-colors group/item"
                role="menuitem"
                @click.prevent="switchGame('std')"
            >
                <div class="flex items-center">
                    <span class="mr-3 text-indigo-400 group-hover/item:text-white">
                        <img
                            class="w-4 h-4"
                            svg-inline
                            src="../../assets/img/common/jx3-www.svg"
                            :alt="$jx3boxT('jx3boxUi.commonHeader.jx3Full', '剑网3 / 无界')"
                        />
                    </span>
                    <div>
                        <div class="text-sm font-bold text-gray-200 group-hover/item:text-white">
                            {{ $jx3boxT("jx3boxUi.commonHeader.jx3Full", "剑网3 / 无界") }}
                        </div>
                        <div class="text-[10px] text-gray-500 group-hover/item:text-indigo-200">www.jx3box.com</div>
                    </div>
                </div>
                <span class="h-2 w-2 bg-amber-400 rounded-full" :class="{ hidden: activeKey !== 'std' }"></span>
            </a>

            <!-- 缘起 -->
            <a
                href="javascript:void(0)"
                class="flex items-center justify-between px-4 py-3 hover:bg-indigo-600 active:bg-indigo-700 transition-colors group/item"
                role="menuitem"
                @click.prevent="switchGame('origin')"
            >
                <div class="flex items-center">
                    <span class="mr-3 text-amber-400 group-hover/item:text-white">
                        <img
                            class="w-4 h-4"
                            svg-inline
                            src="../../assets/img/common/jx3-origin.svg"
                            :alt="$jx3boxT('jx3boxUi.commonHeader.originFull', '剑网3·缘起')"
                        />
                    </span>
                    <div>
                        <div class="text-sm font-bold text-gray-200 group-hover/item:text-white">
                            {{ $jx3boxT("jx3boxUi.commonHeader.originFull", "剑网3·缘起") }}
                        </div>
                        <div class="text-[10px] text-gray-500 group-hover/item:text-indigo-200">origin.jx3box.com</div>
                    </div>
                </div>
                <span class="h-2 w-2 bg-amber-400 rounded-full" :class="{ hidden: activeKey !== 'origin' }"></span>
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
    .u-trigger {
        .pr;
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

    // 桌面端保留hover效果
    @media (hover: hover) and (pointer: fine) {
        &:hover .u-trigger::after {
            opacity: 1;
        }
    }
    height: @header-height;
    * {
        .pointer;
    }

    .u-client--current {
        background-color: @v4primary500;
        .r(4px);
        padding: 2px 5px;
        .flex(y);

        span {
            color: #fff !important;
        }
        svg {
            fill: #fff !important;
        }
    }

    // 为iOS添加active状态样式
    a[role="menuitem"]:active {
        background-color: rgb(79, 70, 229) !important;
    }
}
</style>
