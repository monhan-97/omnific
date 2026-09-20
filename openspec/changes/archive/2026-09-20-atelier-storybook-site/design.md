# 设计：Atelier Storybook 组件文档站

## 背景

Chakra UI 在参考 commit `afc8b4898868f0cf93696ce3d6f6f980ceb7c8ce` 中将 Storybook 作为组件开发与人工浏览环境，而不是完整官网：根 `.storybook/main.ts` 只扫描 `packages/react/__stories__/*.stories.tsx`，story 注册文件从 `apps/compositions/src/examples` 重新导出明确命名的示例；全局 preview 提供 Provider、主题和固定排序，并关闭 Controls、Actions 与 React Docgen。根脚本在构建 Storybook 前构建 packages，静态输出使用 Storybook 默认的 `storybook-static`。

Atelier 当前只有 Button 和 transition hook，没有 Chakra UI 的 token system、Provider、composition library 或独立 Storybook 域名。本设计保留上游结构中可直接提升维护性的部分，并避免为了表面一致而复制不适用的基础设施。

## 上游参考

- 仓库：`https://github.com/chakra-ui/chakra-ui.git`
- commit：`afc8b4898868f0cf93696ce3d6f6f980ceb7c8ce`
- 许可证：MIT；本变更参考目录组织和配置决策，不复制 Chakra UI 组件源码或视觉资产
- 关键文件：`.storybook/main.ts`、`.storybook/preview.tsx`、`.storybook/manager.ts`、`.storybook/storybook-theme.ts`、`packages/react/__stories__/button.stories.tsx`、`apps/compositions/src/examples/button-basic.tsx`、根 `package.json`

## 目标

- 为 Atelier 提供与 Chakra UI 相同定位的 curated Storybook：每个 story 是维护者明确选择的真实组件场景。
- 让示例实现可被 Storybook 注册文件复用，同时保持 package 运行时代码与文档代码分离。
- 让 Storybook 始终使用 Atelier 的公开导出和编译后 CSS，尽量贴近真实消费方式。
- 生成可重复构建、可通过仓库质量门禁并可部署到 GitHub Pages 子路径的静态产物。

## 非目标

- 不把 Storybook 改造成 MDX 官网或 API reference generator。
- 不建立 Chakra UI `apps/compositions` 的完整工具库、PlaygroundTable 抽象或 recipe introspection。
- 不为展示矩阵修改 Atelier 的公开组件 API。
- 不增加当前产品能力无法支持的暗色模式。

## 关键决策

### 1. Storybook 归属于 Atelier package

在根 `.storybook` 维护 `main.ts`、`preview.tsx`、`manager.ts` 和 `storybook-theme.ts`，与参考仓库保持一致。配置只扫描 `packages/atelier/__stories__/*.stories.tsx`，避免把测试、内部组件或任意邻近文件自动注册为文档。

`main.ts` 使用根 `package.json` 与 lockfile 固定的当前 Storybook 10 版本、`@storybook/react-vite`，关闭 telemetry、project JSON 和 React Docgen，并配置 `@storybook/addon-a11y`。OpenSpec 不记录 patch/minor 级依赖版本；常规 Storybook 升级只需更新依赖清单，只有大版本或行为约束变化才更新本设计。Chakra UI 使用 `@storybook/addon-themes` 连接真实的 `ColorModeProvider`；Atelier 当前没有等价能力，因此本变更不安装该 addon，也不注册虚假的 light/dark toolbar。

### 2. 分离 story 注册与示例实现

采用以下结构：

```text
.storybook/
├── main.ts
├── manager.ts
├── preview.tsx
├── storybook-theme.ts
└── atelier-logo.svg

packages/atelier/__stories__/
└── button.stories.tsx

packages/atelier/button/examples/
├── index.ts
├── coverage.ts
├── basic.tsx
├── block.tsx
├── disabled.tsx
├── icon-only.tsx
├── icon.tsx
├── loading.tsx
├── size-table.tsx
└── variant-table.tsx
```

`button.stories.tsx` 严格参考 Chakra UI `packages/react/__stories__/button.stories.tsx`：文件只定义 `Components / Button` meta 和 decorator，然后从 `../button/examples` 这个 index 入口统一 re-export 稳定英文命名 stories，不在注册文件中逐项编写 render 配置或 Button 业务 JSX。Storybook 中面向使用者的简体中文显示名称和描述统一在 `examples/index.ts` 的 story 元数据中定义。

示例文件放在对应组件的 `examples` 目录，文件名省略组件前缀，并通过 `examples/index.ts` 作为注册入口。示例实现直接从 `@omnific/atelier` 与 `@omnific/icons` 的公开入口导入，不访问 Button 内部实现。

当前示例数量不足以证明共享 PlaygroundTable 抽象有必要，因此尺寸和视觉类型矩阵使用少量本地 JSX 与 CSS Modules。只有第二个组件出现相同矩阵需求时，才评估提取共享展示组件。

### 3. 使用真实 package 消费路径

根 `build:storybook` 先运行 Atelier package 的 `build`，随后运行 `storybook build` 输出到 `packages/atelier/storybook-static`；Storybook 构建会自行清除该输出目录，因此不单独提供 `clean:storybook`。`preview.tsx` 导入 `@omnific/atelier/styles.css`，stories 从 `@omnific/atelier` 公开入口导入组件，使开发和静态构建能够发现 package exports、构建产物或样式入口错误。

根 workspace 将 `@omnific/atelier` 与 `@omnific/icons` 声明为文档工具开发依赖，使根 Storybook 配置和 examples 均通过公开 package exports 解析组件与图标。不得用 Vite alias 或相对路径替代公开依赖关系。

