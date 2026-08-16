## 1. 集中样式源码

- [x] 1.1 创建 `packages/atelier/styles`，添加共享变量和函数，并将组件样式目录放回对应组件目录。
- [x] 1.2 将 Button 的布局与主题样式迁移到 `button/styles`，删除旧 CSS 源文件。
- [x] 1.3 在 `$component-prefixes` 注册 Button，并让全部组件样式通过 `component-prefixes()` 获取前缀。
- [x] 1.4 使用单层 `&` 嵌套组织 Button modifier、状态和伪类，保留需要独立表达的复合选择器。
- [x] 1.5 在 `button/constants.ts` 集中声明 `buttonPrefixCls`，供 Button 及其内部子组件复用。

## 2. 接入构建与发布

- [x] 2.1 为 Atelier 添加锁定版本的 `sass-embedded` 开发依赖并更新 lockfile。
- [x] 2.2 使用 `button/styles/index.scss` 合并布局与主题，并通过根 `styles.scss` 聚合组件样式。
- [x] 2.3 在 package build 中将根 `styles.scss` 编译为单一 `dist/styles.css`，保持 `@omnific/atelier/styles.css` export。
- [x] 2.4 删除源码树中的组件 CSS，组件目录只维护 SCSS 源码。

## 3. 验证

- [x] 3.1 验证 Sass 编译产物包含映射生成的 Button 选择器，且未注册组件会导致编译失败。
- [x] 3.2 运行 Button 测试、`pnpm typecheck`、`pnpm lint:fix` 和 Atelier build。
- [x] 3.3 运行 `graphify update .` 并确认知识图谱已覆盖新的样式和 OpenSpec 结构。
