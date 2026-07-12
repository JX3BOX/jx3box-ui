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

马甲切换时必须先将目标马甲的 token 同步到 `localStorage.__token`；如果当前标签页存在
`sessionStorage.__token`，也要一起更新，然后才能调用 refresh 接口。退出登录（包括
`token_version` 触发的强制退出）时必须同时清理这两个 `__token`。否则业务页可能从普通
`uid` 读取新账号，而接口仍携带旧账号的高优先级 token，最终在同一页面显示两个 UID。

新增马甲跳转登录页前也要先清理两个 `__token`，因为账号页登录成功默认只更新普通
`token/uid`。公共头拿到 `/user/my/info` 后，如果接口 UID 与本地 UID 不一致、当前又不是
显式 `?__token=` 入口，应清除遗留覆盖 token 并刷新一次完成自愈。显式 URL token 入口则
强制执行一次 refresh，把普通用户缓存归一到 URL token 对应的账号；UID 发生变化时刷新页面。

## 自动续期开关

默认开启。可通过 localStorage 关闭：

```js
localStorage.setItem("jx3box:auto_refresh_token", "false");
```

值为 `"false"` 或 `"0"` 时不自动续期；其它情况按默认开启处理。

该开关只控制后台自动续期。马甲切换和显式 URL token 身份归一属于用户主动登录流程，使用
`force` 刷新，不受此开关影响。

## 失败语义

自动续期失败不主动登出，也不阻断公共头渲染。后续业务请求如果发现 token 过期或无权限，仍按宿主项目既有鉴权失败逻辑处理。
