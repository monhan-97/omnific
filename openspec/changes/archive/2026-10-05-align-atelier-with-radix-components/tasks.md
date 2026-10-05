# 任务

## 1. 目录与约束基线

- [x] 1.1 保留 `packages/atelier/box` 与 `packages/atelier/button`，不创建 `packages/atelier/components`。
- [x] 1.2 不新增 `@radix-ui/react-slot` 或任何运行时依赖。
- [x] 1.3 新建 `packages/atelier/props`，确认既有 `packages/atelier/utils` 不改变公开 export。
- [x] 1.4 删除 `packages/atelier/styles/foundation.ts` 与 `_foundation.scss`，不保留这两个自制桥接文件。
- [x] 1.5 记录 Radix 参考 commit `1faff10ac26ae17f09944d418c6949b93fc6b566`、MIT 许可证和参考源码路径。
- [x] 1.6 在 Atelier 的 README 或变更说明中记录 class 迁移和保留现有子路径导入的迁移方式。

## 2. 共享 props 与辅助

- [x] 2.1 新增 `props/padding.props.ts`，声明 padding 公开值与类型。
- [x] 2.2 新增 `props/margin.props.ts`，声明 `m`、`mx`、`my`、`mt`、`mr`、`mb`、`ml` 的 value 类型。
- [x] 2.3 新增 `props/width.props.ts` 与 `props/height.props.ts`，声明 sizing prop defs。
- [x] 2.4 新增 `props/display.props.ts` 声明 display 公开值与类型。
- [x] 2.5 新增 `utils/extractProps.ts`，直接消费 `getAtelierClassName` / `atelierStyleMaps`，生成 class、合并 className / style 并透传原生 props。
- [x] 2.6 为 prop extraction、className / style 合并、未知 props 透传补单元测试。
- [x] 2.7 明确不实现 breakpoints：Map schema 不接受对象值，extractProps 不处理 `xs`、`sm`、`md`、`lg`、`xl` key，utility class 不生成断点前缀。
- [x] 2.8 明确不实现 grid：display values 不包含 `grid` / `inline-grid`，不新增 grid-area、grid-column、grid-row 等 props。

## 3. Box 迁移

- [x] 3.1 在 `props/index.ts` 声明按需生成类名的 `getAtelierClassName` / `atelierStyleMaps`；在 `box/types.ts` 使用 `AtelierProps & { border?: boolean }`，`border` 由 Box 内联处理。
- [x] 3.2 调整 `box/Box.tsx`，固定渲染 `div`，根 class 使用 `atelier-box`，不实现 `as` 或 `asChild`。
- [x] 3.3 将 Box 的 padding、margin、display、sizing 转为共享 `atelier-*` class。
- [x] 3.4 在 Box 恢复 `radius`、`shadow`、`bg`、`borderColor`、`border`，并合并用户 `style`。
- [x] 3.5 删除 Box 目录内重复的结构 scale 和组件私有 spacing class。
- [x] 3.6 更新 Box 测试：
  - 固定 `div`。
  - `atelier-box`。
  - padding、margin、display、sizing utility class。
  - 用户 style 透传。
  - 继续生成 `atelier-box`，且不生成 PascalCase 根 class。

## 4. 静态 CSS 与 utility class

- [x] 4.1 新建 `styles/tokens/scaling.scss`、`space.scss`、`radius.scss`、`shadow.scss`、`typography.scss`、`control.scss` 与 `tokens/index.scss`，集中声明静态 token 值。
- [x] 4.2 新建 `styles/utilities/padding.scss`，生成 `atelier-p-*`、`atelier-px-*`、`atelier-py-*`。
- [x] 4.3 新建 `styles/utilities/margin.scss`，生成 `atelier-m-*`、`atelier-mx-*`、`atelier-my-*` 等 margin class。
- [x] 4.4 新建 `styles/utilities/display.scss` 与 `styles/utilities/sizing.scss`，生成 display、width、min-width、max-width、height、min-height、max-height class。
- [x] 4.5 调整 `styles/index.scss`，先加载 tokens，再加载 utilities 与组件样式。
- [x] 4.6 保留 `box/styles/layout.scss`；Box 无主题样式，不保留 `box/styles/theme.scss`。

## 5. 导出与构建

- [x] 5.1 保持 `packages/atelier/package.json` 的 `./box`、`./button`、`./system`、`./transition`、`./styles.css` export。
- [x] 5.2 不新增 `./components/*` export。
- [x] 5.3 确认 `tsdown.config.mjs` 继续输出 `dist/box` 与 `dist/button`，不生成 `dist/components`。
- [x] 5.4 检查构建产物仍支持 `@omnific/atelier/box` 与 `@omnific/atelier/button`。

## 6. 示例、Storybook 与文档

- [x] 6.1 更新 Box、Button 示例的 class 约定和内部 import。
- [x] 6.2 更新 System examples 中所有 Box、Button 引用和 class 约定。

## 7. 验证与收口

- [x] 7.1 运行 `pnpm --filter @omnific/atelier typecheck`。
- [x] 7.2 运行 `pnpm --filter @omnific/atelier test`。
- [x] 7.3 运行 `pnpm --filter @omnific/atelier build`。
- [x] 7.4 运行 `pnpm typecheck`。
- [x] 7.5 运行 `pnpm lint:fix`。
- [x] 7.6 运行 `pnpm build:storybook`，确认 Storybook 可构建。
- [x] 7.7 运行 `graphify update .`。
- [x] 7.8 检查 OpenSpec 所有 Markdown 均为简体中文，固定结构关键词、路径、命令和代码标识除外。
