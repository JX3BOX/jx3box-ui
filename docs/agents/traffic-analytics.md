# Traffic 路径采集适配

`jx3box-ui` 只提供无渲染、显式启用的适配器，不会在安装组件库或渲染 `CommonHeader` 时自动采集。

```js
import { createJx3boxTrafficAnalytics } from "@jx3box/jx3box-ui";

const traffic = createJx3boxTrafficAnalytics({
    router,
    project: "index",
    client: "pc_web",
    surface: "pc_web",
    gameClient: "std",
    // 传 heartbeat 的实时结果。未知态失败关闭，不发送。
    resolveTrafficPermission: () => heartbeatState,
});

// 应在 router 已建立，并取得 heartbeat 权限后显式执行。
await traffic.init();

// heartbeat 后续发现机器人或关闭采集时，立即持久阻断并清空队列。
traffic.setTrafficPermission({
    traffic_allowed: false,
    collection_blocked_reason: "robot",
});

// heartbeat 明确恢复后才解除持久阻断。
traffic.setTrafficPermission({ traffic_allowed: true });

// 同义的显式生命周期接口，供宿主的隐私开关直接调用。
traffic.block("host_privacy_disabled");
traffic.unblock();

// 宿主卸载时释放唯一 Router owner、pagehide 监听和队列请求。
traffic.destroy();
```

适配器只创建一个 Analytics Core、一个 Router owner 和一个 `TrafficSink`。它不会创建 `TrackingSink`，也不会安装点击、曝光、热力图指令，因此一次路由变化只产生一个 canonical `page_view`。已经由宿主启用 Tracking 的应用不能再初始化本适配器；这类应用应直接用 `jx3box-common@9.5.2` 的组合 sink 创建唯一 Core/Router owner。

运行时规则只能来自 `/api/cms/system/traffic/config`。配置缺失、请求失败、规则字段不完整或动态参数没有 named validator 时不建立页面事件，也不使用本地放行规则。heartbeat 权限未知时会进入内存级 fail-closed：不建立新的 Journal 事件、取消进行中的请求；已经完成脱敏的 Journal 项会保留，直到明确允许后再恢复。宿主应优先等 heartbeat 给出明确权限后再调用 `init()`。批量请求发往 `/api/cms/system/traffic/visits/batch`，依赖逐 `event_id` ACK；409、429、网络错误和缺失 ACK 都保留原事件重试。

Config 请求与 Traffic envelope 共用同一个 recipient domain。`pc_web` 保留小写真实 hostname（由后端 allowlist 决定是否启用）；`app`、`miniprogram`、`pc_game`、`mobile_game` 统一使用 `embedded`，不会把 WebView 的 `localhost` 等内部地址发给规则接口。

`traffic_allowed=false`、`is_robot=true`、`traffic.block(reason)` 或可信 `blocked` 会写入 `jx3box:analytics:traffic:block:v1`，并调用 `block({ clear: true, cancelInflight: true })`。下次初始化先恢复阻断，再接入 Router。只有 heartbeat 明确返回允许，或宿主显式调用 `setTrafficPermission({ traffic_allowed: true })` / `unblock()` 才解除。

宿主可通过 `beforeFlush(context)` 在每次网络发送前追加权限判断；返回 `false`/`{ allow: false }` 会保留队列并拒绝发送，返回可信 `block` 会持久阻断。`clear(reason)` 与 `cancelInflight(reason)` 分别清除安全 Journal 和取消当前请求。`init()` 幂等占有唯一 Router owner，`destroy()` 释放 Router/pagehide 监听并取消请求；销毁后不能再次初始化。

Traffic-only 队列使用独立的 `jx3box:analytics:traffic:queue:v1`，不会读取或改写公共 `jx3box:analytics:queue:v1` 中的 Tracking/multi-sink Journal。队列仍把无 delivery ownership 的旧数据视为 `tracking`，不会误发到 Traffic。

后端协议已提供 Traffic config 和逐 ID ACK。本适配器当前通过 9.5.2 fixture 验证；若目标环境仍是旧部署、响应缺字段或网络不可用，会安全保留或拒绝事件。构建与 fixture 测试不代表线上部署及真实链路已经验证。
