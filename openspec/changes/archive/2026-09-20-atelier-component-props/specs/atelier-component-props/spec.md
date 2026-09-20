## Purpose

定义 `@omnific/atelier` 封装原生元素时如何声明公开 props：用 `@omnific/types` 的 `Override` 以自有属性覆盖原生属性，避免每个组件手写 `Omit` 交叉。

## ADDED Requirements

### Requirement: 使用 Override 合并自有属性与原生属性

封装单一原生元素的 Atelier 组件 MUST 将其公开 props 声明为 `Override<ComponentPropsWithRef<Element>, OwnProps>`，其中 `Element` 是实际渲染的原生标签，`OwnProps` 是组件自有属性。组件 MUST 从 `@omnific/types` 导入 `Override`，MUST NOT 为同一目的手写 `Omit` 与交叉类型，也 MUST NOT 在 Atelier 内重新定义 `Override`。

#### Scenario: 声明 Button 公开属性

- **WHEN** 维护者查看 `packages/atelier/button/types.ts` 中的 `ButtonProps`
- **THEN** 该类型等于 `Override<ComponentPropsWithRef<'button'>, ButtonOwnProps>`，并从 `@omnific/types` 导入 `Override`

### Requirement: Button 用自有 type 覆盖原生 type

`ButtonOwnProps.type` MUST 表示视觉类型。原生 `button` 的 `type` MUST 通过 `htmlType` 暴露。`Override` MUST 用 `ButtonOwnProps` 覆盖原生 `type`，使 `ButtonProps.type` 为 `ButtonType` 而不是原生 `submit | reset | button`。

#### Scenario: 同时传入视觉 type 与 htmlType

- **WHEN** 使用方传入 `type="primary"` 和 `htmlType="submit"`
- **THEN** TypeScript 将 `type` 视为 `ButtonType`，将 `htmlType` 视为 `ButtonHTMLType`；渲染结果中原生 `button` 的 `type` 属性为 `submit`
