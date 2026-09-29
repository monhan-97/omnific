## ADDED Requirements

### Requirement: 在 Atelier 内以 subpath 提供 System token API

`@omnific/atelier` MUST 在 `packages/atelier/system` 实现并经 `@omnific/atelier/system` 导出 `defineTokens`、`mergeTokens`、`createSystem`、`applyCssVars` 与 `useTheme`。`createSystem` MUST 接受 `name: string` 与一份或多份 `ThemeTokens`（MUST NOT 再要求 `SystemConfig` / `theme.tokens` 包装），合并后返回精简版 `SystemContext`（后写入覆盖先写入的同名 token）。该入口 MUST NOT 要求 React Provider / Context。仓库 MUST NOT 为此新增独立的 `@omnific/system` package。

#### Scenario: 合并业务语义色

- **WHEN** 调用方先传入只含结构 scale 的 tokens，再传入含 `colors.bg` 与 `colors.bg.muted` 的业务 tokens
- **THEN** 合并后的系统包含业务颜色 token，且业务同名 token 覆盖先前同名项

#### Scenario: 无 Provider 即可描述系统

- **WHEN** 维护者从 `@omnific/atelier/system` 导入并调用 `createSystem('app', defineTokens(...))`，再读取 `cssVars`
- **THEN** 无需挂载任何 React 上下文即可得到 token CSS 变量表

#### Scenario: 包边界对齐 Chakra subpath

- **WHEN** 维护者检查 workspace 包列表与 Atelier `package.json` exports
- **THEN** 存在 `@omnific/atelier/system` export，且不存在名为 `@omnific/system` 的独立 package

### Requirement: 首期 SystemContext 仅包含 token 构建所需属性且不含 get 方法

`createSystem` 返回类型 MUST 命名为 `SystemContext`（对象类型名，MUST NOT 表示 React Context）。首期公开实例 MUST 包含：`name`（主题名）、`_config`（类型为合并后的 `ThemeTokens`）、`cssVars`（扁平 CSS 变量表属性）。MUST NOT 包含 `token`、`isValidSystem`、`$$atelier`、任何 `get*` 方法（例如 `getTokenCss`）、`utility` / `utilities`。MUST NOT 导出 `SystemConfig`、`defineConfig` 或 `TokenDictionary`。首期 MUST NOT 导出或实现运行时 `css`、`cva`、`sva`、conditions、recipe 相关 API。

#### Scenario: 检查首期返回值键名

- **WHEN** 维护者检查 `createSystem('app', {})` 的公开键
- **THEN** 至少包含 `name`、`_config`、`cssVars`，且不存在 `token`、`$$atelier`、`getTokenCss`、`tokens`、`utility`、`css`、`cva`、`sva`

### Requirement: 经 useTheme 运行时注入扁平 CSS 变量

首期 MUST 在 `SystemContext` 上提供可用的 `cssVars` 属性。`@omnific/atelier/system` MUST 导出 `useTheme(system)`，返回用于注入的对象 ref（`RefObject`）。注入 MUST 仅通过挂在 `document.head` 下的 `<style>` 完成，MUST NOT 使用元素 inline style。`<style>` MUST 以 `system.name` 为 key 复用，并以引用次数管理生命周期，归零时 MUST 移除。目标节点（含 `document.documentElement`）MUST 设置 `data-atelier-theme` 为 `system.name`。`applyCssVars` MUST 返回卸载函数。注入 MUST NOT 依赖 React Context、Theme Provider 或 `useId`。首期 CSS 变量名 MUST 使用扁平形态（例如 `--color-bg`、`--space-4`、`--radius-md`、`--shadow-sm`），MUST NOT 改为 `--atelier-colors-bg` 这类路径前缀名。

#### Scenario: 未绑定 ref 时注册到 documentElement

- **WHEN** 调用方在组件中调用 `useTheme(system)` 且未将返回的 ref 绑定到任何元素
- **THEN** `document.documentElement` 上存在对应的扁平 CSS 变量（例如 `--color-bg`），且带有 `data-atelier-theme={system.name}`

#### Scenario: 绑定 ref 时作用域到元素

- **WHEN** 调用方将 `useTheme(system)` 返回的 ref 绑定到某个 HTMLElement
- **THEN** 该元素上写入扁平 CSS 变量，且不再依赖把同一份变量留在 `:root` 作为本次注入目标

#### Scenario: 扁平颜色变量名

- **WHEN** tokens 声明 `colors.bg` 的值为 `#ffffff`，并经 `cssVars` 与 `useTheme` 注入
- **THEN** 目标节点上存在 `--color-bg: #ffffff`，且不出现 `--atelier-colors-bg`

### Requirement: System 核心提供 defaultConfig 且允许业务覆盖

system 的 `defaultConfig` MUST 提供 spacing、radii、shadows 等结构 scale，并可包含库默认语义色。业务语义色扩展 MUST 由调用方通过额外的 `defineTokens` 传入 `createSystem` 合并，再经 `useTheme` 注入。

#### Scenario: 合并覆盖 defaultConfig 颜色

- **WHEN** 维护者使用 `createSystem('app', defaultConfig, customColors)` 创建系统
- **THEN** 同名颜色 token 以自定义值为准，并可经 `useTheme` 注入

### Requirement: 导出可供组件消费的 token 取值类型

`@omnific/atelier/system` MUST 让 TypeScript 能够从具体 system / tokens 推导出各类 token 的取值联合类型，供 Atelier 组件 props 引用。组件 MUST NOT 再维护与该 tokens 脱节的手写语义色字面量联合类型作为唯一事实源。

#### Scenario: Box 背景取值跟随主题 colors

- **WHEN** Atelier 默认主题 tokens 的 `colors` 增加新键，并完成类型导出更新
- **THEN** `Box` 的 `bg` prop 类型包含该新键，而无需在 `box/types.ts` 手写追加同名字符串字面量