Storybook dev 同样依赖已有 Atelier build。根 `storybook` 命令先构建 Atelier 再启动端口 `6006`，不为 Storybook 增加指向源码内部文件的 Vite alias。维护者从根目录通过 `pnpm storybook` 调用。

### 4. Curated examples 优先于自动控件

与 Chakra UI 一致，全局关闭 Actions 和 Controls，并设置 `typescript.reactDocgen: false`。Button 的公开 props 不依赖自动推断；维护者通过明确的 `Basic`、`Sizes`、`Variants`、`Disabled`、`Loading`、`Icon`、`IconOnly` 和 `Block` stories 展示受支持行为。

每个组件的 story 注册必须伴随公开属性覆盖清单。Button 首批覆盖清单需要从 `ButtonProps` 出发，覆盖 `variant`、`size`、`shape`、`block`、`disabled`、`loading`、`icon`、`children`、原生 `type` 和事件/引用相关行为的代表性组合。视觉枚举类 props 应优先用矩阵展示每个公开选项；`danger` 是 `variant` 的一个取值，不得再按 type × status 展开矩阵。状态类 props 应覆盖默认、禁用、加载、图标、纯图标和块级等主要交互场景。与已有 story 可观察行为等价、互斥、不可渲染或 Storybook 中不可观察的组合不得静默跳过，必须在覆盖清单的 `coverageNotes` 字段中使用简体中文说明归并或排除原因。

storybook navigation 使用固定顶层顺序，为未来预留 `Foundations`、`Layout`、`Typography`、`Components`，当前 Button 归入 `Components`。命名导出属于可链接标识，继续使用稳定英文；Storybook UI 中的 story 显示名称和描述使用简体中文，已有命名导出变更时需要同步外部文档链接。

### 5. 品牌与可访问性

manager theme 使用 Atelier 自有标题、仓库 URL 和新建的 Atelier 品牌 SVG，不复制 Chakra UI logo。品牌 SVG 仅包含 Atelier 自有文字或图形，纳入仓库许可证管理。

`@storybook/addon-a11y` 在开发界面提供检查结果。示例中的纯图标按钮必须提供可访问名称，矩阵容器必须在窄屏下横向滚动且不得挤压按钮文字。

### 6. 与现有 GitHub Pages 共存

仓库现有 workflow 已部署 `packages/icons/docs/build`。新增 Storybook workflow 若直接调用 `actions/deploy-pages` 会覆盖现有站点，因此 Pages 部署必须组装一个 artifact：保留现有图标站点路径，并将 `packages/atelier/storybook-static` 复制到固定的 `atelier` 子目录。

Pages 根入口的具体视觉重做不属于本变更；构建只需提供稳定入口或重定向，使 `/omnific/atelier/` 可访问 Storybook，现有图标预览路径继续可访问。artifact 校验必须检查两个入口 HTML 及其相对资源引用。

`packages/atelier/__stories__` 与组件内 `examples` 只作为 Storybook 构建输入。GitHub Pages 发布它们生成的静态 HTML、JavaScript、CSS 和资源，npm package 仍只按 `packages/atelier/package.json` 的 `files` 字段发布 `dist` 与 `README.md`。

## 备选方案

- 在 `packages/atelier/docs` 创建独立 Storybook package：与 Chakra UI 的根级配置不同，并会重复管理 React、Vite 和 Storybook 脚本，拒绝。
- 将 stories 紧邻每个组件：便于局部导航，但不符合本次指定的 Chakra UI 集中 `__stories__` 模式，拒绝。
- 启用 Autodocs 与 Controls：偏离 Chakra UI 当前 curated stories 选择；公开属性覆盖应由人工维护的代表性 stories、矩阵和覆盖清单承担，拒绝。
- 复制 Chakra UI 的 `apps/compositions` 和 PlaygroundTable：Atelier 当前规模不足以支撑该抽象，改为组件内 `examples` 中的最小示例实现。
- 单独部署第二个 Pages workflow：会竞争同一 Pages artifact 并覆盖现有图标站点，拒绝。

## 风险与缓解

- Storybook 直接消费 package dist，源码修改后可能看到旧产物：开发和构建命令先构建 Atelier，避免隐式 alias 带来的消费差异。
- Atelier 的开发依赖增加安装体积：严格限制为 Chakra UI 当前使用且 Atelier 能实际消费的三个 Storybook package，不引入 themes、docs、test runner 或 Chromatic addon。
- story ID 被外部链接依赖：使用明确 title 和命名导出，文档链接以稳定 ID 为准，并通过静态构建检查发现缺失 story。
- Pages 子路径造成静态资源 404：构建与 artifact 校验必须使用仓库子路径验证，不硬编码本地绝对路径。
- Atelier 尚无主题切换：不安装 themes addon 或配置无效 toolbar；出现真实主题 API 后再单独提案增加 decorator。

## 迁移方式

1. 在根 workspace 安装并固定 Storybook 依赖，新增根级启动和构建脚本；输出目录由 Storybook 构建自行清除，不单独提供清理脚本。
2. 创建根 `.storybook` 配置和 Atelier 自有 manager 品牌。
3. 在 `packages/atelier/button/examples` 编写 Button 示例，在 `packages/atelier/__stories__` 注册稳定 story 名称。
4. 更新 Pages workflow，将图标站与 Storybook 组装为单一 artifact，并扩展 artifact 校验。
5. 更新 Atelier README，记录本地与线上入口。
