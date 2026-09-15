# 分段筛选皮肤

`clientBy` 与 `versionBy` 均支持 Boolean 类型的 `segmented` prop，默认 `false`，保持原有样式。

```vue
<clientBy segmented :type="client" @filter="filterClient" />
<versionBy segmented :value="is_wujie" @filter="filterVersion" />
```

开启后使用浅灰分段底、白底紫字选中态与轻微阴影。两组件通过 `src/filters/segmented-skin.less` 共用皮肤，仅在根元素具有 `is-segmented` 类时生效。筛选值与事件协议不变。

业务页面升级公共组件后按需传入 `segmented`，不需要重复添加本地覆盖样式。
