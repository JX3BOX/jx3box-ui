// 1.Create APP
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

// 2.Router

// 3.Store

// 4.i18n

// 5.Components
import { createHead } from "@vueuse/head";
const head = createHead();
app.use(head);

// 6.UI

// 6.1 JX3BOX UI
import "@jx3box/jx3box-common/css/normalize.css";
import "@jx3box/jx3box-common/css/font.css";

// 6.2 Element Plus
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "@jx3box/jx3box-common/css/element-plus-theme.css";
app.use(ElementPlus, {
    locale: zhCn,
});
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 6.3 Tailwind
import "@jx3box/jx3box-common/css/tailwind.css";


// 本地组件批量注册
import { install } from "../index.js";
install(app);

// 3.Mount DOM
app.mount("#app");
