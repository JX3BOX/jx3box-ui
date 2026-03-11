// 全局模块
import CommonHeader from "./src/CommonHeader.vue";
import Footer from "./src/Footer.vue";
import CommonFooter from "./src/CommonFooter.vue";
import Icon from "./src/Icon.vue";

// 布局
import Main from "./src/Main.vue";
import Breadcrumb from "./src/Breadcrumb.vue";
import LeftSidebar from "./src/LeftSidebar.vue";
import RightSidebar from "./src/RightSidebar.vue";
import LeftSideToggle from "./src/LeftSideToggle.vue";

// 列表页
import markBy from "./src/filters/markBy.vue";
import tagBy from "./src/filters/tagBy.vue";
import orderBy from "./src/filters/orderBy.vue";
import menuBy from "./src/filters/menuBy.vue";
import clientBy from "./src/filters/clientBy.vue";
import zlpBy from "./src/filters/zlpBy.vue";
import topicBy from "./src/filters/topicBy.vue";
import versionBy from "./src/filters/versionBy.vue";

// 单页
import CmsSingle from "./src/single/CmsSingle.vue";
import Comment from "./src/single/Comment.vue";
import Thx from "./src/single/Thx.vue";

// 其他/工具
import UserPop from "./src/author/UserPop.vue";
import SuspendCommon from "./src/SuspendCommon.vue";

import {
    Jx3boxUiI18n,
    createJx3boxUiI18n,
    getJx3boxUiMessages,
    mergeJx3boxUiMessages,
    getJx3boxUiAvailableLocales,
    setJx3boxUiLocale,
} from "./i18n";

const components = {
    CommonHeader,
    CommonFooter,
    Footer,
    Icon,

    Main,
    Breadcrumb,
    LeftSidebar,
    RightSidebar,
    LeftSideToggle,

    tagBy,
    orderBy,
    markBy,
    menuBy,
    clientBy,
    zlpBy,
    topicBy,
    versionBy,

    CmsSingle,
    Comment,
    Thx,

    UserPop,
    SuspendCommon,
};

const install = function (app) {
    Object.keys(components).forEach((key) => {
        app.component(key, components[key]);
    });
};

export {
    install,
    Jx3boxUiI18n,
    createJx3boxUiI18n,
    getJx3boxUiMessages,
    mergeJx3boxUiMessages,
    getJx3boxUiAvailableLocales,
    setJx3boxUiLocale,
};
