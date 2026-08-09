# 变更：优化依赖性能与安装体积

## 变更原因

当前 workspace 中大多数运行时包已经保持较小依赖面，但 `@omnific/react-scripts` 和 `@omnific/store` 仍会强制安装并初始化一些只在特定能力下使用或存在更快实现的依赖：

- `@tailwindcss/postcss`、`sass-loader` 和 `sass-embedded` 由 `@omnific/react-scripts` 强制安装，即使消费项目不使用 Tailwind 或 Sass。
- `@omnific/store` 为 draft 更新同时要求 `immer` 和 `jotai-immer`；同类 immutable update 可由单一且经本仓库基准验证吞吐更高的 `mutative` 实现。

这次变更必须以可复现的安装体积、启动/执行耗时和行为测试为依据。不能只依据包的宣传、单个压缩文件大小或微基准完成替换。

## 变更内容

- 为依赖优化建立基线，记录 clean install 后的依赖数量、磁盘占用，以及受影响 package 的代表性执行耗时。
- 将 Tailwind 和 Sass 支持改为可选集成；只有消费项目实际启用对应能力时才解析并加载相关包，并在缺包时输出可操作的错误。
- 在 Store draft update 明确性能优先的前提下，使用锁定版本的 `mutative` 替代 `immer` 和 `jotai-immer`，由 `@omnific/store` 直接构造 Jotai writable atom，并记录 bundle 增长代价。
- 为优化后的依赖图、功能兼容性和基准结果添加自动检查或可重复执行的报告。
- 保留 `@rspack/core`、`@rspack/dev-server`、`@rspack/plugin-react-refresh`、`postcss`、`postcss-loader`、`react-refresh`、`ts-checker-rspack-plugin`、`rspack-merge` 和 `get-port`。这些包分别属于核心构建能力或当前替换收益不足，本变更不重写其职责。

## 非目标

- 不替换 Rspack、Jotai、TypeScript 或 React。
- 不移除 Tailwind、Sass、draft updater 或现有 lint 能力入口。
- 不引入自研通用配置合并器、端口扫描库、CSS 编译器或 TypeScript checker。
- 不以降低诊断正确性、可访问性检查或生产构建输出质量换取基准改善。
- 不在没有本仓库基准和兼容测试的情况下仅凭理论数据宣称性能提升。

## 影响范围

- 受影响的 capability：`dependency-footprint`、`react-build-tooling`、`store-draft-updates`
- 受影响的 package：`packages/react-scripts`、`packages/store`
- 受影响的依赖：`@tailwindcss/postcss`、`sass-loader`、`sass-embedded`、`immer`、`jotai-immer`、`mutative`
- `@omnific/react-scripts` 的 Tailwind/Sass 集成从内置强制依赖变为消费项目按需安装；这是安装要求变化，必须提供缺包诊断和迁移说明。
- BREAKING: `@omnific/store` 导出的 `AtomDraftUpdater` draft 类型不再来自 Immer。依赖 Immer-specific draft 类型或行为的消费方必须迁移到 `mutative` 支持的等价类型与语义。
