# 变更：Storybook demo 与 example 一对一，并启用 Controls

## Why

当前 `button.stories.tsx` 为每个 demo 重复编写中文名称、描述和 `render` 包装，既偏离已约定的「注册文件只 re-export」模式，也让 example 源码与 story 元数据分离。维护者无法在 Controls 面板里试调公开 props，只能靠 curated 场景猜测组合。

## What Changes

- 每个 curated demo MUST 对应 `packages/atelier/<component>/examples` 下的独立示例源码文件；story 稳定英文导出与 example 一一对应。
- `packages/atelier/__stories__/*.stories.tsx` 定义 meta（含 `component`）、decorator 与 `StoryObj`；curated story 的 `render` 只引用 example 组件。简体中文显示名称、描述和 `coverageNotes` 写在 stories 文件的对象字面量中。
- 全局启用 Controls（`controls.disable: false`）；Actions 仍关闭。meta 声明 `component`，`ButtonProps` 使用 Docgen 可读的 `interface`，由 `react-docgen-typescript` 推断枚举 options；不把 Autodocs 作为主文档体验。
- 删除独立的 `WithControls` playground story 与 `with-controls.tsx`。

## 非目标

- 不引入 Autodocs 作为主文档体验；react-docgen 仅用于 Controls 类型推断。
- 不新增 Chromatic、交互测试 runner 或共享 Playground 抽象。
- 不修改 Button 运行时行为；仅允许为 Docgen 调整等价 props 类型写法。

## 影响范围

- 受影响的 capability：`atelier-storybook-site`
- 受影响路径：`packages/atelier/__stories__`、`packages/atelier/button/examples`、根 `.storybook/preview.tsx`、`.storybook/main.ts`
- 公开行为：Storybook Controls 全局可用；curated demos 仍由 example 源码驱动画布内容
