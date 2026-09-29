## MODIFIED Requirements

### Requirement: 语义 token 集中声明

Token 的 TypeScript 事实源 MUST 为 `@omnific/atelier/system` 的 `createSystem` / `defineTokens`。共享样式入口 MUST NOT 再加载 `_tokens.scss` 或等价静态 token 色板文件；仓库 MUST NOT 保留作为 token 事实源的手工 `_tokens.scss`。应用侧 MUST 通过 `useTheme(system)` 将 `cssVars` 运行时注入到 DOM（元素或 `:root`），MUST NOT 使用 React Context / Theme Provider 传递主题值。变量名 MUST 保持现有扁平约定（例如 `--color-bg`、`--space-4`）。组件 layout 与 theme MUST 通过这些变量取值；组件样式 MUST NOT 再声明一份 `:root` 色板，也 MUST NOT 硬编码与语义 token 重复的色值。默认态 MUST 直接使用语义 token，MUST NOT 在组件根上把语义 token 再赋给一组默认 `--btn-*`。变体选择器 MUST 只改组件局部变量（如 `--btn-*`），不得为每个变体重写一套完整的 `color` / `background` 声明。

#### Scenario: Button 主题消费共享 token

- **WHEN** 维护者检查 `button/styles/theme.scss` 与 `button/styles/layout.scss`
- **THEN** 两文件均不包含 `:root` 色板；默认态直接使用 `var(--color-*)` 等共享变量；primary、danger 仅改 `--btn-*` 插槽；disabled 和焦点环通过 `var(--color-*)`、`var(--focus-ring-default)` 取值；高度与圆角通过 `var(--control-height-*)` 与 `var(--radius-*)` 取值

#### Scenario: 运行时注入自定义主题

- **WHEN** 应用侧 `createSystem('app', defaultConfig, customTokens)` 并调用 `useTheme(system)`
- **THEN** 对应目标（`:root` 或容器元素）上出现扁平 CSS 变量，子树内组件通过 `var(--*)` 消费，且全程无 React Context

#### Scenario: 无静态 token 样式文件

- **WHEN** 维护者检查 `packages/atelier/styles`
- **THEN** 不存在 `_tokens.scss`；根 `styles/index.scss` 只聚合组件样式，不声明 `:root` token 色板
