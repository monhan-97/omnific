## 1. Atelier system 最小 API

- [x] 1.1 新建 `packages/atelier/system`，实现 `defineTokens`、`mergeTokens`、`createSystem`；`createSystem` 直接接受 `ThemeTokens`；返回精简 `SystemContext`（`_config`、`cssVars`）。
- [x] 1.2 在 `@omnific/atelier` 的 `package.json` 增加 `@omnific/atelier/system` export。
- [x] 1.3 实现扁平命名的 `cssVars`（colors / spacing / radii / shadows 及字体、控件高度、焦点环等结构 token）。
- [x] 1.4 提供 `defaultConfig`（结构 scale + 库默认语义色）与 token 取值类型导出。
- [x] 1.5 在 `packages/atelier/system/__test__` 补充合并、`cssVars` 与类型推导测试；确认无 `isValidSystem` / `get*` / `SystemConfig` / `utility` / `css` / `cva` / `sva`，且无独立 `@omnific/system` 包。

## 2. 运行时主题注入（非 Context）

- [x] 2.1 实现 `applyCssVars`（写入目标作用域并返回卸载函数）。
- [x] 2.2 实现 `useTheme(system)`：返回注入用 ref；ref 绑定元素时写到该节点，ref 为 `null` 时写到 `:root`。MUST NOT 使用 React Context / Provider。
- [x] 2.3 从 `@omnific/atelier/system` 导出 `useTheme`；补充 hook 测试（`:root` 与元素作用域）。
- [x] 2.4 删除 `_tokens.scss`，根样式入口只聚合组件样式；Storybook preview 经 `useTheme` 注入默认主题。

## 3. Box 类型对齐

- [x] 3.1 `Box` 样式 props 取值类型改为消费 system token 联合类型。
- [x] 3.2 更新 `Box` 测试与 examples / stories。

## 4. 验证

- [x] 4.1 运行 `pnpm typecheck` 与 `pnpm lint:fix`。
- [x] 4.2 运行 Atelier 测试与 `pnpm --filter @omnific/atelier build`。
- [x] 4.3 运行 `pnpm build:storybook`（若需要）。
- [x] 4.4 运行 `graphify update .`。
