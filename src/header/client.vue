<template>
    <div class="c-header-client relative h-full group">
        <!-- 当前选择展示 (触发器) -->
        <button type="button" class="u-trigger h-full px-4 flex items-center gap-2 transition-colors duration-200">
            <div class="u-client--current">
                <span class="text-sm font-medium text-gray-200">{{ currentGameLabel }}</span>
                <svg
                    class="w-3 h-3 text-gray-400 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
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
            class="absolute top-full left-0 w-56 bg-[#242424] border border-gray-700 rounded-b-lg shadow-2xl py-2 overflow-hidden z-50 transition duration-200 ease-out origin-top opacity-0 -translate-y-2 invisible pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:visible group-focus-within:pointer-events-auto"
            role="menu"
        >
            <div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800 mb-1">
                选择游戏版本
            </div>

            <!-- 剑网3 -->
            <a
                href="javascript:void(0)"
                class="flex items-center justify-between px-4 py-3 hover:bg-indigo-600 transition-colors group/item"
                role="menuitem"
                @click.prevent="switchGame('std')"
            >
                <div class="flex items-center">
                    <span class="mr-3 text-indigo-400 group-hover/item:text-white">
                        <!-- <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M4 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
                            <path d="M4 13a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Z" />
                        </svg> -->
                        <img class="w-4 h-4" svg-inline src="../../assets/img/common/jx3-www.svg" alt="剑网3/无界">
                        <!-- <Jx3Icon class="w-4 h-4" /> -->
                    </span>
                    <div>
                        <div class="text-sm font-bold text-gray-200 group-hover/item:text-white">剑网3 / 无界</div>
                        <div class="text-[10px] text-gray-500 group-hover/item:text-indigo-200">www.jx3box.com</div>
                    </div>
                </div>
                <span class="h-2 w-2 bg-amber-400 rounded-full" :class="{ hidden: activeKey !== 'std' }"></span>
            </a>

            <!-- 缘起 -->
            <a
                href="javascript:void(0)"
                class="flex items-center justify-between px-4 py-3 hover:bg-indigo-600 transition-colors group/item"
                role="menuitem"
                @click.prevent="switchGame('origin')"
            >
                <div class="flex items-center">
                    <span class="mr-3 text-amber-400 group-hover/item:text-white">
                        <!-- <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-12.25a.75.75 0 0 0-1.5 0V10c0 .2.08.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06l-2.28-2.28V5.75Z"
                                clip-rule="evenodd"
                            />
                        </svg> -->
                        <img class="w-4 h-4" svg-inline src="../../assets/img/common/jx3-origin.svg" alt="剑网3·缘起">
                        <!-- <OriginIcon class="w-4 h-4" /> -->
                    </span>
                    <div>
                        <div class="text-sm font-bold text-gray-200 group-hover/item:text-white">剑网3·缘起</div>
                        <div class="text-[10px] text-gray-500 group-hover/item:text-indigo-200">origin.jx3box.com</div>
                    </div>
                </div>
                <span class="h-2 w-2 bg-amber-400 rounded-full" :class="{ hidden: activeKey !== 'origin' }"></span>
            </a>
        </div>
    </div>
</template>

<script>
// import Jx3Icon from "@/assets/img/components/common/header/jx3-www.svg";
// import OriginIcon from "@/assets/img/components/common/header/jx3-origin.svg";
export default {
    name: "clientSwitch",
    components: {
        // Jx3Icon,
        // OriginIcon,
    },
    props: ["defaultValue"],
    data: function () {
        return {
            activeKey: this.defaultValue || (location.host.includes("origin") ? "origin" : "std"),
        };
    },
    computed: {
        currentGameLabel: function () {
            return this.activeKey === "origin" ? "缘起" : "剑网3";
        },
    },
    watch: {
        defaultValue: function (val) {
            if (val) this.activeKey = val;
        },
    },
    methods: {
        switchGame: function (target) {
            if (!target || (target !== "std" && target !== "origin")) return;

            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;
            const currentHash = window.location.hash;
            const protocol = window.location.protocol;

            const targetHost = target === "std" ? "www.jx3box.com" : "origin.jx3box.com";
            const finalUrl = protocol + "//" + targetHost + currentPath + currentSearch + currentHash;

            this.activeKey = target;
            window.location.href = finalUrl;
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
.c-header-client {
    .u-trigger {
        .pr;
    }
    &:hover {
        .u-trigger::after {
            content: "";
            .db;
            .pa;
            .lb(0);
            .w(90px);
            .h(2px);
            background-color: #e19f3a;
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
}
</style>
