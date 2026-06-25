# 概述

1. App.vue 用于平时做组件开发临时预览
2. Storybook 用于协作开发共享，注意编写好 props 注释

## Storybook

-   启动预览：`npm run storybook`
-   静态构建：`npm run build-storybook`
-   检查公共导出覆盖：`npm run check-storybook-coverage`

### 编写规范

-   对外导出的组件需要有独立 story，路径按模块归类到 `src/stories/<domain>/<Component>.stories.js`。
-   story 优先提供真实使用场景和关键状态，配合 `argTypes` 暴露常用入参。
-   props 说明使用 `src/stories/components/StoryPropsTable.vue` 手写维护；当前 Storybook 配置关闭了 docgen。
-   内容页或布局相关组件优先复用 `src/stories/layout/StorybookShell.vue`，避免每个 story 重复搭上下文。
-   需要接口数据时优先复用 `src/stories/mockData.js`，并在 `.storybook/storybookMocks.js` 增加 mock；不要让 Storybook 预览依赖真实服务。
-   新增公共导出组件后，先跑 `npm run check-storybook-coverage`，再跑 `npm run build-storybook`。

### 当前补全节奏

-   第一阶段：优先保证 `index.js` 对外导出的组件均有 Storybook 示例。
-   第二阶段：按目录补齐内部组件，优先级建议为 `interact`、`bread`、`author/comment/header/footer/upload`。

## 模块

### 全局

-   CommonHeader 公共头
-   Breadcrumb 面包屑
-   Main 默认内容框架（非必须）
-   LeftSidebar 左侧边栏（非必须）
-   LeftSideToggle 左侧边栏触发器（非必须，可独立使用）
-   RightSidebar 右侧边栏（非必须）
-   CommonFooter 公共底
-   SuspendCommon 移动侧浮窗底（此组件需要手动引入）

### 内容单页 single

主要是用于详情页的展示内容

-   CmsSingle 单页框架
-   Author 侧边栏作者信息整合
-   PostDirectory 目录
-   PostHeader 创作信息
-   Creators 联合创作
-   Collection 小册
-   Thx 交互组件
-   SimpleThx 交互组件简化版（仅 PVP 栏目使用，需要手动引入）
-   Comment 评论
-   RightAffix 固钉
-   PostGuide 快速跳转至上下篇
-   PostVersion 修改历史
-   PostCollection 关联小册

### 筛选模块 list

主要用于各栏目的列表筛选

-   clientBy 客户端筛选
-   markBy 标记筛选
-   menuBy 通用筛选
-   orderBy 排序筛选
-   tagBy 标签筛选
-   topicBy 主题筛选
-   versionBy 版本筛选
-   zlpBy 资料片筛选

### 百科模块 wiki

-   GamePrice 游戏价格组件
-   WikiPanel 百科面板
-   WikiComments 百科评论
-   WikiRevisions 百科修订

### 其他

-   UserPop 搜索用户弹窗
