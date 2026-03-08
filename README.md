# jx3box-vue3-ui

这是一个基于 `vue-cli + webpack5 + vue3` 的公共组件库，供其它业务项目按需引入各种 `.vue` 组件模块（如公共头部等）。

## i18n（多语言）接入

本库内置 `vue-i18n@9` 的接入方式，并提供一个可选的 Vue 插件用于：

- 宿主项目已使用 `vue-i18n`：合并本库词条到宿主 i18n
- 宿主项目未使用 `vue-i18n`：由本库创建并安装 i18n（仅用于本库组件文案）

词条命名空间固定为：`jx3boxUi`（避免与业务方 key 冲突）。

### 1）宿主项目已使用 vue-i18n（推荐）

```js
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";

import { install, Jx3boxUiI18n } from "@jx3box/jx3box-vue3-ui";

const app = createApp(App);

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "zh-CN",
    fallbackLocale: "zh-CN",
    messages: {
        "zh-CN": {
            // 业务自己的词条...
        },
        "en-US": {
            // 业务自己的词条...
        },
    },
});

app.use(i18n);
app.use(Jx3boxUiI18n, { i18n }); // 合并本库词条
install(app); // 注册组件

app.mount("#app");
```

### 2）宿主项目未使用 vue-i18n（快速接入）

```js
import { createApp } from "vue";
import App from "./App.vue";
import { install, Jx3boxUiI18n } from "@jx3box/jx3box-vue3-ui";

const app = createApp(App);

app.use(Jx3boxUiI18n, { locale: "zh-CN" });
install(app);

app.mount("#app");
```

### 3）覆盖/扩展本库词条

在宿主 i18n 中覆盖同名 key 即可（以 `jx3boxUi` 为根）：

```js
i18n.global.mergeLocaleMessage("en-US", {
    jx3boxUi: {
        header: {
            vipCenter: "Membership",
        },
    },
});
```

### 说明

- 目前优先对 `Header` 相关组件与少量通用提示文案做了 i18n 化；其它组件可按同样方式逐步迁移。
