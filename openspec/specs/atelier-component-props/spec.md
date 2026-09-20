## Purpose

定义 `@omnific/atelier` 封装原生元素时如何声明公开 props：用 `@omnific/types` 的 `Override` 以自有属性覆盖原生属性，避免每个组件手写 `Omit` 交叉。

## Requirements

### Requirement: 使用 Override 合并自有属性与原生属性

封装单一原生元素的 Atelier 组件 MUST 将其公开 props 声明为 `Override<ComponentPropsWithRef<Element>, OwnProps>`，其中 `Element` 是实际渲染的原生标签，`OwnProps` 是组件自有属性。组件 MUST 从 `@omnific/types` 导入 `Override`，MUST NOT 为同一目的手写 `Omit` 与交叉类型，也 MUST NOT 在 Atelier 内重新定义 `Override`。

#### Scenario: 声明 Button 公开属性

- **WHEN** 维护者查看 `packages/atelier/button/types.ts` 中的 `ButtonProps`
- **THEN** 该类型等于 `Override<ComponentPropsWithRef<'button'>, ButtonOwnProps>`，并从 `@omnific/types` 导入 `Override`

### Requirement: Button 用 variant 表示视觉，原生 type 表示 HTML type

`ButtonOwnProps.variant` MUST 表示视觉变体，取值 MUST 为互斥的 `primary | secondary | dashed | outline | danger`，MUST NOT 再通过 `status` 与其他视觉值叠加。原生 `button` 的 `type` MUST 保持为 `submit | reset | button`，MUST NOT 被视觉属性覆盖，也 MUST NOT 再提供 `htmlType` 别名。

#### Scenario: 同时传入视觉 variant 与原生 type

- **WHEN** 使用方传入 `variant="primary"` 和 `type="submit"`
- **THEN** TypeScript 将 `variant` 视为 `ButtonVariant`，将 `type` 视为原生 `button` type；渲染结果中原生 `button` 的 `type` 属性为 `submit`，class 包含 primary 变体类名且不包含 status 复合类名
