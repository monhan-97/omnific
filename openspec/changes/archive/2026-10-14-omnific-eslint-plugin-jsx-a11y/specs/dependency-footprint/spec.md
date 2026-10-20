# dependency-footprint 规范

## ADDED Requirements

### Requirement: a11y 插件运行时依赖构成

`@omnific/eslint-plugin-jsx-a11y` 的运行时 `dependencies` MUST 只包含 `@omnific/utils`、`picomatch`、`aria-query`、`axobject-query`、`jsx-ast-utils-x`、`language-tags` 与 `damerau-levenshtein`。包 MUST NOT 依赖 `axe-core`、`minimatch`、`brace-expansion`、`balanced-match` 或 `eslint-plugin-jsx-a11y-x`。每个保留的依赖 MUST 在 `dependency-evaluation.md` 中记录用途、unpacked 体积与保留理由。

#### Scenario: 检查运行时依赖

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y/package.json`
- **THEN** `dependencies` 与上述清单完全一致

#### Scenario: 排除高占用低使用面依赖

- **WHEN** 维护者在仓库内搜索 `axe-core`、`minimatch`、`eslint-plugin-jsx-a11y-x`
- **THEN** 三者都不出现在任何 `package.json` 与 `pnpm-lock.yaml` 中

#### Scenario: 保留依赖的理由可查

- **WHEN** 维护者检查 `dependency-evaluation.md`
- **THEN** 每个保留依赖都有调用点、体积数据与保留理由
- **AND** `language-tags` 的保留理由包含与 `Intl.Locale`、`bcp-47` 的语义差异证据

### Requirement: a11y 插件的可复现替换度量

替换 MUST 提交 `footprint-report.md`，报告 MUST 包含环境（Node、pnpm、操作系统）、命令、样本数与统计方法，MUST 区分共享依赖与新包实际新增成本，并 MUST 记录替换前后的依赖 unpacked 体积与代表性 `eslint` 运行耗时；耗时语料 MUST 使用仓库现有真实 JSX 源码（例如 `packages/atelier/**/*.tsx`），MUST NOT 新增 fixture 目录、基准脚本或仓库级 ignore/exclude 配置。体积指标 SHOULD 至少改善 10%，代表性 lint 中位耗时 MUST NOT 回退超过 5%。未达门槛的候选 MUST 保留原实现并记录否决结论。

#### Scenario: 报告可复现

- **WHEN** 维护者按报告中的命令在相同环境重跑
- **THEN** 能得到与报告一致量级的体积与耗时结果

#### Scenario: 未达门槛

- **WHEN** 某项替换未满足体积或耗时门槛
- **THEN** `footprint-report.md` 记录否决结论并说明保留的原实现

#### Scenario: 运行时行为未回退

- **WHEN** 新实现在 parity 对照数据与规则测试上全部通过
- **THEN** 体积与耗时数据可作为替换结论的有效依据

#### Scenario: 不新增基准脚手架

- **WHEN** 维护者检查仓库
- **THEN** 不存在 `packages/eslint-plugin-jsx-a11y/benchmark/` 或基准脚本
- **AND** 耗时测量通过报告中记录的同一组一次性命令完成
