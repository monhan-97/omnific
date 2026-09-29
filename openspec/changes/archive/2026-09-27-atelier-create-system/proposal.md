# 变更：引入瘦版 createSystem 作为 Token 单一事实源

## Why

Atelier 当前用手工 `_tokens.scss` 声明 CSS 变量，`Box` 等组件手写与 token 脱节的取值类型。Token 无 TypeScript 合并能力，新增 token 要改 SCSS 与类型多处，容易漂移。

Chakra UI 的 `createSystem` 提供了 config → tokens → 可消费产物的模型。本变更只吸收**当前够用**的 token API：去掉 `SystemConfig` 包装与全部 `get*` 方法，直接合并 `ThemeTokens`。包边界对齐 Chakra subpath：`@omnific/atelier/system`。

主题注入采用**运行时 CSS 变量**，经 `useTheme` 把 `cssVars` 写到 DOM；**不**使用 React Context。未挂载注入节点时，变量注册到 `:root`。

## What Changes

- 在 `packages/atelier/system` 落地并经 `@omnific/atelier/system` 导出：`defineTokens`、`mergeTokens`、`createSystem`、`useTheme`。
- `createSystem(name, ...tokenSets)` 接受主题名与一份或多份 `ThemeTokens`；返回精简版 `SystemContext`：`name`、`_config`、`cssVars`。
- `useTheme(system)` 返回需注入的 ref；`ref` 指向元素时在该节点写入 CSS 变量，`ref` 为 `null` 时写入 `:root`。MUST NOT 引入 Theme Provider / React Context。
- MUST NOT 引入 `SystemConfig`、`defineConfig`、`getTokenCss`、`TokenDictionary` 的 `get*`、`utilities` / `utility`、运行时 `css` / `cva` / `sva`。
- 组件继续通过已有扁平 CSS 变量（`var(--color-bg)` 等）取值；主题由调用方 `createSystem` + `useTheme` 注入。
- 删除 `packages/atelier/styles/_tokens.scss`；`styles.css` 只保留组件 layout/theme。
- `defaultConfig` 提供库默认结构 scale 与语义色；业务覆盖通过额外 `defineTokens` 合并。
- `Box` props 取值类型消费 system token 联合类型；组件 utility 类仍由现有 SCSS 维护。
- MUST NOT 新增独立的 `@omnific/system` workspace 包。

## 非目标

- 不引入 `SystemConfig`、`get*` 方法或 utilities。
- 不 fork `@chakra-ui/react`，不引入运行时 `css` / recipe 样式引擎。
- 不实现基于 React Context 的 Theme Provider。
- 不把 CSS 变量改为 `--atelier-colors-bg` 形态。
- 不重做 Button 视觉或迁 recipe。

## 影响范围

- 受影响的 capability：新增 `atelier-system`；修改 `atelier-style-architecture`
- 受影响的 package：`packages/atelier`
- 公开行为：新增 `@omnific/atelier/system`（含 `useTheme`）；组件继续消费扁平 CSS 变量
