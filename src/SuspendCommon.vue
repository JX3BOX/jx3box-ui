<!--
 * @Author: zhusha
 * @Date: 2025-05-13 10:00:27
 * @LastEditors: zhusha
 * @LastEditTime: 2025-05-20 17:53:49
 * @Description: 悬浮窗组件
 * 关于搜索跳转的问题：如果项目需要跳转微信原生界面，需要引入微信sdk，并使用微信提供的api进行跳转
 <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>  版本可根据需要查询微信官方文档
 然后在需要跳转的地方使用以下代码进行跳转
 例如： wx.miniProgram.navigateTo({ url: "/pages/search/search-detail/search-detail?" + params });
 params为跳转的参数，需要根据项目实际情况进行修改，且需转为&连接的字符串形式，例如： "keyword=1&type=2"，可参考以下函数
 miniprogramParams() {
    const params = [];
    for (const key in this.miniprogram) {
        if (this.miniprogram.hasOwnProperty(key)) {
            // params.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.miniprogram[key]));
            params.push(encodeURIComponent(key) + '=' + this.miniprogram[key]);
        }
    }
    return params.join('&');
}
 *
 * Copyright (c) 2025 by zhusha, email: no email, All Rights Reserved.
-->
<template>
    <div class="p-suspend">
        <!-- 初始按钮及配置 -->
        <div class="m-home-box" v-if="btnConfig.showHome">
            <div class="m-base">
                <!-- // TODO自定义展现基础插槽 -->
                <slot></slot>
            </div>
            <div class="m-more" v-if="btnConfig.showMore" @click="setMore">
                <!--                <img class="u-icon" src="../assets/img/suspend/more.svg" svg-inline /> -->
                更多
            </div>
        </div>
        <!-- 样式分类（icon&more） -->
        <div class="m-icon-box" v-if="btnConfig.showIcon && !btnConfig.showHome">
            <div class="m-btn-box">
                <!--        搜索按钮-->
                <div v-if="btnConfig.showSearch" class="u-icon-d" @click="search">
                    <img class="u-icon" src="../assets/img/suspend/search.svg" svg-inline />
                </div>
                <!--        固定按钮-->
                <div
                    v-if="btnConfig.showFixed"
                    class="u-icon-d"
                    @click="clickDrawer({ type: 'pin', text: '固定按钮' }, 1)"
                >
                    <img
                        class="u-icon active"
                        src="../assets/img/suspend/pin_touchbar_24.svg"
                        svg-inline
                        v-if="!fixIsActive"
                    />
                    <img class="u-icon active" src="../assets/img/suspend/pin_slash_24.svg" svg-inline v-else />
                </div>
                <!--        收藏按钮-->
                <div
                    v-if="btnConfig.showCollect"
                    class="u-icon-d"
                    @click="clickDrawer({ type: 'collect', text: '收藏' }, 1)"
                >
                    <img class="u-icon active" src="../assets/img/suspend/collect.svg" svg-inline v-if="!isCollect" />
                    <img class="u-icon active" src="../assets/img/suspend/collect_slash.svg" svg-inline v-else />
                </div>
                <!-- 稍后在看 -->
                <div v-if="btnConfig.showLaterOn" class="u-icon-d" @click="laterOn">
                    <img class="u-icon" src="../assets/img/suspend/later-on.svg" svg-inline />
                </div>
            </div>
            <div class="m-more" v-if="btnConfig.showMore" @click="setMore">
                <!--                <img class="u-icon" src="../assets/img/suspend/more.svg" svg-inline /> -->
                更多
            </div>
        </div>
        <!-- 横向固定内容区域 -->
        <div class="m-pin-box" v-if="btnConfig.showPin && !btnConfig.showHome && !btnConfig.showIcon">
            <div class="u-item" v-for="(item, index) in fixList" :key="'fix' + index">
                <div class="u-text-r" v-if="item.type == 'text'">
                    {{ item.title.match(/[\u3400-\u9FFF\uF900-\uFAFF]/)?.[0] || "固" }}
                </div>
                <img :src="item.imgUrl" class="u-icon" v-else />
            </div>
            <!-- 不足三个时显示空位，只在编辑界面显示 -->
            <div class="u-item" v-for="(item, index) in 3 - fixList.length" :key="'fix_no' + index">
                <img src="../assets/img/suspend/circle.svg" svg-inline class="u-icon" />
            </div>
        </div>
        <!-- 抽屉弹出层，支持默认样式和自定义插槽样式 -->
        <el-drawer
            :title="drawerConfig.drawerTitle"
            v-model="drawer"
            :direction="drawerConfig.direction"
            :with-header="false"
            custom-class="u-drawer"
            modal-class="p-drawer-suspend"
            :modal-append-to-body="false"
            append-to-body
            @close="areaKey = 'home'"
        >
            <div class="p-drawer-suspend_box p-bt-transition" v-show="areaKey === 'home'">
                <div class="u-drawer-box">
                    <div
                        class="u-item top"
                        v-for="item in drawerFiltration(drawerType.one)"
                        :key="item.type"
                        @click="clickDrawer(item)"
                    >
                        <div class="u-icon" v-if="item.icon || item.icon_slash">
                            <img
                                :src="item.type == 'pin' ? (fixIsActive ? item.icon_slash : item.icon) : item.icon"
                                svg-inline
                            />
                        </div>
                        <div class="u-self" v-if="item.isSlot">
                            <!-- 三个圆堆叠式展示 -->
                            <div class="u-circle-top">
                                <div v-if="fixList?.[0]">
                                    <div class="u-text-r" v-if="fixList?.[0]?.type == 'text'">
                                        {{ fixList?.[0]?.title.match(/[\u3400-\u9FFF\uF900-\uFAFF]/)?.[0] || "固" }}
                                    </div>
                                    <img :src="fixList?.[0]?.imgUrl" class="u-icon" v-else />
                                </div>
                                <img src="../assets/img/suspend/circle.svg" svg-inline v-else />
                            </div>
                            <div class="u-circle-bottom">
                                <div class="u-circle" v-for="(item, index) in 2" :key="item">
                                    <div v-if="fixList?.[index + 1]">
                                        <div class="u-text-r" v-if="fixList?.[index + 1]?.type == 'text'">
                                            {{
                                                fixList?.[index + 1].title.match(/[\u3400-\u9FFF\uF900-\uFAFF]/)?.[0] ||
                                                "固"
                                            }}
                                        </div>
                                        <img :src="fixList?.[index + 1].imgUrl" class="u-icon" v-else />
                                    </div>
                                    <img src="../assets/img/suspend/circle.svg" svg-inline v-else />
                                </div>
                            </div>
                        </div>
                        <div class="u-text" :class="item.type">
                            {{ item.type == "pin" ? (fixIsActive ? item.text_slash : item.text) : item.text }}
                        </div>
                    </div>
                    <slot name="drawerBox1"></slot>
                </div>
                <div class="u-drawer-box">
                    <div
                        class="u-item"
                        v-for="item in drawerFiltration(drawerType.two)"
                        :key="item.type"
                        @click="clickDrawer(item)"
                    >
                        <div class="u-icon" v-if="item.icon">
                            <img :src="item.icon" svg-inline />
                        </div>
                        <div class="u-text" :class="item.type">
                            {{ item.text }}
                        </div>
                    </div>
                    <slot name="drawerBox2"></slot>
                </div>
                <div class="u-drawer-box">
                    <div
                        class="u-item"
                        :class="item.type"
                        v-for="item in drawerFiltration(drawerType.three)"
                        :key="item.type"
                        @click="clickDrawer(item)"
                    >
                        <div class="u-author" v-if="item.isSlot">
                            <div class="u-avatar">
                                <img :src="drawerConfig.author.avatar" />
                            </div>
                            <div class="u-author-name">
                                {{ drawerConfig.author.name }}
                            </div>
                        </div>
                        <div class="u-text" v-if="!item.isSlot">
                            {{ item.text }}
                        </div>
                    </div>
                    <slot name="drawerBox3"></slot>
                </div>
            </div>

            <transition name="slide-up">
                <!-- 收藏区域 、订阅区域 -->
                <div class="p-drawer-collect p-bt-transition" v-show="areaKey === 'collect' || areaKey === 'rss'">
                    <div class="u-collect-icon">
                        <img
                            src="../assets/img/suspend/collect_touchbar_100.svg"
                            svg-inline
                            v-if="areaKey === 'collect' && !isCollect"
                        />
                        <img
                            src="../assets/img/suspend/collect_slash_touchbar_100.svg"
                            svg-inline
                            v-if="areaKey === 'collect' && isCollect"
                        />
                        <img
                            src="../assets/img/suspend/rss_touchbar_100.svg"
                            svg-inline
                            v-if="areaKey === 'rss' && !isSubscribe"
                        />
                        <img
                            src="../assets/img/suspend/report_100.svg"
                            svg-inline
                            v-if="areaKey === 'rss' && isSubscribe"
                        />
                        <div
                            class="u-text"
                            v-if="(areaKey === 'collect' && !isCollect) || (areaKey === 'rss' && !isSubscribe)"
                        >
                            {{ areaKey === "collect" ? "收藏" : "订阅" }}作品
                        </div>
                    </div>
                    <div class="u-collect-tips" v-if="areaKey === 'collect'">
                        {{ isCollect ? "你已经收藏该作品" : "喜欢程度不够？可以试试添加到稍后再看" }}
                    </div>
                    <div class="u-collect-tips" v-if="areaKey === 'rss'">
                        {{ isSubscribe ? "你已经订阅该作品" : "喜欢程度不够？可以试试添加到稍后再看" }}
                    </div>
                    <div class="u-btn-box">
                        <div class="u-btn collect" @click="collectOrSubscribe">
                            {{
                                areaKey === "collect"
                                    ? isCollect
                                        ? "取消收藏"
                                        : "收藏"
                                    : isSubscribe
                                    ? "取消订阅"
                                    : "订阅"
                            }}作品
                        </div>
                        <div class="u-btn" @click="laterOn">添加到稍后再看</div>
                    </div>
                </div>
            </transition>
            <!-- 固定配置相关页面 -->
            <transition name="slide-up">
                <div class="p-drawer-fix p-bt-transition" v-show="areaKey === 'pin' || areaKey === 'fix'">
                    <!-- 固定，取消固定,超量 -->
                    <div class="u-collect-icon" v-if="!fixIsEdit">
                        <img
                            src="../assets/img/suspend/pin_touchbar_100.svg"
                            svg-inline
                            v-if="!fixIsActive && !fixIsFull"
                        />
                        <img
                            src="../assets/img/suspend/pin_slash_touchbar.svg"
                            svg-inline
                            v-if="fixIsActive && !fixIsFull"
                        />
                        <img src="../assets/img/suspend/report_100.svg" svg-inline v-if="fixIsFull" />
                        <div class="u-text">{{ fixIsActive ? "取消固定" : "固定内容" }}</div>
                    </div>
                    <div class="u-collect-tips" v-if="!fixIsActive && !fixIsEdit">
                        你可以随时在其他页面查看固定的内容
                    </div>
                    <div class="u-edit-title" v-if="fixIsEdit">固定内容</div>
                    <div class="u-pin-box">
                        <div class="u-item" v-if="!fixIsEdit">
                            <div class="u-text-r" v-if="fixPageConfig.type == 'text'">
                                {{ fixPageConfig.title.match(/[\u3400-\u9FFF\uF900-\uFAFF]/)?.[0] || "固" }}
                            </div>
                            <img :src="fixPageConfig.imgUrl" class="u-icon" v-else />
                            <div class="u-text">{{ fixPageConfig.title }}</div>
                        </div>
                        <!-- 只在编辑界面显示 -->
                        <div
                            class="u-item"
                            v-for="(item, index) in fixIsEdit ? fixList : []"
                            :key="'fix' + index"
                            @click="fixDataClick(item)"
                        >
                            <div class="u-text-r" v-if="item.type == 'text'">
                                {{ item.title.match(/[\u3400-\u9FFF\uF900-\uFAFF]/)?.[0] || "固" }}
                            </div>
                            <img :src="item.imgUrl" class="u-icon" v-else />
                            <div class="u-text">{{ item.title }}</div>
                            <div class="u-slash" v-if="fixIsEdit" @click="cancelFix(item)">
                                <img src="../assets/img/suspend/pin_slash_touchbar_24.svg" svg-inline />
                            </div>
                        </div>
                        <!-- 不足三个时显示空位，只在编辑界面显示 -->
                        <div
                            class="u-item"
                            v-for="(item, index) in fixIsEdit ? 3 - fixList.length : 0"
                            :key="'fix_no' + index"
                        >
                            <img src="../assets/img/suspend/circle.svg" svg-inline class="u-icon" />
                        </div>
                    </div>
                    <div class="u-btn-box" v-if="!fixIsEdit">
                        <div class="u-btn collect" @click="fixClick">确定</div>
                        <!-- <div class="u-btn">编辑固定内容</div> -->
                    </div>
                    <div class="u-collect-tips" v-if="fixIsActive && !fixIsEdit">你可以在原页面再次将其固定</div>
                    <div class="u-collect-tips edit" v-if="fixIsEdit">
                        在支持固定的页面可以按
                        <img src="../assets/img/suspend/pin_touchbar_24.svg" svg-inline class="u-icon" />
                        将页面固定
                    </div>
                </div>
            </transition>
            <!--            固定页面查看数据、或打开其他远程界面-->
            <transition name="slide-up">
                <div class="p-drawer-fixData p-bt-transition" v-show="areaKey === 'fixData'">
                    <!--                展开界面图标-->
                    <div class="u-icon" @click="openUrl">
                        <img src="../assets/img/suspend/pin_touchbar_24.svg" svg-inline />
                    </div>
                    <iframe
                        :src="iframeInfo.openurl"
                        frameborder="0"
                        width="100%"
                        height="100%"
                        v-if="iframeInfo?.url"
                        class="u-iframe"
                    />
                    <span v-else>查找页面失败</span>
                </div>
            </transition>
        </el-drawer>
    </div>
