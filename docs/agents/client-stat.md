# PC 公共头客户端统计

`CommonHeader` 为引用公共头的普通 PC 项目接入新版客户端实例 heartbeat。

- 接口：`POST /api/cms/system/stat/heartbeat`。
- SDK 版本：当前固定为 `v0.0.1`，只在统计组件协议升级时调整。
- 实例 ID：复用本地 `jx3box:device_id` 随机 UUID；不使用硬件指纹。
- 普通桌面浏览器为 `client=pc_web`；手机浏览器访问 PC 页面为 `client=mobile_web`。
- 小程序和 App 容器按统一客户端枚举识别；游戏内页面的 `pc_game/mobile_game` 由对应页面以后主动指定，不在公共头推断。
- UID 不进入 payload，由 service-cms 从可选 JWT 中读取；IP 同样由服务端反代请求头读取。
- 生产环境启动后随机延迟 3～15 秒，同一北京时间日期、UID 和 Web 版本只成功上报一次。
- 页面恢复可见时补检；请求失败不写成功标记，也不影响公共头和宿主页面。
- localhost 每次公共头重新创建都强制上报，方便联调。
