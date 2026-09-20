## ADDED Requirements

### Requirement: 组合多个静态文档产物

Pages workflow MUST 将现有 `packages/icons/docs` 构建产物与由 stories 和 examples 编译生成的 `packages/atelier/storybook-static` 组装为单一 artifact，并 MUST 通过同一个 deploy job 发布。Atelier Storybook MUST 位于固定的 `atelier` 子目录并可通过 `/omnific/atelier/` 访问，图标预览站 MUST 保持独立入口和资源路径。

#### Scenario: 组装完整 Pages artifact

- **WHEN** 图标预览站和 Atelier Storybook 均构建成功
- **THEN** artifact 同时包含图标站入口与 `atelier/index.html`，且 workflow 只调用一次 Pages artifact 上传和部署步骤

#### Scenario: 阻止不完整部署

- **WHEN** 任一站点缺少入口文件或包含无法在仓库子路径解析的静态资源引用
- **THEN** artifact 校验失败，Pages deploy job 不运行