</template>

<script lang="js">
import { ElMessage } from "element-plus";
import { useMediaQuery } from "@vueuse/core";
import {
    subscribeAuthor,
    unsubscribeAuthor,
    subscribePost,
    unsubscribePost,
    subscribeArticle,
    unsubscribeArticle,
    subscribeWiki,
    unsubscribeWiki,
    getSubscribeStatus,
    getSubscribePostStatus,
    getSubscribeArticleStatus,
    getSubscribeWikiStatus,
    later,
    setCollect,
    getCollectList,
    cancelCollect,
} from "../service/suspend";

// Assets imports
import searchTouchbar from "../assets/img/suspend/search_touchbar.svg";
import pinTouchbar from "../assets/img/suspend/pin_touchbar.svg";
import pinSlashTouchbar40 from "../assets/img/suspend/pin_slash_touchbar_40.svg";
import collectTouchbar from "../assets/img/suspend/collect_touchbar.svg";
import rssTouchbar from "../assets/img/suspend/rss_touchbar.svg";
import lafterTouchbar from "../assets/img/suspend/lafter_touchbar.svg";

export default {
    name: "SuspendCommon",
    props: {
        btnOptions: {
            type: Object,
            default: () => ({}),
        },
        //通用弹出框配置
        drawerOptions: {
            type: Object,
            default: () => ({}),
        },
        //固定页缓存相关配置
        fixPageOptions: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: [
        "search",
        "clickBtn",
        "fixPage",
        "fixCancelIndividually",
        "fixDataSwitch",
        "collect",
        "subscribe",
        "laterOn",
    ],
    setup() {
        // useMediaQuery depends on Composition API setup, but can be used in setup() hook of Options API
        const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
        return { isDarkMode };
    },
    data() {
        return {
            isDarkModeStatus: false,
            drawer: false,
            areaKey: "home",
            //弹窗type组合
            drawerType: {
                one: [
                    { type: "search", text: "搜索内容", icon: searchTouchbar },
                    {
                        type: "pin",
                        text: "固定本页",
                        icon: pinTouchbar,
                        text_slash: "取消固定",
                        icon_slash: pinSlashTouchbar40,
                    },
                    { type: "fix", text: "查看固定", icon: null, isSlot: true },
                ],
                two: [
                    { type: "collect", text: "收藏作品", icon: collectTouchbar },
                    { type: "rss", text: "订阅作品", icon: rssTouchbar },
                    { type: "laterOn", text: "稍后再看", icon: lafterTouchbar },
                ],
                three: [
                    { type: "user", text: "作者", isSlot: true },
                    { type: "report", text: "举报" },
                ],
            },
            fixList: [],
            fixIsEdit: false, //固定页是否编辑状态
            isCollect: false,
            collectInfo: {},
            isSubscribe: false,
            subscribeInfo: {},
            iframeInfo: {},
        };
    },
    computed: {
        btnConfig() {
            const defaultConfig = {
                showHome: false, //是否显示home区域，和Icon区域二选一,home区域优先级高于icon区域
                showIcon: true, //是否显示icon区域,此处为false后，则下列配置无效
                showPin: true, //是否显示横向固定区域，需要home和icon都是false才有效
                showSearch: true, //是否显示搜索图标
                showFixed: true, //是否显示固定图标
                showCollect: true, //是否显示收藏图标
                showLaterOn: true, //是否显示稍后再看图标
                showMore: true, //是否显示更多
            };
            return Object.assign({}, defaultConfig, this.btnOptions);
        },
        drawerConfig() {
            const defaultConfig = {
                hideType: ["report"], //需要隐藏的type,如['search','pin']
                direction: "btt", //弹出框方向，btt、ttb、rtl、ltr
                drawerTitle: "", //弹出框标题
                author: {
                    name: "", //作者名称
                    avatar: "", //作者头像
                    author_id: "", //作者id
                },
                subscribeType: "", //订阅类型，用于区分调用百科、文章、作者、帖子等订阅接口，
                postType: "", //订阅、收藏接口的type,如'face','bps','article'等
                id: "", //页面数据ID，用于收藏订阅操作
                title: document.title || "", //默认固定标题,默认取页面标题
                url: window.location.href, //默认取浏览器地址
                laterOn: {
                    author_id: 0,
                    content_meta_id: 0,
                },
            };
            return Object.assign({}, defaultConfig, this.drawerOptions);
        },
        fixPageConfig() {
            const defaultConfig = {
                key: "jx3box-common-fixed", //默认本地缓存Key
                type: "text", //默认固定类型，text、img
                imgUrl: "", //type是img时需传入图片url用作显示
                title: document.title || "", //默认固定标题,默认取页面标题
                url: window.location.href, //默认取浏览器地址
            };
            return Object.assign({}, defaultConfig, this.fixPageOptions);
        },
        drawerIsShow() {
            return Object.keys(this.drawerConfig).length > 0;
        },
        drawerIsAuthor() {
            return Object.keys(this.drawerConfig.author || {}).length > 0;
        },
        fixIsFull() {
            return this.fixList.length >= 3;
        },
        fixIsActive() {
            return this.fixList.some((item) => item.url === this.fixPageConfig.url);
        },
    },
    mounted() {
        this.fixList = JSON.parse(localStorage.getItem(this.fixPageConfig.key)) || [];
        this.getCollectInfo();
        this.getSubscribeInfo();
    },
    methods: {
        search() {
            this.$emit("search");
        },
        setMore() {
            this.drawer = true;
            this.areaKey = "home";
        },
        drawerFiltration(arr) {
            if (this.drawerConfig.hideType.length > 0) {
                return arr.filter((item) => !this.drawerConfig.hideType.includes(item.type));
            }
            return arr;
        },
        clickDrawer(item, type) {
            if (type == 1) this.drawer = true;
            let switchType = ["collect", "rss", "pin", "fix"];
            if (switchType.includes(item.type)) {
                this.areaKey = item.type;
            }
            if (item.type === "search") {
                this.search();
            }
            if (item.type === "fix") {
                this.fixIsEdit = true;
            } else {
                this.fixIsEdit = false;
            }
            if (item.type === "laterOn") this.laterOn();
            if (item.type === "user") {
                let url = "/author/" + this.drawerConfig.author.author_id;
                this.iframeInfo = { url: url, openurl: url };
                this.areaKey = "fixData";
            }
            this.$emit("clickBtn", { type: item.type, text: item.text });
        },
        fixClick() {
            if (this.fixIsFull) return;
            if (this.fixIsActive) {
                this.fixList = this.fixList.filter((item) => item.url !== this.fixPageConfig.url);
                localStorage.setItem(this.fixPageConfig.key, JSON.stringify(this.fixList));
            } else {
                let json = {
                    type: this.fixPageConfig.type,
                    title: this.fixPageConfig.title,
                    url: this.fixPageConfig.url,
                    imgUrl: this.fixPageConfig.imgUrl,
                };
                this.fixList.push(json);
                localStorage.setItem(this.fixPageConfig.key, JSON.stringify(this.fixList));
            }
            this.areaKey = "home";
            this.$emit("fixPage");
        },
        cancelFix(value) {
            this.fixList = this.fixList.filter((item) => item.url !== value.url);
            localStorage.setItem(this.fixPageConfig.key, JSON.stringify(this.fixList));
            this.areaKey = "home";
            this.$emit("fixCancelIndividually");
        },
        fixDataClick(value) {
            if (value.url.indexOf("?") != -1) {
                value.openurl = value.url + "&disabled=true";
            } else {
                value.openurl = value.url + "?disabled=true";
            }
            this.iframeInfo = value;
            this.areaKey = "fixData";
            this.$emit("fixDataSwitch");
        },
        openUrl() {
            location.href = this.iframeInfo.url;
        },
        collectOrSubscribe() {
            this.areaKey == "collect" ? this.collect() : this.subscribe();
        },
        collect() {
            let conf = this.drawerConfig;
            if (this.isCollect) {
                cancelCollect(this.collectInfo.id).then(() => {
                    this.isCollect = false;
                    this.collectInfo = {};
                });
            } else {
                setCollect(conf.id, conf.postType, conf.title).then((res) => {
                    this.isCollect = true;
                    this.collectInfo = res.data?.data;
                });
            }
            this.$emit("collect", { isCollect: this.isCollect });
        },
        getCollectInfo() {
            if (!this.drawerConfig.id && !this.drawerConfig.postType) return;
            getCollectList(this.drawerConfig.id, this.drawerConfig.postType).then((res) => {
                this.collectInfo = res.data.data;
                this.isCollect = this.collectInfo?.id > 0;
            });
        },
        subscribe() {
            let conf = this.drawerConfig;
            if (conf.subscribeType === "author") {
                if (this.isSubscribe) {
                    unsubscribeAuthor(conf.author.author_id).then(() => {
                        this.isSubscribe = false;
                        this.subscribeInfo = {};
                        this.$emit("subscribe", { isSubscribe: false });
                    });
                } else {
                    subscribeAuthor(conf.author.author_id, { title: conf.title }).then((res) => {
                        this.isSubscribe = true;
                        this.subscribeInfo = res.data?.data;
                        this.$emit("subscribe", { isSubscribe: true });
                    });
                }
            }
            if (conf.subscribeType === "community") {
                if (this.isSubscribe) {
                    unsubscribePost(conf.id).then(() => {
                        this.isSubscribe = false;
                        this.subscribeInfo = {};
                        this.$emit("subscribe", { isSubscribe: false });
                    });
                } else {
                    subscribePost(conf.id, { title: conf.title }).then((res) => {
                        this.isSubscribe = true;
                        this.subscribeInfo = res.data?.data;
                        this.$emit("subscribe", { isSubscribe: true });
                    });
                }
            }
            if (conf.subscribeType === "posts") {
                if (this.isSubscribe) {
                    unsubscribeArticle(conf.postType, conf.id).then(() => {
                        this.isSubscribe = false;
                        this.subscribeInfo = {};
                        this.$emit("subscribe", { isSubscribe: false });
                    });
                } else {
                    subscribeArticle(conf.postType, conf.id, { title: conf.title }).then((res) => {
                        this.isSubscribe = true;
                        this.subscribeInfo = res.data?.data;
                        this.$emit("subscribe", { isSubscribe: true });
                    });
                }
            }
            if (conf.subscribeType === "wiki") {
                if (this.isSubscribe) {
                    unsubscribeWiki(conf.postType, conf.id).then(() => {
                        this.isSubscribe = false;
                        this.subscribeInfo = {};
                        this.$emit("subscribe", { isSubscribe: false });
                    });
                } else {
                    subscribeWiki(conf.postType, conf.id, { title: conf.title }).then((res) => {
                        this.isSubscribe = true;
                        this.subscribeInfo = res.data?.data;
                        this.$emit("subscribe", { isSubscribe: true });
                    });
                }
            }
        },
        getSubscribeInfo() {
            let conf = this.drawerConfig;
            if (conf.subscribeType === "author" && conf.author.author_id) {
                getSubscribeStatus(conf.author.author_id).then((res) => {
                    this.isSubscribe = res.data.data?.subscribed;
                    this.subscribeInfo = res.data.data;
                });
            }
            if (conf.subscribeType === "community" && conf.id) {
                getSubscribePostStatus(conf.id).then((res) => {
                    this.isSubscribe = res.data.data?.subscribed;
                    this.subscribeInfo = res.data.data;
                });
            }
            if (conf.subscribeType === "posts" && conf.id && conf.postType) {
                getSubscribeArticleStatus(conf.postType, conf.id).then((res) => {
                    this.isSubscribe = res.data.data?.subscribed;
                    this.subscribeInfo = res.data.data;
                });
            }
            if (conf.subscribeType === "wiki" && conf.id && conf.postType) {
                getSubscribeWikiStatus(conf.postType, conf.id).then((res) => {
                    this.isSubscribe = res.data.data?.subscribed;
                    this.subscribeInfo = res.data.data;
                });
            }
        },
        laterOn() {
            let conf = this.drawerConfig;
            let params = {
                author_id: parseInt(conf.laterOn.author_id),
                banner: "",
                category: conf.postType,
                content_meta_id: parseInt(conf.laterOn.content_meta_id),
                link: conf.url,
                title: conf.title,
            };
            later(params).then((res) => {
                ElMessage.success("已添加稍后再看");
                this.areaKey = "home";
                this.$emit("laterOn");
            });
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/common/suspend-common.less";
</style>
