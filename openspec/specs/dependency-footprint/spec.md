# dependency-footprint 规范

## Purpose

定义依赖体积与性能优化的可复现基准、验收门槛、可选样式集成、Store draft 行为、低收益核心依赖边界，以及 a11y 插件运行时依赖构成。

## Requirements

### Requirement: 可复现的依赖基线

每项依赖替换 MUST 记录优化前后的直接依赖、传递依赖、增量安装占用和相关运行时或工具执行指标。报告 MUST 包含环境、命令、样本数和统计方法，且 MUST 区分共享依赖与该 package 新增的实际成本。

#### Scenario: 候选替换进入实现阶段

- **WHEN** 维护者准备合并一项依赖替换
- **THEN** 仓库中存在可在相同环境重复执行的前后基准及原始结果

#### Scenario: 候选只减少 package 名称数量

- **WHEN** 候选没有降低增量安装占用、目标 bundle 或代表性执行耗时
- **THEN** 该候选不得被标记为体积或性能优化

### Requirement: 优化验收门槛

依赖替换 MUST 保持功能兼容测试通过，目标体积指标 SHOULD 至少改善 10%，且代表性操作的中位耗时 MUST NOT 回退超过 5%。以性能为主要理由的替换，其目标操作中位耗时 MUST 至少改善 10%，并 MUST 明确记录任何目标 bundle 增长。未满足对应优先目标门槛的候选 MUST 保持现有实现并记录否决结果。

#### Scenario: 候选体积更小但执行更慢

- **WHEN** 候选体积改善达到 10% 但代表性操作中位耗时回退超过 5%
- **THEN** 替换不进入发布变更

#### Scenario: 候选执行更快但目标体积变大

- **WHEN** 候选代表性操作中位耗时改善达到 10% 但目标 bundle 未达到体积改善门槛
- **THEN** 报告必须保留性能收益结论和体积代价，且仅当 OpenSpec 明确以性能优先时进入实现替换

#### Scenario: 候选通过全部门槛

- **WHEN** 功能测试通过且体积与耗时满足对应优先目标门槛
- **THEN** 替换可以进入 package 实现和发布准备

### Requirement: 可选样式集成

`@omnific/react-scripts` MUST 在消费项目未启用 Tailwind 或 Sass 时避免解析和加载其实现包。对应集成启用时，工具 MUST 从消费项目边界解析兼容版本；缺少必需包时 MUST 在构建前返回可操作错误，而不是底层 module resolution stack trace。

#### Scenario: 项目仅使用普通 CSS

- **WHEN** 消费项目不声明 Tailwind 且没有 Sass 源文件或配置
- **THEN** 配置创建和构建不解析 `@tailwindcss/postcss`、`sass-loader` 或 `sass-embedded`

#### Scenario: 项目启用 Tailwind

- **WHEN** 消费项目安装受支持的 Tailwind integration packages
- **THEN** PostCSS pipeline 加载消费项目中的 `@tailwindcss/postcss` 并成功处理 Tailwind CSS

#### Scenario: 项目启用 Sass 但缺少 compiler

- **WHEN** 消费项目声明 Sass 能力但未安装受支持的 Sass compiler
- **THEN** 构建在处理配置时失败，并显示准确的缺失包与安装命令

### Requirement: Store draft 行为兼容

在候选通过验收门槛后，`@omnific/store` MUST 只使用 Jotai 与一个 immutable engine 实现 draft update，并 MUST 保持 value replacement、nested mutation、array mutation、异常传播和未变化值引用稳定性的已定义行为。

#### Scenario: updater 修改嵌套字段

- **WHEN** 调用方通过 `AtomDraftUpdater` 修改对象或数组的嵌套值
- **THEN** atom 发布更新值且不直接修改先前状态

#### Scenario: updater 没有产生变化

- **WHEN** updater 未修改 draft 且未返回 replacement
- **THEN** atom 保持先前值引用并且不产生语义不同的状态

#### Scenario: 候选存在行为差异

- **WHEN** `mutative` 在兼容矩阵的任一受支持场景中与已定义行为不一致
- **THEN** `immer` 与 `jotai-immer` 保持不变，差异被记录为否决依据

### Requirement: 明确保留低收益核心依赖

本变更 MUST NOT 重写或移除 `@rspack/core`、`@rspack/dev-server`、`@rspack/plugin-react-refresh`、`postcss`、`postcss-loader`、`react-refresh`、`ts-checker-rspack-plugin`、`rspack-merge` 或 `get-port`，除非后续独立 OpenSpec 提供行为等价证明并满足相同验收门槛。

#### Scenario: 低收益依赖被建议手写替代

- **WHEN** 候选方案仅通过复制 `get-port` 或 `rspack-merge` 的职责来减少一个 dependency entry
- **THEN** 本变更拒绝该方案并保留已验证的第三方实现

#### Scenario: 类型检查插件被建议删除

- **WHEN** 替代方案仅依赖 SWC 转译且不提供等价 TypeScript semantic diagnostics
- **THEN** `ts-checker-rspack-plugin` 保持启用

### Requirement: a11y 插件运行时依赖构成

`@omnific/eslint-plugin-jsx-a11y` 的运行时 `dependencies` MUST 只包含 `@omnific/utils`、`picomatch`、`aria-query`、`axobject-query`、`jsx-ast-utils-x`、`language-tags` 与 `damerau-levenshtein`。包 MUST NOT 依赖 `axe-core`、`minimatch`、`brace-expansion`、`balanced-match` 或 `eslint-plugin-jsx-a11y-x`。每个保留的依赖 MUST 在 `dependency-evaluation.md` 中记录用途、unpacked 体积与保留理由。

#### Scenario: 检查运行时依赖

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y/package.json`
- **THEN** `dependencies` 与上述清单完全一致

#### Scenario: 排除高占用低使用面依赖

- **WHEN** 维护者在仓库内搜索 `axe-core`、`minimatch`、`eslint-plugin-jsx-a11y-x`
- **THEN** 三者都不出现在 `@omnific/eslint-plugin-jsx-a11y` 与 `@omnific/eslint-config-react` 的 `package.json` 中
- **AND** 本插件不声明这些包为运行时依赖（lockfile 中允许无关包的传递依赖，例如 Storybook a11y addon）

#### Scenario: 保留依赖的理由可查

- **WHEN** 维护者检查 `dependency-evaluation.md`
- **THEN** 每个保留依赖都有调用点、体积数据与保留理由
- **AND** `language-tags` 的保留理由包含与 `Intl.Locale`、`bcp-47` 的语义差异证据

### Requirement: a11y 插件的可复现替换度量

替换 MUST 提交 `footprint-report.md`，报告 MUST 包含环境（Node、pnpm、操作系统）、命令、样本数与统计方法，MUST 区分共享依赖与新包实际新增成本，并 MUST 记录替换前后的依赖 unpacked 体积与代表性 `eslint` 运行耗时。耗时对照 SHOULD 固定 ESLint 版本、仅启用 a11y 规则并对上游实现做 A/B；语料 MUST 使用仓库现有真实 JSX/TSX 源码（例如 `packages/atelier/**/*.tsx`），MUST NOT 新增 fixture 目录、基准脚本或仓库级 ignore/exclude 配置。体积指标 SHOULD 至少改善 10%，相对上游的代表性 lint 中位耗时 MUST NOT 回退超过 5%。未达门槛的候选 MUST 保留原实现并记录否决结论。

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
