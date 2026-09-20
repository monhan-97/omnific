## Purpose

定义 `@omnific/atelier` 的 Storybook 组织、curated examples、全局配置、静态构建和文档站发布约束，使组件状态可浏览、可访问并可重复构建。

## ADDED Requirements

### Requirement: Storybook 归属于 Atelier package

仓库 MUST 在根 `.storybook` 目录维护 Atelier Storybook 配置，并 MUST 在根 workspace 中使用根 `package.json` 与 lockfile 固定的当前 Storybook 10 版本和 `@storybook/react-vite`。配置 MUST 仅扫描 `packages/atelier/__stories__/*.stories.tsx`，并 MUST 关闭 telemetry、project JSON 和 React Docgen。

#### Scenario: 启动 Atelier Storybook

- **WHEN** 维护者运行 `pnpm storybook`
- **THEN** 根命令先构建 `@omnific/atelier`，再在端口 `6006` 启动只包含 Atelier stories 的 Storybook

#### Scenario: 构建静态 Storybook

- **WHEN** 维护者运行 `pnpm build:storybook`
- **THEN** 根命令先构建 `@omnific/atelier`，再由 Storybook 清除并重建 `packages/atelier/storybook-static`，最终生成 `packages/atelier/storybook-static/index.html`

### Requirement: 分离 story 注册与示例实现

Atelier MUST 严格参考 Chakra UI 的 `packages/react/__stories__/*.stories.tsx` 与 `apps/compositions/src/examples` 分离模式，在 `packages/atelier/__stories__` 集中维护 story 注册文件，并 MUST 在对应组件目录内维护 `examples` 示例实现。story 注册文件 MUST 只定义分组、装饰器和稳定英文命名 re-export，并 MUST 只从对应组件的 `examples/index.ts` 入口导入示例；简体中文显示名称和简体中文描述 MUST 在 `examples/index.ts` 的 story 元数据中定义。示例实现 MUST 从 `@omnific/atelier`、`@omnific/atelier/styles.css` 或其他 workspace package 的公开入口消费代码，不得导入 Atelier 私有模块。

#### Scenario: 注册 Button stories

- **WHEN** Storybook 加载 `button.stories.tsx`
- **THEN** navigation 在 `Components / Button` 下显示从 `packages/atelier/button/examples/index.ts` re-export 的稳定命名 stories，且 story 注册文件不包含 Button 业务实现或逐项 render 配置；中文名称与描述由 `examples/index.ts` 提供

#### Scenario: 查看中文 story 描述

- **WHEN** 使用者在 Storybook 中浏览 Button stories
- **THEN** 每个 story 的显示名称和描述使用简体中文，命名导出继续使用稳定英文标识

#### Scenario: 检查示例消费路径

- **WHEN** 维护者检查 Button 示例的 imports
- **THEN** 示例通过 package 公开入口消费 Button 与图标，不引用 `packages/atelier/button/Button.tsx` 或其他私有文件

### Requirement: 使用 curated examples 展示组件状态

Storybook MUST 关闭全局 Actions 和 Controls，并 MUST NOT 依赖 Autodocs 或 React Docgen 生成 Button 的主要文档。Button MUST 至少提供 `Basic`、`Sizes`、`Variants`、`Disabled`、`Loading`、`Icon`、`IconOnly` 和 `Block` stories。Button stories MUST 维护公开属性覆盖清单，并 MUST 覆盖代表性属性组合，防止新增或变更 props 后遗漏主要可观察状态。未单独展示的组合 MUST 在覆盖清单的 `coverageNotes` 字段中使用简体中文写明归并或排除原因。

#### Scenario: 浏览 Button 主要状态

- **WHEN** 使用者打开 `Components / Button`
- **THEN** 使用者可通过明确命名的 stories 浏览 Button 的默认、尺寸、视觉变体、danger 变体、禁用、加载、图标、纯图标和块级行为

#### Scenario: 查看尺寸与视觉类型矩阵

- **WHEN** 使用者打开 `Sizes` 或 `Variants` story
- **THEN** 画布在一个稳定布局中同时展示全部公开选项，并在窄屏下允许横向滚动而不压缩按钮文字

