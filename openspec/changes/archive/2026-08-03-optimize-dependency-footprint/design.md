# 设计：依赖性能与体积优化

## 背景

依赖“更快”和“更小”是两个不同指标：开发工具依赖主要影响安装、启动和命令耗时，`@omnific/store` 的依赖还可能进入消费应用 bundle。优化必须分别衡量安装成本、工具执行成本和浏览器产物，避免用一个指标替代全部结论。

## 目标

- 降低不使用 Tailwind/Sass 的项目安装成本和 `react-scripts` 配置初始化成本。
- 降低 `@omnific/store` draft update 的依赖体积，同时保持更新语义并改善或持平吞吐量。
- 使每项替换都能独立验证、独立回退。

## 非目标

- 不追求 package 数量为零。
- 不复制第三方复杂实现到仓库中以隐藏依赖。
- 不把首次冷启动改善与稳定态吞吐量混为一个结果。

## 决策

### 1. 使用分场景基准而不是总依赖数

基准报告分别覆盖 clean install、`react-scripts` 配置创建、Store primitive/object/array draft update，以及 Store 生产 bundle。每个结果记录 Node.js、pnpm、操作系统、CPU、样本数和统计量。

替换只有在功能测试通过，且目标指标满足以下门槛时才能落地：

- 体积优先替换的对应安装体积或生产 bundle 至少降低 10%；
- 代表性操作的中位耗时不得回退超过 5%；
- 若替换以性能为主要理由，目标操作中位耗时至少改善 10%，并记录 bundle 或安装体积代价。

### 2. Tailwind 与 Sass 使用 capability detection

基础 CSS 继续使用 Rspack 内置 Lightning CSS 和 `postcss-loader`。Tailwind 插件仅在消费项目声明 Tailwind 能力时解析；Sass rule 仅在消费项目安装并声明 Sass 实现时创建。解析必须以消费项目根目录为边界，不能因 `react-scripts` 自身或 monorepo 根目录偶然存在依赖而误判。

选择 optional peer dependency 而不是动态下载安装。构建命令不得修改消费项目依赖或访问网络。

### 3. Store 使用单一 immutable engine

保留 Jotai 作为状态原语，移除 `jotai-immer` adapter。`@omnific/store` 使用 Jotai writable atom 和锁定版本 `mutative` 的 produce/create API 实现当前 updater 行为。替换前必须用同一测试矩阵对比 primitive replacement、nested mutation、array mutation、return replacement、异常传播和引用稳定性。

`mutative@1.3.0` 通过兼容矩阵，并在 Store draft update 基准中显著快于当前 `immer` + `jotai-immer` 实现。该候选会增加 createAtom-only bundle；本变更明确将 Store update 性能置于该 bundle 代价之上，因此进入替换实现。不得提交语义不完整的本地 draft 实现。

## 已考虑的替代方案

- 用 `sass` 替代 `sass-embedded`：`sass` 安装包未必更小，且 embedded compiler 通常更有利于编译性能；改为按需安装能同时避免无使用场景的成本并保留高性能实现。
- 手写 `get-port`：当前包本身很小，重写网络竞争和端口释放语义的风险高于体积收益。
- 手写 Rspack config merge：`rspack-merge` 很小，配置数组和 loader 合并语义容易出现回归。
- 删除 `ts-checker-rspack-plugin`：Rspack 的 SWC 转译不提供等价 TypeScript 语义检查，直接删除会降低诊断正确性。

## 风险

- pnpm 的严格依赖解析可能使 optional peer 的解析路径与 npm/yarn 不同；需要 fixture project 验证。
- `mutative` 与 Immer 在 edge case 的 draft 行为可能不同；公开类型变化必须作为 breaking change 发布。
- 基准易受缓存和机器负载影响；报告必须同时包含 cold/warm 结果和多次样本的中位数。

## 迁移步骤

1. 先提交基准与兼容 fixture，记录当前依赖图和结果。
2. 独立完成 `react-scripts` 可选集成并验证 fixture projects。
3. 独立完成 Store engine 替换；若门槛不满足则保持现状并记录否决结果。
4. 更新各 package README、peer dependency metadata 和 Changeset，明确 breaking 与按需安装要求。
