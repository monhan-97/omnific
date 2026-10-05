## Purpose

定义 `@omnific/atelier/system` 的扁平颜色 API：以 TypeScript 颜色对象为事实源，经 `createSystem` 合并并产出只包含 `--color-*` 的 `cssVars`，再由 `useTheme` 运行时注入 DOM；结构尺寸、间距、圆角、字体和阴影由静态 SCSS 提供。不引入 React Context、独立 system 包、Theme 组件或 recipe 样式引擎。

## Requirements

### Requirement: 在 Atelier 内以 subpath 提供 System token API

`@omnific/atelier` MUST 在 `packages/atelier/system` 实现并经 `@omnific/atelier/system` 导出 `defineColors`、`mergeColors`、`createSystem`、`applyCssVars` 与 `useTheme`。`createSystem` MUST 接受 `name: string` 或一份初始扁平颜色对象作为第一个参数，以及后续零份或多份扁平颜色对象。颜色对象 MUST 直接使用 `bg`、`fg`、`fg-muted`、`accent-solid` 这类语义颜色键，MUST NOT 再要求 `colors`、`tokens` 或 `theme.tokens` 包装。`defineColors` MUST 使用 const 泛型保留字面量键，`createSystem` 返回类型 MUST 由 TypeScript 自动推导。函数参数 MAY 抽象为 `ColorValue`、`ColorSet`、`SystemContext` 三个契约；MUST NOT 手写 `ColorToken`、`ThemeColors`、`ThemeColorKeys`、`MergeColorsResult` 等颜色键联合或返回结果类型。该入口 MUST NOT 要求 React Provider / Context，也 MUST NOT 引入 `Theme` 组件。仓库 MUST NOT 为此新增独立的 `@omnific/system` package。

#### Scenario: 合并扁平业务语义色

- **WHEN** 调用方先传入默认颜色，再传入包含 `bg` 与 `fg-muted` 的业务颜色
- **THEN** 合并后的 system 包含业务颜色，且业务同名键覆盖先前同名项

#### Scenario: 无 Provider 即可描述颜色系统

- **WHEN** 维护者从 `@omnific/atelier/system` 导入并调用 `createSystem('app', defineColors(...))`，再读取 `cssVars`
- **THEN** 无需挂载任何 React 上下文即可得到只包含 `--color-*` 的颜色变量表

#### Scenario: 包边界保持 Atelier subpath

- **WHEN** 维护者检查 workspace 包列表与 Atelier `package.json` exports
- **THEN** 存在 `@omnific/atelier/system` export，且不存在名为 `@omnific/system` 的独立 package

### Requirement: 首期 SystemContext 仅包含 token 构建所需属性且不含 get 方法

`createSystem` 返回类型 MUST 由 TypeScript 自动推导。`SystemContext` MAY 作为 `applyCssVars` / `useTheme` 的函数参数契约，只描述 `name`、`colors`、`cssVars` 结构，MUST NOT 从配置入参推导具体颜色键。公开实例 MUST 包含 `name`（主题名）、`colors`（合并后的扁平颜色对象）与 `cssVars`（只包含颜色变量的扁平表）。MUST NOT 包含 `_config`、结构 token、`token`、`isValidSystem`、`$$atelier`、任何 `get*` 方法、`utility` / `utilities`。MUST NOT 导出 `SystemConfig`、`defineConfig` 或 `TokenDictionary`。首期 MUST NOT 导出或实现运行时 `css`、`cva`、`sva`、conditions、recipe 相关 API。

#### Scenario: 检查返回值键名

- **WHEN** 维护者检查 `createSystem('app', {})` 的公开键
- **THEN** 至少包含 `name`、`colors`、`cssVars`
- **AND** 不存在 `_config`、`token`、`$$atelier`、`getTokenCss`、`tokens`、`utility`、`css`、`cva`、`sva`

#### Scenario: 合并颜色不产生结构 token

- **WHEN** 维护者合并包含 `bg`、`accent-solid` 与 `accent-hover` 的颜色配置
- **THEN** `createSystem` 返回对象的 `colors` 只包含这些颜色键
- **AND** `createSystem` 返回对象的 `cssVars` 只包含 `--color-*`
- **AND** 不产生 `--space-*`、`--radius-*`、`--font-size-*`、`--control-height-*` 或 `--shadow-*`

### Requirement: 经 useTheme 运行时注入扁平 CSS 变量