#### Scenario: 检查 Button 属性组合覆盖

- **WHEN** 维护者新增、移除或修改 Button 公开属性
- **THEN** Button 的 story 覆盖清单同步更新，列出公开属性值域、代表性组合、覆盖位置，以及在 `coverageNotes` 中使用简体中文列出未单独展示组合的归并或排除原因

#### Scenario: 对齐 Button 判断逻辑

- **WHEN** 维护者依据 `packages/atelier/button/Button.tsx` 调整故事覆盖
- **THEN** 覆盖清单至少显式记录 `size`、`variant`、`shape`、`loading`、`disabled`、`block`、`icon` 和 `icon-only` 这几类判断分支，并说明 `loading` / `disabled` 会阻止点击、`danger` 是独立 variant、原生 `type` 只表示 HTML button type、`circle` 仅在纯图标场景中有可观察意义

#### Scenario: 归并或排除非代表性组合

- **WHEN** 某个 Button 属性组合与已有 story 的可观察行为等价、语义互斥、无法渲染或无法在 Storybook 中观察而不适合单独展示
- **THEN** 覆盖清单在 `coverageNotes` 中使用简体中文记录该组合归并到哪个代表性场景或记录排除原因，而不是静默遗漏

### Requirement: 配置品牌与可访问性检查

Storybook MUST 使用根 `package.json` 与 lockfile 固定的当前 Storybook 10 版本 `@storybook/addon-a11y`，manager MUST 显示 Atelier 自有品牌标题、仓库链接和品牌图像。品牌图像 MUST 为项目自有资产，不得复制 Chakra UI logo。纯图标示例 MUST 提供可访问名称。

#### Scenario: 检查纯图标 Button

- **WHEN** a11y addon 检查 `IconOnly` story
- **THEN** 纯图标按钮具有辅助技术可识别的名称，且不存在由缺少名称直接导致的严重可访问性问题

#### Scenario: 查看 Storybook 品牌

- **WHEN** 使用者打开 Storybook manager
- **THEN** 页面显示 Atelier 品牌和 Omnific 仓库链接，不显示 Chakra UI 名称、链接或 logo

### Requirement: 使用真实 Atelier 样式产物

Storybook preview MUST 导入 `@omnific/atelier/styles.css`，stories MUST 使用构建后的 Atelier package exports。Storybook 配置 MUST NOT 通过 Vite alias 绕过 package exports 直接解析 Atelier 私有源码。

#### Scenario: package 样式入口失效

- **WHEN** `@omnific/atelier/styles.css` 无法由构建后的 package exports 解析
- **THEN** Storybook 开发或静态构建失败，而不是静默使用另一份文档专用样式

### Requirement: 与现有 Pages 站点共同部署

GitHub Pages workflow MUST 将现有图标预览站与由 stories 和 examples 编译生成的 Atelier Storybook 组装为同一个 Pages artifact，并 MUST 只执行一次 Pages 部署。Storybook MUST 发布到固定的 `atelier` 子目录，使 `/omnific/atelier/` 可访问，现有图标预览入口 MUST 保持可访问。stories 和 examples 源码 MUST NOT 进入 `@omnific/atelier` npm 发布文件。

#### Scenario: 默认分支部署文档站

- **WHEN** 默认分支质量门禁、图标站构建和 Storybook 构建全部成功
- **THEN** workflow 上传一个同时包含图标站与 `atelier/index.html` 的 Pages artifact，并执行一次部署

#### Scenario: 任一文档构建失败

- **WHEN** 图标站或 Storybook 任一构建、入口检查或资源路径检查失败
- **THEN** workflow 以失败状态结束且不部署不完整的 Pages artifact

#### Scenario: 访问仓库子路径

- **WHEN** 使用者访问 GitHub Pages 下的 Atelier 子路径
- **THEN** Storybook manager、preview iframe、JavaScript、CSS 和品牌资源均从仓库 Pages URL 正确加载，且不会覆盖图标预览站资源
