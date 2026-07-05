# 全局配置 CDN 读取约定

## 背景

`/api/cms/config` 中有一批低频更新的全局配置，后端会构建到 CDN JSON：

```txt
https://cdn.jx3box.com/config/global.json
```

这类配置在公共组件库和其它魔盒前端项目中应优先读取 CDN 静态 JSON，减少页面内多组件重复请求 config 接口。

## 实现原则

- 在项目服务层封装统一 helper，不要让具体组件直接请求 CDN。
- helper 优先读取内存缓存，再读 `sessionStorage`，没有缓存时请求 `global.json`。
- 同一页面生命周期内要复用 pending promise，避免多个组件并发触发多次请求。
- 对旧调用保持返回结构兼容，比如继续返回 `{ key, val }` 或数组，减少组件改动面。
- CDN 请求失败、缺少目标 key、或查询不适合静态 JSON 时，fallback 到旧 `/api/cms/config`。
- 公共头可以预热全局配置，但其它组件不能隐式依赖公共头加载顺序。

## 本仓落点

- `service/header.js`：`getGlobalConfig()` 负责读取 CDN JSON，并做内存缓存、`sessionStorage` 缓存、TTL 和 pending promise 复用。
- `service/cms.js`：`getConfig()` 优先从 `getGlobalConfig()` 合成旧接口兼容结构，失败时回退旧接口。
- `service/thx.js`：`getBoxcoinStatus()` 走统一 `getConfig({ key: "boxcoin" })`。

## 适用范围

后续其它魔盒项目如果提到“全局配置读取换 CDN”或“config 改成读 `global.json`”，默认按本约定处理：优先服务层兼容改造，组件侧尽量少动，迁移期保留旧接口 fallback。
