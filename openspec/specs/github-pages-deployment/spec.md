# GitHub Pages 部署规范

## Purpose

通过 GitHub Actions 对 `packages/icons/docs` 图标预览站与 Atelier Storybook 执行可重复的质量检查，并将通过检查的组合静态产物部署到 GitHub Pages。

## Requirements

### Requirement: Pull Request 质量门禁

仓库 MUST 在 pull request 和默认分支 push 时使用锁定的 pnpm 依赖执行安装、typecheck、lint、test，以及图标预览站与 Atelier Storybook 的构建；任一步失败时 workflow MUST 失败。

#### Scenario: 代码检查失败

- **WHEN** 任一质量命令返回非零退出码
- **THEN** workflow 以失败状态结束且不部署 Pages

#### Scenario: 依赖不可复现

- **WHEN** lockfile 与 package manifest 不一致
- **THEN** frozen install 失败并阻止后续步骤

### Requirement: 默认分支部署

默认分支 push 且质量门禁通过后，workflow MUST 将组合后的站点构建目录上传为 Pages artifact 并部署到 GitHub Pages；部署 job MUST 使用最小必要的 `pages: write` 和 `id-token: write` 权限。

#### Scenario: 发布站点

- **WHEN** 默认分支变更通过所有检查
- **THEN** workflow 发布最新静态产物，并输出可访问的 Pages deployment

### Requirement: 子路径资源

站点构建 MUST 兼容 GitHub Pages 仓库子路径，所有脚本、样式和静态资源请求 MUST 使用相对路径或等价机制在仓库 Pages URL 下正确解析。

#### Scenario: 访问仓库 Pages URL

- **WHEN** 用户访问 `https://<owner>.github.io/<repository>/`
- **THEN** 页面和资源成功加载，且浏览器控制台没有因根路径假设产生的资源 404

### Requirement: 组合多个静态文档产物

Pages workflow MUST 将现有 `packages/icons/docs` 构建产物与由 stories 和 examples 编译生成的 `packages/atelier/storybook-static` 组装为单一 artifact，并 MUST 通过同一个 deploy job 发布。Atelier Storybook MUST 位于固定的 `atelier` 子目录并可通过 `/omnific/atelier/` 访问，图标预览站 MUST 保持独立入口和资源路径。

#### Scenario: 组装完整 Pages artifact

- **WHEN** 图标预览站和 Atelier Storybook 均构建成功
- **THEN** artifact 同时包含图标站入口与 `atelier/index.html`，且 workflow 只调用一次 Pages artifact 上传和部署步骤

#### Scenario: 阻止不完整部署

- **WHEN** 任一站点缺少入口文件或包含无法在仓库子路径解析的静态资源引用
- **THEN** artifact 校验失败，Pages deploy job 不运行

### Requirement: React scripts artifact

Pages workflow MUST 将 `packages/icons/docs/build` 作为组合 artifact 的根内容上传，不得单独覆盖已包含 Atelier Storybook 的 Pages 部署。

#### Scenario: 上传 artifact

- **WHEN** 质量门禁完成并进入 Pages 上传步骤
- **THEN** workflow 上传同时包含图标站与 `atelier/` 子目录的组装目录
