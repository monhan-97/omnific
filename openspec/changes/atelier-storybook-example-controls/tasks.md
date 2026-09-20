## 1. OpenSpec 与结构对齐

- [x] 1.1 在 `button.stories.tsx` 为每个 curated story 声明简体中文 `name`、`docs.description` 与 `coverageNotes`，`render` 绑定对应 example 组件。
- [x] 1.2 `examples/index.ts` 只导出 example 组件；中文元数据留在 stories 文件字面量中。
- [x] 1.3 确认每个 curated 导出均有对应 `examples/*.tsx` 实现文件。

## 2. Controls 与 Docgen

- [x] 2.1 `preview.tsx` 将 `controls.disable` 设为 `false`；Actions 保持关闭。
- [x] 2.2 启用 `react-docgen-typescript`（含枚举提取与 `propFilter`）；meta 使用 `component: Button`；`ButtonProps` 改为 Docgen 可读的 `interface`；不手写枚举 `argTypes`。
- [x] 2.3 删除 `WithControls` story 与 `with-controls.tsx`。
- [x] 2.4 单按钮 examples 接收 `ButtonProps`；stories 提供 `args`；矩阵/交互态关闭 Controls。

## 3. 验证

- [x] 3.1 运行 `pnpm typecheck` 与 `pnpm lint:fix`。
- [x] 3.2 运行 `pnpm build:storybook`，确认 Button stories 可构建。
- [x] 3.3 运行 `graphify update .`。
