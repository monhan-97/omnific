# 设计：demo ↔ example 一对一与全局 Controls

## 背景

归档变更 `atelier-storybook-site` 已约定 curated examples 与集中 `__stories__` 注册，但落地时 stories 与 example 元数据分离，且全局关闭 Controls，缺少类型驱动的试调入口。

## 目标

- 保证每个导航中的 curated demo 都能追溯到独立 example 源码。
- stories 注册文件保留中文元数据与 `render` 绑定；meta 使用官方 `component` 写法。
- 全局启用 Controls；单按钮 stories 用 `args` 试调，矩阵/交互态关闭 Controls。

## 关键决策

### 1. demo 与 example 一对一

```text
packages/atelier/button/examples/
├── index.ts
├── basic.tsx
├── block.tsx
├── danger.tsx
├── disabled.tsx
├── icon.tsx
├── icon-only.tsx
├── loading.tsx
├── shape.tsx
├── sizes.tsx
└── variants.tsx
```

稳定英文 story 名与 curated example 文件一一对应。新增 curated demo 时 MUST 同时新增 example 文件。

### 2. 元数据与 CSF 静态分析

`button.stories.tsx` 保留 meta、decorator，以及对每个稳定英文导出的 `StoryObj`（含简体中文 `name`、`docs.description`、`coverageNotes` 与 `render`）。`render` 只引用对应 example 组件。

简体中文显示名称 MUST 写在 `__stories__/*.stories.tsx` 的 story 对象字面量中，避免跨文件 re-export 丢失 `name`。

### 3. 全局 Controls（官方路径）

`preview.tsx` 设置 `controls.disable: false`，`actions.disable: true`。

对齐 Storybook 官方推荐：

1. stories 用 `args` 驱动 Controls
2. meta 声明 `component: Button`
3. `react-docgen-typescript` + `shouldExtractLiteralValuesFromEnum` 自动推断 `argTypes`
4. `ButtonProps` 用 `interface extends ComponentPropsWithRef<'button'>`（不用 `Override`/`Omit`），让 Docgen 能读到 union
5. `propFilter` 过滤 `node_modules` 原生 props，减少面板噪音
6. `reactDocgenTypescriptOptions.include` 指向 `packages/atelier/**/*.tsx`（官方 monorepo 写法），避免默认 glob 漏扫 / 误扫 `.storybook` 配置文件并告警
7. 不手写与公开类型重复的枚举 `argTypes`

单按钮 curated examples 接收 `ButtonProps`，stories 通过 `args` + `render` 驱动；矩阵/多按钮/交互态 stories 关闭 Controls。

## 非目标

- 不引入 docs addon 源码面板作为本变更硬性要求；一对一 example 文件即源码来源。
- 不为枚举单独维护 meta `argTypes`。

## 风险

- 中文 `name` 必须落在 stories 文件字面量上，否则 CSF 静态分析会显示英文导出名。
- 若未来 props 再次使用 `Override`/`Omit` 等 Docgen 难解析的类型，枚举 select 会退化成文本框，需改回 interface 或临时补 `argTypes`。
