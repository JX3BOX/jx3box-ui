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


### 顶部模块

主要是header的模块

- alternate 马甲切换
- asset 用户资产
- box 魔盒矩阵（移动端）
- box2 魔盒矩阵（PC）
- client 客户端切换
- lang 语言切换
- logo
- manage 后台管理入口
- message 消息中心入口
- nav 导航栏
- publish 创作中心入口
- search 搜索框
- shop 商城入口
- user 用户头像+信息pop
- 会员中心入口

### 交互模块

主要是文章详情中用于用户交互的组件，包含打赏，分享，收藏等等

- BoxcoinAdmin 管理员品鉴
- BoxcoinRecords 品鉴+打赏记录
- BoxcoinUser 用户打赏
- Contributors 多人合作文章中打赏目标选择
- Fav 收藏
- Like 点赞
- Rss 订阅
- Share 分享
- WatchLater 稍后再看


### 单页

主要是用于详情页的展示内容

- Author 侧边栏作者信息
- CmsSingle 单页框架
- Collection 小册
- Comment 评论
- Creators 联合创作
- PostDirectory 目录
- PostHeader 创作信息
- PostTopic 右侧边栏头条
- SimpleThx 简单交互组件集合
- Thx 交互组件
