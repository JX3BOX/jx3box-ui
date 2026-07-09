# Auth token refresh

PC 端自动续期挂在公共头 `src/CommonHeader.vue`。这个组件会被各 PC 页面引用，因此不要把 refresh 逻辑散到各业务页面。

## Source of truth

- 续期接口：`POST /api/cms/user/account/token/refresh`
- service：`service/cms.js#refreshAuth`
- 续期工具：`src/utils/auth-token-refresh.js`
- 触发组件：`src/CommonHeader.vue`

## 触发点

- 公共头初始化时，如果 `User.isLogin()` 为 true，检查一次。
- 页面从后台恢复可见时，监听 `visibilitychange`，在 `document.visibilityState === "visible"` 时检查一次。

检查函数会先解析本地 JWT payload，未进入续期窗口时不会请求后端。

## 续期窗口

当前规则：

- token 距离 `exp` 小于等于 7 天。
- token 距离 `iat` 至少 1 天。
- token 已经过期时不刷新。
- 同一时间只允许一个 refresh 请求在飞。

## PC 账号切换注意事项

PC 公共库存在马甲切换：

- 马甲缓存 key：`jx3box-alternate-{uid}`
- 当前请求 token 读取优先级：`__token` 优先于 `token`

因此 refresh 成功后必须同时更新：

- `token`
- `__token`
- `created_at`
- 当前激活账号的 `jx3box-alternate-{uid}` 记录

否则用户切换马甲时可能拿回旧 token，或者后续请求继续优先使用旧 `__token`。

## 自动续期开关

默认开启。可通过 localStorage 关闭：

```js
localStorage.setItem("jx3box:auto_refresh_token", "false");
```

值为 `"false"` 或 `"0"` 时不自动续期；其它情况按默认开启处理。

## 失败语义

自动续期失败不主动登出，也不阻断公共头渲染。后续业务请求如果发现 token 过期或无权限，仍按宿主项目既有鉴权失败逻辑处理。
