# 任务

## 1. 收敛 system 类型与 API

- [x] 1.1 删除 `ThemeTokens`、`TokenCategory`、`TokenNode`、`ColorToken`、`ThemeColors`、`ThemeColorKeys` 等手写键联合；允许新增 `ColorValue`、`ColorSet`、`SystemContext` 作为函数参数契约，颜色键由 const 泛型自动推导。
- [x] 1.2 将 `defineTokens` 调整为 `defineColors`，将 `mergeTokens` 调整为 `mergeColors`，不声明新的返回值类型或结果类型，并移除颜色分类前缀表。
- [x] 1.3 调整 `createSystem` 为只接受扁平颜色对象，返回包含 `name`、`colors`、`cssVars` 的对象，返回类型完全由 TypeScript 自动推导。
- [x] 1.4 将 `SystemContext` 收缩为 `name`、`colors`、`cssVars` 的函数参数契约，删除 `_config`、`styleFromTokens`、`STYLE_TOKEN` 与结构 token 合并逻辑；`createSystem` 返回类型保持自动推导。
- [x] 1.5 更新 `@omnific/atelier/system` 的导出，移除旧 API 名称和 `ColorToken` 等手写键联合导出，仅保留参数契约类型与函数导出，不新增兼容别名。

## 2. 静态结构样式

- [x] 2.1 新增 `packages/atelier/styles/_foundation.scss`，声明 `--space-*`、`--radius-*`、`--font-*`、`--font-size-*`、`--control-height-*`、`--shadow-*` 等非颜色结构变量。
- [x] 2.2 调整 `packages/atelier/styles/index.scss`，先加载 foundation，再聚合组件样式。
- [x] 2.3 从 `packages/atelier/system/defaults` 移除结构 token 默认值，仅保留默认颜色，并导出 `defaultColors`。
- [x] 2.4 删除不再使用的 system 结构 token 文件、类型和测试 fixture。
- [x] 2.5 更新 `packages/atelier/package.json` 中的构建入口或 Sass 聚合路径，使静态 foundation 进入 `dist/styles.css`。
- [x] 2.6 新增共享 `packages/atelier/styles/foundation.ts`，集中维护 spacing、radius、shadow 的 token 名与 class 后缀；Box 只消费该清单，MUST NOT 在组件目录复制 scale。

## 3. 收窄 useTheme

- [x] 3.1 将 `css-vars.ts` 的变量生成逻辑收窄为 `--color-${key}`，移除分类与 CSS 属性映射。
- [x] 3.2 保留 `applyCssVars` 的 `document.head` `<style>` 复用、引用计数和卸载行为，但不生成结构变量。
- [x] 3.3 保留 `useTheme(system)` 的 ref 返回值、ref 作用域和 `documentElement` 回退逻辑，并通过 `Parameters<typeof applyCssVars>[0]` 自动推导参数类型。
- [x] 3.4 保留并校验 `data-atelier-theme={system.name}` 行为。
- [x] 3.5 更新 `system/__test__/system.test.ts` 和 `system/__test__/use-theme.test.tsx`，覆盖只注入颜色、颜色覆盖和 ref 生命周期。

## 4. 组件颜色语义

- [x] 4.1 将 Button theme 样式中的 `--color-blue-*` 改为 `--color-accent-*`。
- [x] 4.2 将 Button 危险态样式中的 `--color-red-*` 改为 `--color-danger-*`。
- [x] 4.3 检查 Box 和其他组件 theme 样式，禁止直接引用具体色相 token。
- [x] 4.4 保留或引入 `--color-success-*`、`--color-warning-*`、`--color-info-*` 作为状态语义色。
- [x] 4.5 更新组件测试或 Storybook 示例，验证切换 accent / danger 颜色时无需改动组件结构样式。

## 5. Box 静态结构属性

- [x] 5.1 在 `packages/atelier/box/styles/layout.scss` 中为 `p`、`px`、`py` 增加静态 class 映射，并复用 `styles/foundation.ts` 的共享 scale。
- [x] 5.2 在 `packages/atelier/box/styles/theme.scss` 中为 `rounded`、`shadow` 增加静态 class 映射；`bg`、`borderColor` 继续引用 `--color-*`。
- [x] 5.3 调整 `Box.tsx`，移除 `styleFromTokens` 对结构属性的调用，改用 class 组合。
- [x] 5.4 保留 Box 现有公开 props 名称，不引入兼容别名。
- [x] 5.5 更新 Box 单元测试，验证结构 class、颜色变量和自定义 style 的合并结果。

## 6. 示例、文档与迁移

- [x] 6.1 更新 `packages/atelier/system/examples` 中所有 `createSystem`、`defineTokens`、`defaultConfig` 用法。
- [x] 6.2 更新 `packages/atelier/__stories__` 中依赖旧 system 或结构 token 的示例。
- [x] 6.3 更新 `packages/atelier/README.md`，说明 `useTheme` 只注入颜色，结构变量来自静态 `styles.css`。
- [x] 6.4 搜索并更新仓库内所有旧 API 引用，删除兼容转发导出。
- [x] 6.5 如发生代码变更，在根目录运行 `graphify update .` 保持知识图谱最新。

## 7. 验证

- [x] 7.1 运行 `pnpm --filter @omnific/atelier typecheck`。
- [x] 7.2 运行 `pnpm --filter @omnific/atelier test`。
- [x] 7.3 运行 `pnpm --filter @omnific/atelier build`，确认 `dist/styles.css` 包含静态 foundation 变量。
- [x] 7.4 运行 `pnpm typecheck`。
- [x] 7.5 运行 `pnpm lint:fix`。
- [x] 7.6 检查 `openspec/changes/atelier-color-only-theme` 下所有 Markdown 均为简体中文，除非是固定结构关键词、路径、命令或代码标识。
