## ADDED Requirements

### Requirement: Pull Request 质量门禁

仓库 MUST 在 pull request 和默认分支 push 时使用锁定的 pnpm 依赖执行安装、typecheck、lint、test 和基于 `@omnific/react-scripts` 的预览站点 build；任一步失败时 workflow MUST 失败。

#### Scenario: 代码检查失败

- **WHEN** 任一质量命令返回非零退出码
- **THEN** workflow 以失败状态结束且不部署 Pages

#### Scenario: 依赖不可复现

- **WHEN** lockfile 与 package manifest 不一致
- **THEN** frozen install 失败并阻止后续步骤

### Requirement: 默认分支部署

默认分支 push 且质量门禁通过后，workflow MUST 将站点构建目录上传为 Pages artifact 并部署到 GitHub Pages；部署 job MUST 使用最小必要的 `pages: write` 和 `id-token: write` 权限。

#### Scenario: 发布站点

- **WHEN** 默认分支变更通过所有检查
- **THEN** workflow 发布最新静态产物，并输出可访问的 Pages deployment

### Requirement: 子路径资源

站点构建 MUST 兼容 GitHub Pages 仓库子路径，所有脚本、样式和静态资源请求 MUST 使用相对路径或等价机制在仓库 Pages URL 下正确解析。

#### Scenario: 访问仓库 Pages URL

- **WHEN** 用户访问 `https://<owner>.github.io/<repository>/`
- **THEN** 页面和资源成功加载，且浏览器控制台没有因根路径假设产生的资源 404

### Requirement: React scripts artifact

Pages workflow MUST 上传 `docs/icons/build` 作为静态 artifact，并 MUST 验证入口 HTML 引用的是 `@omnific/react-scripts` 生成的相对静态资源路径。

#### Scenario: 上传 artifact

- **WHEN** 质量门禁完成并进入 Pages 上传步骤
- **THEN** workflow 上传 `docs/icons/build`，且 artifact 中不存在 Docusaurus 专属目录或 runtime 标记
