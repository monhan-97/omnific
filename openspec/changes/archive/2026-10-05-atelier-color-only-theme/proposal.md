# 变更：将 Atelier 主题系统收敛为仅运行时注入颜色

## Why

当前 `@omnific/atelier/system` 的 `ThemeTokens` 同时包含 `colors`、`spacing`、`radii`、`shadows`、`fonts`、`fontSizes`、`controlHeights` 与 `focusRings`，`useTheme` 会把所有分类都写成 CSS 变量。这会让尺寸、间距、圆角和阴影也依赖运行时注入，和组件库应有的静态 CSS 边界混在一起。

本变更将主题系统收敛为颜色系统：`useTheme` 保留当前 ref + `document.head` 注入方式，但只注入扁平 `--color-*` 变量；尺寸、间距、圆角、字体、控件高度和阴影全部由静态 SCSS 提供。组件目录、样式职责和 wrapper 行为保持 Radix 风格，但不引入 `Theme` 组件。

## What Changes

- **BREAKING**：将 `ThemeTokens` 收敛为扁平颜色对象，颜色键直接作为语义名，例如 `bg`、`fg-muted`、`accent-solid`，不再使用 `colors.bg` 这类分类包装。函数参数可以抽象为 `ColorValue`、`ColorSet`、`SystemContext`；颜色键联合和 `createSystem` 返回值 MUST 继续由 TypeScript 自动推导，MUST NOT 手写 `ColorToken`、`ThemeColors`、`ThemeColorKeys`、`MergeColorsResult` 等键联合或返回结果类型。
- **BREAKING**：`createSystem(name, ...colorSets)` 只接受扁平颜色对象，返回类型由 TypeScript 自动推导。调用方需要别名时使用 `ReturnType<typeof createSystem>`，不再手写新的 token 类型。
- **BREAKING**：`defineTokens` / `mergeTokens` 调整为 `defineColors` / `mergeColors`；`defaultConfig` 调整为 `defaultColors`；`styleFromTokens` 删除。
- 保留 `applyCssVars`、`useTheme(system)` 与 `data-atelier-theme`。`useTheme` 继续返回 `RefObject`，继续通过 `document.head` 下的 `<style>` 复用和卸载，但不使用 `Theme` 组件、React Context 或 Theme Provider。
- `cssVars` 只允许生成 `--color-*`。`--space-*`、`--radius-*`、`--font-*`、`--font-size-*`、`--control-height-*`、`--shadow-*` 等结构变量由 `packages/atelier/styles/_foundation.scss` 静态声明。
- 静态结构 scale 的 TypeScript 侧只允许存在一份共享清单 `packages/atelier/styles/foundation.ts`，用于 token 名、class 后缀和 props 类型推导；CSS 值只在 `_foundation.scss` 中声明。Box 或其他组件 MUST NOT 复制一份自己的 scale 配置。
- 组件颜色统一使用语义 token：`--color-accent-*`、`--color-danger-*`、`--color-success-*`、`--color-warning-*`。组件样式不得直接依赖 `--color-blue-*`、`--color-red-*` 这类具体色相。
- 主题枚举只负责选择颜色 system。组件 `size`、`shape` 等结构枚举继续使用静态类名；如果未来提供 `radius`、`scaling` 等属性，也必须映射到静态 class 或 `data-*` 选择器，不得由 `useTheme` 注入数值。
- `Box` 的 `p`、`px`、`py`、`rounded`、`shadow` 改为消费静态 class；`bg`、`borderColor` 继续消费 `--color-*`。
- 组件和样式目录保持一组件一目录，继续按 `layout.scss`、`theme.scss`、`index.scss` 拆分职责；不引入全量 recipe 引擎或中央组件样式目录。

## 非目标

- 不新增 `Theme` 组件。
- 不引入 React Context、Theme Provider 或新的注入 API。
- 不引入运行时 `css`、`cva`、`sva`、utilities 或 recipe 系统。
- 不新增独立的 `@omnific/system` workspace package。
- 不重做现有组件视觉，不增加组件范围外的功能。
- 不改变 `useTheme` 的 ref 行为和 `<style>` 生命周期模型。

## 影响范围

- 受影响 capability：`atelier-system`、`atelier-style-architecture`
- 受影响 package：`packages/atelier`
- 受影响公开 API：`ThemeTokens`、`createSystem`、`defineTokens`、`mergeTokens`、`defaultConfig`、`styleFromTokens`，以及手写 token 取值类型；`SystemContext` 保留为函数参数契约，但不再手写颜色键联合
- 用户可观察行为：`useTheme` 只产生 `--color-*`；结构样式不再随 system 注入；组件颜色改由语义色控制
- 破坏性变更：需要同步迁移颜色配置、导出名称、类型引用和 `Box` 属性实现

## 迁移要求

颜色配置由：

```ts
createSystem('app', {
  colors: {
    bg: { value: '#ffffff' },
    'accent-solid': { value: '#1677ff' },
  },
});
```

调整为：

```ts
createSystem('app', {
  bg: { value: '#ffffff' },
  'accent-solid': { value: '#1677ff' },
});
```

调用方不得继续依赖 `_config`、`defaultConfig`、`defineTokens`、`mergeTokens` 或 `styleFromTokens`。仓库按现有模块规范直接移除旧名称与旧路径，不保留兼容转发导出。

## 测试范围

- `mergeColors` 对颜色覆盖顺序和扁平 CSS 变量名进行单元测试。
- `useTheme` 只注入 `--color-*`，不得注入 `--space-*`、`--radius-*`、`--control-height-*`。
- `useTheme` 继续覆盖 ref 绑定元素和 `documentElement` 两条路径，并验证 `<style>` 引用计数。
- 静态 foundation SCSS 包含结构变量，编译后的 `dist/styles.css` 可在不运行 `useTheme` 的情况下提供尺寸、间距、圆角、字体和阴影。
- Button 使用 `--color-accent-*` 与 `--color-danger-*`，不得在组件 theme 样式中直接引用具体色相 token。
- Box 的间距、圆角、阴影 props 输出静态 class，背景和边框色仍输出 `--color-*` 引用。
- 验证命令使用仓库已存在的脚本：

```bash
pnpm --filter @omnific/atelier typecheck
pnpm --filter @omnific/atelier test
pnpm --filter @omnific/atelier build
pnpm typecheck
pnpm lint:fix
```
