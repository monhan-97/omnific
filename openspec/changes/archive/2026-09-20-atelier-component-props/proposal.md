# 变更：用 Override 声明 Atelier 组件公开属性

## Why

`ButtonProps` 需要同时接受 Button 自有属性和原生 `button` 属性，并用自有字段覆盖同名原生字段（尤其是视觉 `type` 与原生 `type`）。手写 `Omit` 交叉容易漏掉覆盖键，后续组件也会各自复制一套合并逻辑。仓库已有 `@omnific/types` 的 `Override`，应直接复用。

## What Changes

- `ButtonProps` 改为 `Override<ComponentPropsWithRef<'button'>, ButtonOwnProps>`。
- `@omnific/atelier` 增加 `@omnific/types` 依赖，只用于类型。
- 新增 capability `atelier-component-props`，约定后续原生元素封装组件用同一方式合并公开属性。

## 非目标

- 不恢复 Button 的 `component` 多态渲染。
- 不在 Atelier 内重新实现 `Override`。
- 不改变 Button 运行时行为、视觉 `type` 或 `htmlType` 语义。

## 影响范围

- 受影响的 capability：`atelier-component-props`
- 受影响的 package：`packages/atelier`、现有 `@omnific/types`
- 新增依赖：`@omnific/types`（workspace）
- 公开类型形状保持为自有属性覆盖原生 `button` 属性；运行时行为无破坏性变化
