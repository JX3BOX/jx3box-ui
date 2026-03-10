<template>
    <section class="lg:col-span-4 lg:col-start-9">
        <h3 class="text-sm font-semibold tracking-wide text-white">
            {{ $jx3boxT("jx3boxUi.commonFooter.downloadCenter", "下载中心") }}
        </h3>
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div v-for="item in downloadLinks" :key="item.name">
                <el-popover v-if="item.qrcode" trigger="hover" placement="top" popper-class="c-footer--v4__popover">
                    <div class="flex flex-col items-center p-3">
                        <img
                            class="h-32 w-32 rounded-md object-cover"
                            :src="item.qrcode"
                            :alt="getDownloadName(item)"
                        />
                        <span class="mt-2 text-xs font-black">{{ getDownloadLabel(item) }}</span>
                    </div>
                    <template #reference>
                        <a
                            class="flex h-12 items-center rounded-xl border border-gray-700 bg-gray-800 px-4 text-xs text-gray-300 transition hover:border-blue-500 hover:bg-gray-700"
                            :href="item.href || '#'"
                            :target="item.href ? '_blank' : null"
                            :rel="item.href ? 'noopener noreferrer' : null"
                            @click="handleLinkClick($event, item)"
                        >
                            <span class="mr-2.5 flex h-4 w-4 items-center justify-center">
                                <img class="h-4 w-4" :src="item.icon" :alt="getDownloadName(item)" />
                            </span>
                            <span>{{ getDownloadName(item) }}</span>
                        </a>
                    </template>
                </el-popover>
                <el-popover
                    v-else-if="item.placeholder"
                    trigger="hover"
                    placement="top"
                    :show-after="150"
                    popper-class="c-footer--v4__popover"
                >
                    <div class="p-3 text-center text-xs font-semibold">
                        {{ item.placeholder }}
                    </div>
                    <template #reference>
                        <a
                            class="flex h-12 items-center rounded-xl border border-gray-700 bg-gray-800 px-4 text-xs text-gray-300 transition hover:border-blue-500 hover:bg-gray-700"
                            :href="item.href || '#'"
                            :target="item.href ? '_blank' : null"
                            :rel="item.href ? 'noopener noreferrer' : null"
                            @click="handleLinkClick($event, item)"
                        >
                            <span class="mr-2.5 flex h-4 w-4 items-center justify-center">
                                <img class="h-4 w-4" :src="item.icon" :alt="getDownloadName(item)" />
                            </span>
                            <span>{{ getDownloadName(item) }}</span>
                        </a>
                    </template>
                </el-popover>
                <a
                    v-else
                    class="flex h-12 items-center rounded-xl border border-gray-700 bg-gray-800 px-4 text-xs text-gray-300 transition hover:border-blue-500 hover:bg-gray-700"
                    :href="item.href || '#'"
                    :target="item.href ? '_blank' : null"
                    :rel="item.href ? 'noopener noreferrer' : null"
                    @click="handleLinkClick($event, item)"
                >
                    <span class="mr-2.5 flex h-4 w-4 items-center justify-center">
                        <img class="h-4 w-4" :src="item.icon" :alt="getDownloadName(item)" />
                    </span>
                    <span>{{ getDownloadName(item) }}</span>
                </a>
            </div>
        </div>

        <div
            class="mt-4 flex items-center justify-between rounded-xl border p-4"
            style="
                border-color: rgba(59, 130, 246, 0.2);
                background-image: linear-gradient(90deg, rgba(30, 64, 175, 0.2), rgba(31, 41, 55, 0.4));
            "
        >
            <div class="flex items-center space-x-3">
                <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg text-blue-400"
                    style="background-color: rgba(59, 130, 246, 0.2)"
                >
                    <img
                        class="h-6 w-6"
                        svg-inline
                        src="../../assets/img/common/qqbot.svg"
                        :alt="$jx3boxT('jx3boxUi.commonFooter.qqBot', 'QQ机器人')"
                    />
                </div>
                <div @click="copyText('3889010020')" class="cursor-pointer">
                    <p class="font-bold uppercase tracking-wider text-gray-500" style="font-size: 10px">
                        {{ $jx3boxT("jx3boxUi.commonFooter.qqBotService", "QQ 机器人服务") }}
                    </p>
                    <p class="mt-1 font-mono text-sm font-semibold text-white">3889 010 020</p>
                </div>
            </div>
            <a
                class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
                href="tencent://AddContact/?uin=3889010020&Site=www.jx3box.com&Menu=yes"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ $jx3boxT("jx3boxUi.commonFooter.add", "添加") }}
            </a>
        </div>
    </section>
</template>

<script>
import { copyText } from "../../utils";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "FooterResource",
    mixins: [i18nMixin],
    props: [],
    components: {},
    data: function () {
        return {
            downloadLinks: [
                {
                    key: "appStore",
                    name: "App Store",
                    href: "",
                    icon: require("../../assets/img/common/ios.svg"),
                    // qrcode: require("../../assets/img/common/ios.jpg"),
                    placeholder: "即将上线",
                },
                {
                    key: "android",
                    name: "Android",
                    href: "",
                    icon: require("../../assets/img/common/android.svg"),
                    // qrcode: require("../../assets/img/common/android.jpg"),
                    placeholder: "即将上线",
                },
                {
                    key: "harmonyNext",
                    name: "鸿蒙 NEXT",
                    href: "",
                    icon: require("../../assets/img/common/harmony.svg"),
                    // qrcode: require("../../assets/img/common/harmony.jpg"),
                    placeholder: "即将上线",
                },
                {
                    key: "miniProgram",
                    name: "小程序",
                    labelKey: "jx3boxHelper",
                    label: "JX3BOX小助手",
                    href: "",
                    icon: require("../../assets/img/common/miniprogram.svg"),
                    qrcode: require("../../assets/img/common/miniprogram.jpg"),
                },
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {
        copyText,
        getDownloadName(item) {
            if (item?.key) {
                const k = item.key === "harmonyNext" ? "harmonyNext" : item.key;
                const maybe = `jx3boxUi.commonFooter.${k}`;
                return this.$jx3boxT(maybe, item.name || k);
            }
            return item?.name || "";
        },
        getDownloadLabel(item) {
            if (item?.labelKey) return this.$jx3boxT(`jx3boxUi.commonFooter.${item.labelKey}`, item.label || item.labelKey);
            return item?.label || "";
        },
        handleLinkClick(e, item) {
            if (!item?.href) e.preventDefault();
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>
