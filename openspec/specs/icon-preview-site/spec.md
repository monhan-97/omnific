# 图标预览站点规范

## Purpose

为 `@omnific/icons` 提供位于 `docs/icons`、可搜索、可访问、与公开导出同步且可部署到 GitHub Pages 的浏览器预览体验。

## Requirements
### Requirement: React scripts 应用壳

预览站点 MUST 是位于 `docs/icons` 的 React 单页应用，并 MUST 使用本地 workspace 包 `@omnific/react-scripts` 执行开发和生产构建。站点 MUST NOT 依赖或调用 Docusaurus。

#### Scenario: 本地开发

- **WHEN** 维护者在 `docs/icons` 运行开发命令
- **THEN** 应用通过 `react-scripts dev` 启动，并渲染自定义 React 图标浏览器

#### Scenario: 生产构建

- **WHEN** CI 或维护者运行 `pnpm --dir docs/icons build`
- **THEN** `react-scripts build` 生成 `docs/icons/build` 静态产物，且产物不包含 Docusaurus runtime、navbar 或主题 shell

### Requirement: Lucide 风格主体且无导航栏

预览站点 MUST 严格参考 `https://lucide.dev/icons/` 的图标浏览主体体验，提供搜索、自定义外观控件、真实分类导航、图标网格和底部图标详情。站点 MUST NOT 渲染顶部 navbar、文档导航、侧边文档目录或 Docusaurus 默认导航元素。

#### Scenario: 打开首页

- **WHEN** 用户打开预览站点首页
- **THEN** 页面主体直接显示图标浏览器，而不是先显示站点导航栏

#### Scenario: 调整图标外观

- **WHEN** 用户修改 Customizer 中的 `color`、`size`、`strokeWidth` 或 `absoluteStrokeWidth`
- **THEN** 图标网格和详情预览使用相同外观参数重新渲染

#### Scenario: 选择和取消分类

- **WHEN** 用户选择一个真实分类后再次选择同一分类
- **THEN** Categories 不显示 All 项，首次选择只显示该分类图标，再次选择恢复全部图标

#### Scenario: 浏览图标网格

- **WHEN** 用户浏览或聚焦图标项
- **THEN** 网格使用 `56px` 图标按钮与 `8px` 间距，并在完整单元格下方显示名称 tooltip；鼠标或焦点离开后 tooltip 消失

### Requirement: 展示公开图标

预览站点 MUST 在构建时展示 `@omnific/icons` 当前所有公开图标导出，每个图标项 MUST 显示本地组件名称和实际渲染的 React 图标。

#### Scenario: 打开站点

- **WHEN** 用户打开预览站点首页
- **THEN** 页面显示图标网格，且每个当前公开图标恰好出现一次

#### Scenario: 新增或删除导出

- **WHEN** 公开导出与预览元数据不一致
- **THEN** 同步测试失败并指出缺失或多余的组件名称

### Requirement: 搜索和详情抽屉

站点 MUST 提供按组件名称进行大小写不敏感的即时筛选，并 MUST 为选中的图标显示底部详情抽屉。详情 MUST 显示大图预览、关键词、真实分类标签和 SVG/JSX 操作，MUST NOT 显示 package 版本号或贡献者区域。

#### Scenario: 搜索匹配

- **WHEN** 用户输入部分组件名称
- **THEN** 网格只显示名称包含该文本的图标

#### Scenario: 无匹配

- **WHEN** 搜索文本没有匹配的组件
- **THEN** 页面显示明确的空结果状态，且不显示旧的图标项

#### Scenario: 切换详情图标

- **WHEN** 详情抽屉已打开且用户选择另一个图标
- **THEN** 透明抽屉区域不拦截网格交互，选中态和详情内容切换到新图标

#### Scenario: 查看图标元数据

- **WHEN** 详情抽屉显示选中图标
- **THEN** 关键词使用 `16px`、`500` 字重和 `28px` 行高，分类标签使用 `16px`、`600` 字重、`#f6f6f7` 背景与透明边框

### Requirement: 复制代码反馈

详情区域 MUST 提供 SVG 和 JSX 分组按钮，MUST 保持主按钮文本稳定，并 MUST 反馈成功或失败状态。SVG 菜单 MUST 提供 SVG、Data URL、SVG 下载和 PNG 下载操作；JSX 菜单 MUST 提供 JSX、组件名称、Vue、Svelte 和 Angular 代码形式。

#### Scenario: 复制成功

- **WHEN** Clipboard API 成功写入示例
- **THEN** 对应按钮保持原文本并使用 `Copied!`、上下 radial-gradient 粒子和 1 秒关键帧显示 Lucide 风格 confetti 动画

#### Scenario: 复制不可用

- **WHEN** Clipboard API 不可用或写入失败
- **THEN** 页面通过辅助技术可感知的状态报告失败，主按钮、格式菜单和浏览交互仍可继续使用

### Requirement: 可访问和响应式交互

图标项、搜索输入和复制按钮 MUST 可通过键盘访问；图标图形 MUST 有可访问名称；布局 MUST 在窄屏视口下不产生横向滚动。

#### Scenario: 键盘选择图标

- **WHEN** 用户使用 Tab 聚焦图标项并按 Enter 或 Space
- **THEN** 详情区域打开并将焦点移动到详情标题或相关内容

#### Scenario: 窄屏浏览

- **WHEN** 视口宽度小于 480px
- **THEN** 图标网格重排到可读列数，页面没有横向滚动
