# 任务

## 1. 主题模型与类型

- [x] 1.1 新增 `TokenValue`、`TokenGroup`、`TokenDefinition`、`ColorValue`、`ColorGroup`、`ColorDefinition`、`ThemeConfig` 与 `SystemContext`；`tokens.colors` 与 `semanticTokens.colors` 都使用嵌套定义。
- [x] 1.2 在 `createSystem` 内部按配置顺序直接合并全部 `ThemeConfig` 的 tokens 与语义颜色，不构造中间 `ThemeConfig` 对象；后传入配置覆盖先传入配置。
- [x] 1.3 让 `mergeTokenDefinition` 在合并嵌套 token 时直接写入扁平 `group.shade` key，输出完全解析的 `Record<string, string>`，不保留 `flattenTokens`。
- [x] 1.4 用同一个 `for...of` 合并 tokens 与嵌套 color groups；循环结束后调用一次 `resolveColors`，通过扁平 `tokens[reference]` 解析引用并生成 colors 与 cssVars。
- [x] 1.5 将 `SystemContext` 收敛为 `name` 与由传入配置解析出的扁平 `cssVars`，不暴露 `colors` 或内部 token record；删除公开 `defineTokens`、`defineColors`、`mergeColors` 与 `flattenColors`，同步更新导出和调用方。
- [x] 1.6 新增 `defaultTokens`、`defaultTheme`，将 `defaultColors` 调整为默认语义颜色；`defaultTokens` 与 `defaultColors` 都保持嵌套结构；只保留语义层实际引用的 `white`、`black` 与 palette 色阶，`info` 使用独立 token。
- [x] 1.7 更新 `props/index.ts` 与 `system/defaults/index.ts` 的类型导入，确保 `DefaultColorKey` 来自生成的 `color-keys.gen.ts`。

## 2. System 与主题注入

- [x] 2.1 将 `createSystem` 调整为内部 `createSystem(...configs)`，只返回 `colors` 与 `cssVars`；新增公开 `createTheme(name, ...overrides)`，直接解析一个主题的配置层，补充 `name` 并只将传入配置解析为 `cssVars`，不自动合并 `defaultTheme`。`createSystem` 与 `extendTheme` 不导出。
- [x] 2.2 保持 `applyCssVars(system, target)` 与 `useTheme(system)` 签名不变；注入选择器只使用 `data-atelier-theme`，不得新增 `data-atelier-color-mode`。
- [x] 2.3 保持 `document.head` `<style>` 按 `system.name` 复用与引用计数；`system.name` 作为主题身份，同名 system 由调用方保证使用同一配置。
- [x] 2.4 确认注入内容只包含语义颜色 `--color-*`，不产生 `--space-*`、`--radius-*`、`--control-height-*` 或 `--shadow-*`。
- [x] 2.5 更新 `system/examples`，用独立配置创建 `light`、`dark`、`warm` 等 system，并在应用层选择 system，不把主题切换写入 `ThemeConfig`。
- [x] 2.6 构建时由 `defaultSystem.cssVars` 生成 `:where(:root)` 默认颜色规则并写入 `dist/styles.css`；不新增 `systemToCss` 公开 API。
- [x] 2.7 更新 README，说明默认主题静态回退、根级颜色注入和自定义主题覆盖关系。

## 3. Color Palette 与组件

- [x] 3.1 保持 `defaultColors` 现有属性集合与解析结果不变；在可归类时将现有颜色值改为 primitive token 引用，不新增 `neutral` palette、`bg`、`solid-hover`、`solid-active` 或其他新键。
- [x] 3.2 保持 `color-role.scss` 现有 `default`、`primary`、`danger` 映射；不新增六色 palette 循环，也不删除 `default` 专用 mixin。
- [x] 3.3 保持 `ButtonColor` 为 `default | primary | danger`，不扩展 `warning`、`success`、`info`；类型测试同步保持三值断言。
- [x] 3.4 确认 `default`、`primary`、`danger` 的默认外观与当前实现等价；如有视觉差异，必须在变更说明中列出。
- [x] 3.5 检查 Button theme SCSS，确保只消费 `--color-role-*` 和语义颜色，不直接引用具体色相。
- [x] 3.6 检查 `box`、`button` 与其他组件是否仍只消费 `--color-*`，不新增结构 token 的运行时依赖。

## 4. 测试与示例

- [x] 4.1 更新 `system` 测试，覆盖嵌套 `ThemeConfig`、`mergeTokenDefinition` 扁平输出、扁平 token 查找、颜色 group 合并、primitive 引用解析、未知引用、`defaultColors` 键集合不增、info 独立性和生成颜色键同步。
- [x] 4.2 更新 `useTheme` 测试，覆盖 ref 作用域、documentElement 回退、属性卸载和样式节点复用；确认不产生 `data-atelier-color-mode`。
- [x] 4.3 保持 Button 测试覆盖 `default`、`primary`、`danger`，不新增 `warning`、`success`、`info` 场景。
- [x] 4.4 更新 `system/examples`、`__stories__` 与 `packages/atelier/README.md`，展示嵌套 `ThemeConfig` 创建不同 system、在应用层切换 system 的用法。
- [x] 4.5 检查仓库中所有旧 `createSystem`、`defaultColors`、`defineTokens`、`defineColors`、`mergeColors`、`flattenColors`、扁平颜色配置和 `useTheme(system)` 调用，直接迁移到以 `createTheme` 为公开入口的新 API。
- [x] 4.6 新增类型测试，确认 `ThemeConfig` 不接受 `mode`、`colorMode`、`themes`、`currentTheme` 或 `setTheme`。
- [x] 4.7 新增运行时注入测试，覆盖根级自动注入、局部配置变量注入与逐层继承、主题名转义和结构 token 排除。

## 5. 构建与发布边界

- [x] 5.1 确认 `dist/styles.css` 仍包含静态结构 token 与 Button palette 角色规则。
- [x] 5.2 确认 Atelier 构建脚本从 `defaultSystem.colors` 生成 `system/defaults/color-keys.gen.ts`。
- [x] 5.3 确认 `packages/atelier/package.json` 的 `./system` export 和类型声明包含新增公开 API。
- [x] 5.4 检查未直接复制 Chakra 源码；若实现中复制了代码片段，补充 MIT 许可证和版权声明。
- [x] 5.5 评估是否需要 changeset；若 `@omnific/atelier` 的可发布 API 发生破坏性变化，添加对应 changeset。
- [x] 5.6 确认 `dist/styles.css` 包含默认主题 `--color-*` 规则，且不包含结构 token；确认 `./system` 不导出 `systemToCss`、`createSystem` 或 `extendTheme`。

## 6. 验证

- [x] 6.1 在仓库根目录运行 `pnpm --filter @omnific/atelier typecheck`。
- [x] 6.2 在仓库根目录运行 `pnpm --filter @omnific/atelier test`。
- [x] 6.3 在仓库根目录运行 `pnpm --filter @omnific/atelier build`，并检查 `dist/styles.css` 与 `dist/system` 类型产物。
- [x] 6.4 在仓库根目录运行 `pnpm typecheck`。
- [x] 6.5 在仓库根目录运行 `pnpm lint:fix`。
- [x] 6.6 在仓库根目录运行 `graphify update .`。
- [x] 6.7 检查 `openspec/changes/atelier-semantic-color-system` 下所有 Markdown 均为简体中文，固定结构关键词、路径、命令和代码标识保持原文。
