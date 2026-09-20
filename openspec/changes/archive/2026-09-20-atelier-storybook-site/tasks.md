## 1. 建立 Storybook 基础设施

- [x] 1.1 在根 workspace 安装并固定当前 Storybook 10 版本的 `storybook`、`@storybook/react-vite` 和 `@storybook/addon-a11y`，复用 package 公开入口与现有 Icons workspace 依赖；具体 patch/minor 版本以根 `package.json` 和 lockfile 为准。
- [x] 1.2 在根 `package.json` 新增先构建 Atelier package 的 `storybook` 和 `build:storybook` 命令；静态产物输出到 `packages/atelier/storybook-static`，由 Storybook 构建自行清除旧产物，不单独提供 `clean:storybook`。
- [x] 1.3 新增根 `.storybook/main.ts`，配置 Atelier stories、React Vite framework、addons、telemetry、project JSON 和 React Docgen 行为。
- [x] 1.4 新增根 `.storybook/preview.tsx`，导入公开 CSS 入口，关闭 Actions 与 Controls，并配置稳定的顶层分组顺序和统一画布布局。
- [x] 1.5 新增根 `.storybook/manager.ts`、`storybook-theme.ts` 和 Atelier 自有品牌 SVG，配置品牌标题与仓库链接。

## 2. 编写 Button curated examples

- [x] 2.1 在 `packages/atelier/button/examples` 新增直接消费 `@omnific/atelier` 公开 API 的 `Basic`、`Disabled`、`Loading`、`Icon`、`IconOnly` 和 `Block` 示例，并通过 `index.ts` 作为唯一入口；同时在 `packages/atelier/__stories__/button.stories.tsx` 严格参考 Chakra UI `packages/react/__stories__/button.stories.tsx` 的集中注册结构，只定义 `Components / Button` meta 和 decorator，并通过稳定英文命名 re-export 这些示例；每个 story 配置简体中文显示名称与描述，story 文件不访问 Button 私有模块。
- [x] 2.2 新增 Button 公开属性覆盖清单，并用 stories 或矩阵覆盖代表性属性组合；未单独展示的组合必须在 `coverageNotes` 中使用简体中文写明归并或排除原因。
- [x] 2.3 为纯图标按钮、disabled 与 loading 示例补齐可访问名称和可观察状态。

## 3. 集成 Pages 与文档

- [x] 3.1 调整现有 Pages workflow，在质量门禁中构建 `packages/icons/docs` 与 `packages/atelier/storybook-static`，并组装为单一 Pages artifact。
- [x] 3.2 将 Storybook 固定发布到 `atelier` 子目录，同时保持现有图标预览路径可访问且不被覆盖。
- [x] 3.3 在 Pages workflow 中用 `test` / `grep` 校验图标站与 Atelier Storybook 入口及根路径绝对资源引用，不新增独立校验脚本。
- [x] 3.4 更新 `packages/atelier/README.md`，记录 Storybook 开发、构建和线上预览命令或 URL。
- [x] 3.5 检查上游参考声明、commit SHA、源文件路径和 MIT 许可证说明完整且未复制 Chakra UI 品牌资产。

## 4. 验证

- [x] 4.1 运行 `pnpm --filter @omnific/atelier test` 和 `pnpm --filter @omnific/atelier build`。
- [x] 4.2 运行 `pnpm build:storybook`，确认生成 `packages/atelier/storybook-static/index.html` 且所有 Button stories 可构建。
- [x] 4.3 复现 workflow 中的 Pages artifact 组装与 `test` / `grep` 校验，确认图标站与 `/atelier/` Storybook 资源均使用可部署路径。
- [x] 4.4 在根目录运行 `pnpm typecheck`。
- [x] 4.5 在根目录运行 `pnpm lint:fix`。
- [x] 4.6 运行 `graphify update .`，刷新新增 Storybook、示例和 OpenSpec 关系。
