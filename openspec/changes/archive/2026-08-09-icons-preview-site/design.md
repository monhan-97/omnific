# 设计：图标预览站点与 GitHub Pages 发布

## 背景

图标组件是 TypeScript/React package，导出清单已经是唯一可靠的图标集合来源。预览站点应在构建时导入这些导出，避免维护第二份图标注册表；GitHub Pages 只需要静态文件，因此不需要服务端或运行时 API。

## 目标

- 用根目录 `docs/icons` 下的本地 `@omnific/react-scripts` React 单页应用展示所有当前公开图标。
- 严格参考 `https://lucide.dev/icons/` 的图标浏览主体区域，提供搜索、自定义外观控件、真实分类、图标网格和底部详情体验，但不渲染任何站点导航栏。
- 站点内容与 `@omnific/icons` 的导出保持同步，新增图标后构建检查能发现遗漏。
- 通过 GitHub Actions 在 PR 阶段阻止不可构建的变更，并在默认分支自动部署。

## 非目标

- 不复制 SVG 几何数据到站点源码；图标必须来自 package 组件。
- 不使用 Docusaurus、Docusaurus 主题、Docusaurus navbar 或文档路由能力。
- 不在浏览器中动态扫描文件系统或请求 npm/CDN。

## 关键决策

### 图标清单

预览应用位于 `docs/icons`，使用本地 workspace 包 `@omnific/react-scripts` 提供 `react-scripts dev` 和 `react-scripts build`。应用入口使用 `public/index.html` 与 `src/index.tsx`，构建输出为 `docs/icons/build`。页面直接渲染 `@omnific/icons` 的图标组件，优先复用 `packages/icons/main.ts` 的具名导出，并维护类型安全的展示元数据数组（组件引用、本地名称和可选描述）。构建时通过测试断言数组中的组件名称与公开导出一致，避免静默缺图。

### 站点交互

首页不渲染 navbar，页面主体直接进入图标浏览器。布局参考 `https://lucide.dev/icons/` 的主体体验：上方提供搜索框；侧边提供 Customizer 控件和 Categories 导航，用于调整 `color`、`size`、`strokeWidth` 和 `absoluteStrokeWidth` 并浏览真实分类；主区域展示 `56px` 图标按钮和 `8px` 间距的响应式图标网格。Categories 不显示 All 项，重复选择当前分类会恢复未筛选状态。图标名称通过 hover/focus tooltip 呈现；点击或键盘确认打开底部详情抽屉，显示大图预览、关键词、分类标签和 SVG/JSX 分组操作，不显示版本号或贡献者区域。复制使用 `navigator.clipboard`，按钮文本保持稳定，成功时使用 Lucide 的 `data-confetti-text`、radial-gradient 粒子和 1 秒关键帧反馈；不可用时保留辅助技术可感知的失败状态。SVG 菜单同时提供 Data URL、SVG 下载和 PNG 下载，JSX 菜单提供组件名称及框架代码形式。

### 部署

使用仓库现有 pnpm、TypeScript 和 React 约定，在 `docs/icons` 依赖 `@omnific/react-scripts`、`@omnific/icons`、`react`、`react-dom` 和必要测试依赖。Actions 使用 `pnpm install --frozen-lockfile`，先执行仓库质量命令，再运行 `pnpm --dir docs/icons build`；部署使用 GitHub 官方 Pages artifact/deploy action。构建产物路径固定为 `docs/icons/build`，资源路径依赖 `@omnific/react-scripts` 的相对 `publicPath`，禁止硬编码本地绝对路径。

## 风险与缓解

- 新增导出但未加入展示元数据会造成站点缺图：用同步测试失败阻止合并。
- GitHub Pages 子路径导致资源 404：使用相对资源路径构建，并在 workflow 中上传构建目录后执行 smoke 检查。
- Clipboard API 在非安全上下文不可用：提供辅助技术可感知的失败反馈，不阻塞后续浏览或格式菜单操作。

## 验证策略

组件清单、分类切换、筛选、空结果、详情抽屉、Customizer 控件、无 navbar 约束、复制菜单和 confetti 状态使用 Vitest/React 测试覆盖；`docs/icons` 构建使用 `@omnific/react-scripts` 的 build 和 typecheck 命令。Actions 文件使用 YAML 解析或 workflow lint 检查，并验证权限、触发条件和 Pages 部署步骤。
