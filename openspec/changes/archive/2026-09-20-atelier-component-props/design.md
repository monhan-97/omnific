# 设计：Atelier 组件公开属性合并

## 背景

Button 始终渲染原生 `button`。公开 API 需要透传 `ref`、事件和其余原生属性，同时保留视觉 `type`、`htmlType`、`loading` 等自有字段。同名字段必须以组件定义为准。

## 目标

- 用仓库已有的 `Override` 表达“原生属性为底、自有属性覆盖”。
- 让后续封装原生元素的组件沿用同一写法。

## 非目标

- 不引入多态 `component` 类型。
- 不把 `Override` 再包一层 Atelier 专用别名。

## 关键决策

`ButtonProps` 使用 `Override<ComponentPropsWithRef<'button'>, ButtonOwnProps>`。`ButtonOwnProps.type` 覆盖原生 `type`；原生 `submit | reset | button` 继续由 `htmlType` 映射到 DOM。

## 备选方案

- 继续手写 `OwnProps & Omit<NativeProps, keyof OwnProps>`：与 `Override` 等价，但每个组件都要记得省略正确的键，拒绝。
- 在 Atelier 再声明一份 `Override`：与 `@omnific/types` 重复，拒绝。

## 风险与缓解

- 发布后的 `.d.ts` 会引用 `Override`：将 `@omnific/types` 列为 Atelier 依赖，避免消费方解析不到类型。
