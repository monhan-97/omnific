# Atelier 样式架构规格增量

## MODIFIED Requirements

### Requirement: 语义 token 集中声明

颜色 token 的 TypeScript 事实源 MUST 为 `@omnific/atelier/system` 的公开 `createTheme`、`defaultTokens` 与 `defaultColors`；`createTheme` 内部调用不导出的 `createSystem`。primitive 色阶 MUST 位于嵌套 `tokens.colors`，组件可消费的语义颜色 MUST 位于嵌套 `semanticTokens.colors`。`createSystem` MUST 在同一个配置循环中合并 tokens 与嵌套 colors，并在循环结束后通过 `resolveColors` 使用内部扁平 token record 生成颜色和 CSS 变量，再由 `createTheme` 将传入配置解析出的扁平 `cssVars` 写入 `SystemContext`；公开 API MUST NOT 要求调用方使用 `defineTokens` 或 `defineColors`。应用侧 MUST 通过 `useTheme(system)` 将 `semanticTokens.colors` 产出的 `cssVars` 运行时注入到 DOM（元素或 `:root`）。颜色变量名 MUST 使用扁平 `--color-*` 约定，例如 `--color-bg`、`--color-fg-muted`、`--color-accent-solid`。组件 layout 与 theme MUST 通过 `--color-*` 消费颜色，MUST NOT 在组件内声明另一份颜色色板，MUST NOT 硬编码与语义颜色重复的色值，MUST NOT 直接消费 primitive 色相变量。

结构 token MUST 由 `packages/atelier/styles/tokens/*.scss` 或其他静态 SCSS 文件声明，包含 `--space-*`、`--radius-*`、`--font-*`、`--font-size-*`、`--control-height-*`、`--shadow-*` 等非颜色变量。结构变量 MUST 在构建期进入 `dist/styles.css`，MUST NOT 由 `useTheme` 注入。`packages/atelier/styles` MUST NOT 保存语义颜色色板或与 `system/defaults/colors.ts` 重复的颜色值。结构 scale 的公开值和 prop defs MUST 放在 `packages/atelier/props/*.props.ts`，utility class MUST 放在 `packages/atelier/styles/utilities/*.scss`。

#### Scenario: 组件同时消费颜色与结构变量

- **WHEN** 维护者检查 `button/styles/theme.scss` 与 `button/styles/layout.scss`
- **THEN** 颜色规则使用 `var(--color-role-*)` 或 `var(--color-*)`
- **AND** 高度、间距、圆角、字体和阴影使用静态结构变量
- **AND** 不存在由 `useTheme` 注入的结构变量

#### Scenario: 运行时注入单个主题颜色

- **WHEN** 应用侧调用 `createTheme('app', customTheme)` 并调用 `useTheme(system)`
- **THEN** 当前 system 的 `--color-*` 变量进入对应 `<style>`
- **AND** 目标节点通过 `data-atelier-theme` 选择主题
- **AND** 全程无 React Context、Theme Provider 或 `Theme` 组件

#### Scenario: 结构变量不依赖运行时

- **WHEN** 消费方只导入 `@omnific/atelier/styles.css`，不调用 `useTheme`
- **THEN** 组件仍能获得尺寸、间距、圆角、字体和阴影基础值
- **AND** 只有颜色值需要由应用侧提供或使用默认主题

### Requirement: 组件颜色只依赖语义 token

Atelier 组件主题样式 MUST 使用语义颜色 token，例如 `--color-accent-*`、`--color-danger-*`、`--color-warning-*`、`--color-success-*` 和 `--color-info-*`。组件 MUST NOT 直接依赖 primitive 色相 token，例如 `--color-gray-*`、`--color-red-*`。主题枚举与业务 system MUST 负责把具体颜色映射到语义 token。

