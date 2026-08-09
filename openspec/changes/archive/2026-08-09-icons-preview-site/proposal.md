# 变更：为图标包建立 GitHub Pages 预览站点

## Why

`@omnific/icons` 目前只有 package README 和组件源码，维护者及使用者无法在浏览器中快速浏览全部图标、确认图标名称或复制使用示例。发布包本身也没有一个可审计、可重复发布的在线展示入口。

## What Changes

- 在根目录 `docs/icons` 中新增基于本地 `@omnific/react-scripts` 的 React 单页图标预览应用，读取 `@omnific/icons` 的公开导出并展示图标网格。
- 预览页 MUST 严格参考 `https://lucide.dev/icons/` 的图标浏览主体体验：搜索、自定义图标外观控件、真实分类、图标网格和底部图标详情；站点自身不渲染导航栏。
- 提供按名称搜索、空结果提示、可取消选中的分类筛选、图标详情和 SVG/JSX 分组操作；复制成功使用与 Lucide 一致的 confetti 动画反馈，失败状态对辅助技术可观察。
- 提供适配桌面和窄屏的布局、键盘可操作控件和图标的可访问名称。
- 添加 GitHub Actions，在 pull request 中执行安装、typecheck、lint、test、build 检查；在默认分支更新后构建并发布静态产物到 GitHub Pages。
- 配置 Pages 的静态产物上传、仓库子路径兼容资源路径和构建产物缓存，使站点可从 `https://<owner>.github.io/<repository>/` 访问。
- 更新图标 package 或仓库文档，记录本地预览站点的开发、构建和部署入口。

## 非目标

- 不改变 `@omnific/icons` 的运行时 API、SVG 图稿或组件命名。
- 不使用 Docusaurus，不保留 Docusaurus 配置、主题 shell 或 navbar。
- 不将预览应用发布为 npm package，不引入服务端、数据库、登录或运行时网络请求。
- 不在本变更中增加图标编辑器、主题设计器或自动生成新图标的能力。

## 影响范围

- 受影响的 capability：`icon-preview-site`、`github-pages-deployment`
- 受影响的 package：`packages/icons`，以及新增的 `docs/icons` 预览应用目录
- 受影响的公开行为：新增一个静态站点 URL 和本地预览命令；现有 `@omnific/icons` 导入保持兼容。
- 受影响的仓库配置：新增 GitHub Actions workflow、Pages 部署配置和必要的构建元数据。
