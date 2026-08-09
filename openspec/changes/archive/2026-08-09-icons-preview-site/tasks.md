## 1. 建立预览应用

- [x] 1.1 在 `docs/icons` 创建预览应用 package manifest、样式和首页 React 页面。
- [x] 1.2 从 `@omnific/icons` 公开导出建立类型安全的图标展示元数据，并添加导出同步测试。
- [x] 1.3 实现响应式图标网格、大小写不敏感搜索、空结果状态和图标详情区域。
- [x] 1.4 实现 SVG/JSX 示例生成、Clipboard API 复制、分组格式菜单和成功/失败反馈。
- [x] 1.5 添加键盘交互、可访问名称、焦点管理和窄屏布局测试。

## 2. GitHub Actions 与 Pages

- [x] 2.1 新增 pull request/默认分支质量 workflow，使用 `pnpm install --frozen-lockfile` 并运行仓库已有 `typecheck`、`lint`、`test` 和 `pnpm --dir docs/icons build` 命令。
- [x] 2.2 新增默认分支 Pages 部署 job，配置 artifact 上传、部署权限、并发取消和 Node/pnpm 缓存。
- [x] 2.3 为 `docs/icons` 配置仓库名子路径 base URL，并验证部署产物中的资源 URL 和入口文件。
- [x] 2.4 用 YAML/workflow 检查验证触发条件、权限和失败时不部署的行为。

## 3. 文档与验证

- [x] 3.1 更新 `packages/icons/README.md` 或仓库文档，记录 `docs/icons` 的本地启动、构建和线上预览地址。
- [x] 3.2 运行受影响 package 与站点的 typecheck、lint、test、build，并记录结果。

## 验证记录

- [x] `pnpm --filter @omnific/icons typecheck`
- [x] `pnpm --filter @omnific/icons test`
- [x] `pnpm --filter @omnific/icons build`
- [x] `pnpm --dir docs/icons typecheck`
- [x] `pnpm --dir docs/icons test`
- [x] `pnpm --dir docs/icons lint`
- [x] `BASE_URL=/omnific/ pnpm --dir docs/icons build`
- [x] `BASE_URL=/omnific/ pnpm --dir docs/icons verify:pages`
- [x] `pnpm typecheck`
- [x] `pnpm test`

## 4. Lucide 风格与 react-scripts 迁移

- [x] 4.1 删除 `docs/icons` 的 Docusaurus 依赖、`docusaurus.config.ts`、Docusaurus 页面入口和主题 shell，改为本地 `@omnific/react-scripts` package scripts。
- [x] 4.2 新增 `public/index.html`、`src/index.tsx` 和自定义 React app 入口，保持图标元数据与 `@omnific/icons` 公开导出同步测试。
- [x] 4.3 严格参考 `https://lucide.dev/icons/` 的图标浏览主体重做页面：无 navbar、搜索、Customizer、真实 Categories、图标网格和底部详情面板；不显示 All，重复选择当前分类时恢复全部图标。
- [x] 4.4 将 Customizer 的 `color`、`size`、`strokeWidth` 和 `absoluteStrokeWidth` 同步应用到网格、详情预览和代码示例。
- [x] 4.5 更新 GitHub Actions、Pages artifact 检查和 README 命令，使用 `react-scripts build` 产出的 `docs/icons/build`。
- [x] 4.6 重新运行 `docs/icons` 与受影响 packages 的 typecheck、lint、test、build、Pages artifact 校验、`graphify update .` 和 React Doctor。
- [x] 4.7 对齐 Lucide 的图标单元格、hover/focus tooltip、详情关键词与分类标签、SVG/JSX 分组菜单和 1 秒 confetti 复制动画，并验证抽屉打开时仍可切换图标。
