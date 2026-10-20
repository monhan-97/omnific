# eslint-config-react 规范

## Purpose

定义 `@omnific/eslint-config-react` 对仓库内 a11y 插件的依赖、规则命名空间与 BREAKING 迁移要求。

## Requirements

### Requirement: React 配置使用仓库内 a11y 插件

`@omnific/eslint-config-react` MUST 依赖 `@omnific/eslint-plugin-jsx-a11y`（`workspace:*`），MUST NOT 依赖 `eslint-plugin-jsx-a11y-x`。配置 MUST 以 `jsx-a11y` 作为插件 key，使用的规则 id MUST 采用 `jsx-a11y/<rule>` 形式。迁移后已启用的规则集合、严重级别与选项 MUST 与迁移前逐项一致。

#### Scenario: 检查依赖

- **WHEN** 维护者检查 `packages/eslint-config-react/package.json`
- **THEN** `dependencies` 包含 `@omnific/eslint-plugin-jsx-a11y`
- **AND** 不存在 `eslint-plugin-jsx-a11y-x`

#### Scenario: 检查规则前缀

- **WHEN** 维护者检查 `packages/eslint-config-react/index.js`
- **THEN** 插件 key 为 `jsx-a11y`
- **AND** 不存在 `jsx-a11y-x/` 前缀的规则 id

#### Scenario: 规则集合不变

- **WHEN** 测试比对迁移前后 `packages/eslint-config-react` 启用的规则名与选项
- **THEN** 规则名集合完全相同，且每项选项值完全一致

#### Scenario: 配置可运行

- **WHEN** 在仓库根目录运行 `pnpm lint:fix`
- **THEN** `@omnific/eslint-config` 与 `@omnific/eslint-config-react` 组合后正常执行，不出现未知规则报错

### Requirement: 迁移为 BREAKING 并记录迁移方式

本次迁移 MUST 作为 BREAKING 变更处理：规则 id 前缀由 `jsx-a11y-x/` 改为 `jsx-a11y/`，settings key 由 `jsx-a11y-x` 改为 `jsx-a11y`。`packages/eslint-config-react/README.md` 与 Changeset MUST 记录这两项迁移要求。包 MUST NOT 提供旧命名空间的兼容层、别名或转发配置。

#### Scenario: 记录迁移说明

- **WHEN** 维护者检查 `packages/eslint-config-react/README.md`
- **THEN** 文档说明规则 id 前缀与 settings key 的替换方式

#### Scenario: Changeset 标注破坏性变更

- **WHEN** 维护者检查本变更对应的 Changeset
- **THEN** `@omnific/eslint-config-react` 的条目为 major 或等价破坏性标记，并写明迁移步骤
- **AND** Changeset 正文使用英文，与现有 `CHANGELOG.md` 条目语言一致

#### Scenario: 不存在兼容层

- **WHEN** 维护者检查 `packages/eslint-config-react`
- **THEN** 不存在 `jsx-a11y-x` 插件 key、别名导出或转发配置
