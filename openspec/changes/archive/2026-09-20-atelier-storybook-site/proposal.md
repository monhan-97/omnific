# 变更：建立 Atelier Storybook 组件文档站

## Why

`@omnific/atelier` 当前只有 package README、组件源码和单元测试，缺少可在浏览器中集中查看组件视觉状态、交互示例和可访问性结果的开发入口。随着组件增加，仅靠 README 示例无法稳定呈现尺寸、视觉类型、禁用和加载等组合，也无法在组件变更时提供可重复构建的静态文档产物。

本变更严格参考 Chakra UI 仓库 `https://github.com/chakra-ui/chakra-ui.git` 在 commit `afc8b4898868f0cf93696ce3d6f6f980ceb7c8ce` 中的 Storybook 组织方式，并根据 Atelier 当前仅有少量组件、使用全局编译 CSS 且尚无主题 Provider 的实际能力缩小范围。

## What Changes

- 在根 `.storybook` 新增配置，并在根 workspace 中使用根 `package.json` 与 lockfile 固定的当前 Storybook 10 版本、`@storybook/react-vite` 和 `@storybook/addon-a11y`；OpenSpec 不记录 patch/minor 级依赖版本。
- 在根 `package.json` 新增 Storybook 开发和构建命令，构建前先构建 package，静态产物输出到 `packages/atelier/storybook-static`；输出目录由 Storybook 构建自行清除，不单独提供清理命令。
- 在 `packages/atelier/__stories__` 集中维护 story 注册文件，并在各组件目录内维护 `examples` 示例实现；Storybook 只从对应组件的 `examples/index.ts` 入口 re-export 稳定英文 stories，简体中文显示名称与描述统一在 `examples/index.ts` 的 story 元数据中定义。
- 参考 Chakra UI 的 curated examples 模式，关闭自动 Controls、Actions 和 React Docgen，不将自动生成的 props 表作为文档站核心体验。
- 在全局 preview 中导入 `@omnific/atelier/styles.css`，统一设置画布布局、story 排序和可访问性检查；在 manager 中提供 Atelier 品牌标题、仓库链接和品牌图像。
- 为 Button 建立 `Basic`、`Sizes`、`Variants`、`Disabled`、`Loading`、`Icon`、`IconOnly` 和 `Block` 等首批示例，并为矩阵型展示提供紧凑、可横向滚动的示例布局；stories 必须维护公开属性覆盖清单，覆盖代表性属性组合，并通过 `coverageNotes` 使用简体中文说明可归并、互斥、不可渲染或 Storybook 中不可观察的组合。
- 将 stories 与 examples 编译为可部署到 GitHub Pages 仓库子路径 `/omnific/atelier/` 的静态 Storybook，并与现有 `packages/icons/docs` 站点组装为同一个 Pages artifact，避免两个 workflow 相互覆盖。
- 更新 `packages/atelier/README.md`，记录本地启动、静态构建和在线预览入口。

## 非目标

- 不复制 Chakra UI 的组件实现、样式系统、token system、composition helpers 或官网应用。
- 不建立独立于 Storybook 的 Atelier 官网、搜索服务、服务端渲染或运行时 API。
- 不启用自动生成的 Controls、Actions 或 React Docgen；组件示例由明确编写的 story 表达。
- 不实现 Atelier 当前不存在的暗色主题、主题 Provider 或主题切换 API，也不安装当前无法使用的 `@storybook/addon-themes`。
- 不引入 Chromatic、视觉回归 SaaS、交互测试 runner 或新的示例抽象层。
- 不把 Storybook 改成 MDX 官网；Button 的 `variant` API 由组件实现变更维护，本变更只同步 stories 与覆盖清单。

## 影响范围

- 受影响的 capability：`atelier-storybook-site`、`github-pages-deployment`
- 受影响的 package：`packages/atelier`，以及新增的组件内 `examples` 示例目录
- 新增开发依赖：当前根 `package.json` 与 lockfile 固定的 Storybook 10、`@storybook/react-vite` 和 `@storybook/addon-a11y`
- Atelier Storybook 通过 package 自引用和现有 `@omnific/icons` 依赖消费公开 package exports
- 受影响的公开行为：新增本地 Storybook 命令、静态 Storybook 构建产物和 GitHub Pages 下的 Atelier 预览路径
- stories 和示例源码仅作为 GitHub Pages 静态站构建输入，不进入 `@omnific/atelier` npm 发布文件