palette MUST 继续使用现有角色键契约：`contrast`、`fg`、`subtle`、`muted`、`emphasized`、`solid`、`hover`、`active`、`focus-ring`、`border`。MUST NOT 新增 `neutral` palette 或 `bg`、`solid-hover`、`solid-active` 等默认颜色属性。Button 的 `default` MUST 使用现有默认角色变量，`primary` MUST 映射 `accent`，`danger` MUST 映射同名 palette。共享 Sass 映射 MUST 根据 `data-color` 生成 `--color-role-*` 变量，组件 MUST NOT 为每个颜色重复手写角色别名。

#### Scenario: Button 使用语义强调色

- **WHEN** 维护者检查 Button 主题样式
- **THEN** primary、outline、hover、active 和 focus 规则使用 `--color-role-*`
- **AND** `--color-role-*` 由共享 palette 映射生成
- **AND** 不存在 `--color-gray-*` 或 `--color-blue-*`

#### Scenario: Button 颜色角色保持现有集合

- **WHEN** 维护者检查 `ButtonColor`
- **THEN** 只包含 `default`、`primary`、`danger`
- **AND** 不新增 `warning`、`success`、`info` 取值
- **AND** 根节点继续输出对应的 `data-color`

### Requirement: 主题边界不引入 Theme 组件

Atelier MUST 继续使用 `useTheme(system)` 作为主题注入入口，MUST NOT 新增 Theme 组件、Theme Provider 或 React Context。主题切换 MUST 通过选择不同 `SystemContext` 完成，MUST NOT 写入 `ThemeConfig`。组件目录和样式职责 MUST 保持一组件一目录、`layout.scss` 与 `theme.scss` 分离的 Radix 风格边界。共享 `system` 只处理颜色，共享 `styles` 只处理静态结构变量和组件样式聚合。首期 MUST NOT 引入运行时 `css`、`cva`、`sva`、recipe、slotRecipe、layerStyle、conditions 或 breakpoints。

#### Scenario: 使用 useTheme 包裹局部主题

- **WHEN** 应用侧需要局部主题
- **THEN** 调用 `useTheme(system)` 并将返回的 ref 绑定到容器
- **AND** 不引入 Theme 组件或 Provider

#### Scenario: 通过不同 system 切换主题

- **WHEN** 应用侧需要从 `light` 切换到 `dark`
- **THEN** 将 `useTheme` 的入参从 `lightSystem` 替换为 `darkSystem`
- **AND** 不修改 `ThemeConfig` 或组件实现

#### Scenario: 检查组件样式边界

- **WHEN** 维护者检查 Atelier 组件目录
- **THEN** 每个组件的实现、类型、常量、样式、示例和测试仍位于自身目录
- **AND** 组件样式通过 `layout.scss` 与 `theme.scss` 分离职责
- **AND** 不存在集中承载组件状态的 recipe 文件

## ADDED Requirements

### Requirement: 主题配置保持单一职责

`ThemeConfig` MUST 只描述一个主题的颜色配置。`ThemeConfig` MUST NOT 包含 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme`、`defaultThemeName` 或任何主题注册、当前主题和切换状态。主题注册表、当前主题状态和切换逻辑 MUST 位于应用层或独立的主题选择模块。

#### Scenario: 检查 ThemeConfig 字段

- **WHEN** 维护者检查 `ThemeConfig` 类型和任意主题配置文件
- **THEN** 只存在 `tokens` 与 `semanticTokens` 颜色配置
- **AND** 不存在浅色/深色模式字段、主题列表或切换函数

#### Scenario: 新增主题不修改现有配置

- **WHEN** 维护者新增 `warmTheme` 并调用 `createTheme('warm', warmTheme)`
- **THEN** 不需要修改 `lightTheme`、`darkTheme` 或 `defaultTheme`
- **AND** 不需要给现有 system 增加模式字段

#### Scenario: 两个主题独立切换

- **WHEN** 应用层分别渲染使用 `lightSystem` 与 `darkSystem` 的局部主题容器
- **THEN** 每个容器通过各自的 `data-atelier-theme` 命中对应颜色变量
- **AND** 一个容器的主题切换不影响另一个容器
