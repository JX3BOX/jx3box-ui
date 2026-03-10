# 概述

1. App.vue 用于平时做组件开发临时预览
2. Storybook 用于协作开发共享，注意编写好 props 注释

## 模块

### 全局
- CommonHeader 公共头
- Breadcrumb 面包屑
- Main 默认内容框架（非必须）
- LeftSidebar 左侧边栏（非必须）
- LeftSideToggle 左侧边栏触发器（非必须，可独立使用）
- RightSidebar 右侧边栏（非必须）
- CommonFooter 公共底
- SuspendCommon 移动侧浮窗底（此组件需要手动引入）

### 内容单页 single

主要是用于详情页的展示内容

- CmsSingle 单页框架
- Author 侧边栏作者信息整合
- PostDirectory 目录
- PostHeader 创作信息
- Creators 联合创作
- Collection 小册
- Article 文章内容
- Thx 交互组件
- SimpleThx 交互组件简化版（仅PVP栏目使用，需要手动引入）
- Comment 评论

### 筛选模块 list

主要用于各栏目的列表筛选

- clientBy 客户端筛选
- markBy 标记筛选
- menuBy 通用筛选
- orderBy 排序筛选
- tagBy 标签筛选
- topicBy 主题筛选
- versionBy 版本筛选
- zlpBy 资料片筛选

### 其他
- UserPop 搜索用户弹窗
