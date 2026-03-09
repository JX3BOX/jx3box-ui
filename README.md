# 概述

1. App.vue 用于平时做组件开发临时预览
2. Storybook 用于协作开发共享，注意编写好 props 注释

## 模块

### 个人模块 author

一般用于文章详情的左侧边栏

-   AuthorFans 粉丝榜
-   AuthorFollow 关注用户（区分rss，此处用户更新不会收到消息）
-   AuthorGift 打赏用户
-   AuthorHonor 用户称号
-   AuthorInfo 用户基础信息
-   AuthorLink 用户绑定平台账号（微博，github，直播间）
-   AuthorMedals 用户勋章
-   AuthorPosts 用户作品
-   AuthorRss 订阅用户
-   AuthorTeams 所在团队
-   Avatar 头像
-   UserPop 搜索用户弹窗
-   

### 管理员模块 bread

一般用于文章详情的右上角管理按钮

- AdminDrop 管理模块触发器
- Admin 文章管理模块（管理员）
- AdminDirectMessage 管理员私信
- Crumb 栏目动态
- DesignTask 设计任务


### 评论模块 comment

文章评论模块，用途包括反馈中心，文章详情评论

### 筛选模块 filters

主要用于各栏目的列表筛选

- clientBy 客户端筛选
- markBy 标记筛选
- menuBy 通用筛选
- orderBy 排序筛选
- tagBy 
- topicBy 主题筛选
- versionBy 版本筛选
- zlpBy 资料片筛选