`createSystem` 返回对象 MUST 提供可用的 `cssVars` 属性。`@omnific/atelier/system` MUST 导出 `useTheme(system)`，返回用于注入的对象 ref（`RefObject`）。注入 MUST 仅通过挂在 `document.head` 下的 `<style>` 完成，MUST NOT 使用元素 inline style。`<style>` MUST 以 `system.name` 为 key 复用，并以引用次数管理生命周期，归零时 MUST 移除。目标节点（含 `document.documentElement`）MUST 设置 `data-atelier-theme` 为 `system.name`。`applyCssVars` MUST 返回卸载函数。注入 MUST NOT 依赖 React Context、Theme Provider、`Theme` 组件或 `useId`。`cssVars` 的变量名 MUST 使用扁平 `--color-${语义键}` 形态，例如 `--color-bg`、`--color-fg-muted`、`--color-accent-solid`。`useTheme` MUST NOT 注入结构变量。

#### Scenario: 未绑定 ref 时注册到 documentElement

- **WHEN** 调用方在组件中调用 `useTheme(system)` 且未将返回的 ref 绑定到任何元素
- **THEN** `document.documentElement` 上出现对应的 `--color-*` 变量
- **AND** 目标带有 `data-atelier-theme={system.name}`

#### Scenario: 绑定 ref 时作用域到元素

- **WHEN** 调用方将 `useTheme(system)` 返回的 ref 绑定到某个 HTMLElement
- **THEN** 该元素子树内出现对应的 `--color-*` 变量
- **AND** 不依赖把同一份变量留在 `:root` 作为本次注入目标

#### Scenario: 只注入颜色变量

- **WHEN** system 声明 `bg` 与 `accent-solid`，并经 `cssVars` 与 `useTheme` 注入
- **THEN** 目标作用域存在 `--color-bg` 与 `--color-accent-solid`
- **AND** 作用域内不出现由 `useTheme` 注入的 `--space-4`、`--radius-md`、`--control-height-md` 或 `--shadow-sm`

#### Scenario: 同一 system name 复用样式节点

- **WHEN** 多个组件使用相同 `system.name` 调用 `useTheme` 并依次卸载
- **THEN** `document.head` 中对应颜色 `<style>` 只创建一次
- **AND** 仅在最后一个引用卸载后移除

### Requirement: System 核心提供 defaultConfig 且允许业务覆盖

`@omnific/atelier/system` MUST 提供只包含语义颜色的 `defaultColors`，其键类型由对象字面量自动推导。业务颜色扩展 MUST 由调用方通过额外的 `defineColors` 传入 `createSystem` 合并，再经 `useTheme` 注入。结构尺寸、间距、圆角、字体和阴影 MUST 由静态 SCSS 提供，MUST NOT 作为 `defaultColors` 或 `createSystem` 返回值的一部分。

#### Scenario: 合并覆盖默认颜色

- **WHEN** 维护者使用 `createSystem('app', defaultColors, customColors)` 创建 system
- **THEN** 同名颜色以自定义值为准
- **AND** 未覆盖的默认颜色继续可用
- **AND** 不产生结构 token

#### Scenario: 不通过 System 提供尺寸

- **WHEN** 维护者检查 `defaultColors`、`createSystem` 参数与 `createSystem` 返回对象的 `cssVars`
- **THEN** 不存在 spacing、radii、shadows、fonts、fontSizes、controlHeights 或 focusRings 分类
- **AND** 尺寸相关实现位于静态 SCSS

### Requirement: 导出可供组件消费的 token 取值类型

`@omnific/atelier/system` MUST 让 TypeScript 通过 `keyof typeof defaultColors` 从默认颜色自动推导颜色键，供 Atelier 组件颜色 props 直接使用。函数参数 MAY 使用 `ColorValue`、`ColorSet`、`SystemContext`；MUST NOT 新增 `ColorToken`、`ThemeColors`、`ThemeColorKeys` 等颜色键联合或结果类型。组件 MUST NOT 再维护与默认颜色脱节的手写语义色字面量联合类型作为唯一事实源。结构 props 的类型 MUST NOT 从颜色 system 推导。

#### Scenario: Box 背景取值跟随主题颜色

- **WHEN** Atelier 默认颜色新增 `bg-elevated` 键，并完成类型导出更新
- **THEN** `Box` 的 `bg` prop 类型包含该新键
- **AND** 无需在 `box/types.ts` 手写追加同名字符串字面量

#### Scenario: 尺寸类型不依赖颜色 system

- **WHEN** 维护者检查 Button 与 Box 的结构 props 类型
- **THEN** `size`、`p`、`rounded`、`shadow` 等类型来自静态定义或固定联合类型
- **AND** 不依赖颜色对象或 `createSystem` 返回值
