# Atelier 样式架构规格增量

## MODIFIED Requirements

### Requirement: 语义 token 集中声明

颜色 token 的 TypeScript 事实源 MUST 为 `@omnific/atelier/system` 的 `createSystem` / `defineColors`。应用侧 MUST 通过 `useTheme(system)` 将 `colors` 产出的 `cssVars` 运行时注入到 DOM（元素或 `:root`）。颜色变量名 MUST 使用扁平 `--color-*` 约定，例如 `--color-bg`、`--color-fg-muted`、`--color-accent-solid`。组件 layout 与 theme MUST 通过 `--color-*` 消费颜色，MUST NOT 在组件内声明另一份颜色色板，MUST NOT 硬编码与语义颜色重复的色值。

结构 token MUST 由 `packages/atelier/styles/_foundation.scss` 或其他静态 SCSS 文件声明，包含 `--space-*`、`--radius-*`、`--font-*`、`--font-size-*`、`--control-height-*`、`--shadow-*` 等非颜色变量。结构变量 MUST 在构建期进入 `dist/styles.css`，MUST NOT 由 `useTheme` 注入。`packages/atelier/styles` MUST NOT 保存语义颜色色板或与 `system/defaults/colors.ts` 重复的颜色值。

结构 scale 的 TypeScript 清单 MUST 只有一份，位于 `packages/atelier/styles/foundation.ts`，并且只描述 token 名与 class 后缀。组件 MUST NOT 在自身目录复制 spacing、radius 或 shadow scale。

#### Scenario: 组件同时消费颜色与结构变量

- **WHEN** 维护者检查 `button/styles/theme.scss` 与 `button/styles/layout.scss`
- **THEN** 颜色规则使用 `var(--color-*)`
- **AND** 高度、间距、圆角、字体和阴影使用静态 foundation 变量
- **AND** 不存在由 `useTheme` 注入的结构变量

#### Scenario: 运行时注入自定义颜色

- **WHEN** 应用侧调用 `createSystem('app', defaultColors, customColors)` 并调用 `useTheme(system)`
- **THEN** 对应目标出现扁平 `--color-*` 变量
- **AND** 子树内组件通过 `var(--color-*)` 消费
- **AND** 全程无 React Context、Theme Provider 或 `Theme` 组件

#### Scenario: 结构变量不依赖运行时

- **WHEN** 消费方只导入 `@omnific/atelier/styles.css`，不调用 `useTheme`
- **THEN** 组件仍能获得尺寸、间距、圆角、字体和阴影基础值
- **AND** 只有颜色值需要由应用侧提供或使用默认颜色

## ADDED Requirements

### Requirement: 组件颜色只依赖语义 token

Atelier 组件主题样式 MUST 使用语义颜色 token，例如 `--color-accent-*`、`--color-danger-*`、`--color-warning-*`、`--color-success-*`、`--color-info-*`。组件 MUST NOT 直接依赖具体色相 token，例如 `--color-blue-*`、`--color-red-*`。主题枚举与业务 system MUST 负责把具体颜色映射到语义 token。默认态、变体、禁用态和焦点态 MUST 直接引用共享语义颜色，MUST NOT 在组件内维护仅用于转发的颜色别名。

#### Scenario: Button 使用语义强调色

- **WHEN** 维护者检查 Button 主题样式
- **THEN** primary、outline、hover、active 和 focus 规则使用 `--color-accent-*`
- **AND** danger 规则使用 `--color-danger-*`
- **AND** 不存在 `--color-blue-*` 或 `--color-red-*`

#### Scenario: 切换强调色不修改组件

- **WHEN** 应用侧把 system 的 `accent-solid`、`accent-hover`、`accent-active` 从蓝色切换为其他品牌色
- **THEN** Button 继续使用相同 `--color-accent-*` 变量
- **AND** 无需修改 Button 源码或 class

### Requirement: 结构属性使用静态 class

组件的尺寸、间距、圆角、阴影和形状 MUST 使用静态 class 或静态 CSS 选择器实现。主题枚举和组件结构枚举 MUST NOT 通过 `createSystem` 返回值、`useTheme` 或新的颜色变量改变结构值。`Box` 的 `p`、`px`、`py`、`rounded`、`shadow` MUST 映射到 `box/styles` 中定义的静态 class；`bg`、`borderColor` 可以继续解析为 `--color-*` 引用。

#### Scenario: Button 尺寸使用静态 class

- **WHEN** 使用方传入 `size="large"` 或 `shape="round"`
- **THEN** 组件输出对应静态 class
- **AND** `createSystem` 返回对象的 `cssVars` 不发生变化

#### Scenario: Box 结构属性输出静态 class

- **WHEN** 使用方传入 `p={4}`、`rounded="md"` 或 `shadow="sm"`
- **THEN** Box 输出 `box/styles` 中定义的静态 class
- **AND** 不通过 `styleFromTokens` 写入 padding、border-radius 或 box-shadow 的 inline style

#### Scenario: Box 颜色属性继续使用颜色变量

- **WHEN** 使用方传入 `bg="bg-muted"` 或 `borderColor="accent-solid"`
- **THEN** Box 输出对应的 `var(--color-bg-muted)` 或 `var(--color-accent-solid)`
- **AND** 这些颜色变量由 `useTheme` 注入

### Requirement: 主题边界不引入 Theme 组件

Atelier MUST 继续使用 `useTheme(system)` 作为主题注入入口，MUST NOT 新增 `Theme` 组件、Theme Provider 或 React Context。组件目录和样式职责 MUST 保持一组件一目录、`layout.scss` 与 `theme.scss` 分离的 Radix 风格边界。共享 `system` 只处理颜色，共享 `styles` 只处理静态基础变量和组件样式聚合。

#### Scenario: 使用 useTheme 包裹局部主题

- **WHEN** 应用侧需要局部主题
- **THEN** 调用 `useTheme(system)` 并将返回的 ref 绑定到容器
- **AND** 不引入 `Theme` 组件或 Provider

#### Scenario: 检查组件样式边界

- **WHEN** 维护者检查 Atelier 组件目录
- **THEN** 每个组件的实现、类型、常量、样式、示例和测试仍位于自身目录
- **AND** 组件样式通过 `layout.scss` 与 `theme.scss` 分离职责
- **AND** 不存在集中承载组件状态的 recipe 文件
