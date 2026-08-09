## 1. 建立可复现基线

- [x] 1.1 记录当前 lockfile 的直接/传递依赖数量，以及受影响依赖的 unpacked、pnpm store 和项目安装占用；区分共享依赖与增量占用。
  - [x] 1.1.a 生成 `react-scripts` Tailwind/Sass 样式能力依赖闭包报告，记录 runtime metadata、可选 peer 状态和当前 workspace 安装占用。
- [x] 1.2 为 `react-scripts` 配置创建和 Store draft update 建立可重复基准，记录环境、样本数、中位数和离散程度。
- [x] 1.3 为 `@omnific/store` 建立当前生产 bundle 基线，并保存 tree-shaking 后的压缩前后体积。

## 2. 按需加载样式工具

- [x] 2.1 将 Tailwind 与 Sass 相关包调整为 optional peer dependencies，并从消费项目根目录解析已启用的集成。
- [x] 2.2 仅在对应 capability 存在时创建 Tailwind plugin 或 Sass rule；缺少配套依赖时输出包含准确安装命令的错误。
- [x] 2.3 添加纯 CSS、Tailwind、Sass 和缺失可选依赖 fixture，验证配置、构建结果和错误信息。
- [x] 2.4 更新 `packages/react-scripts` README 和 dependency metadata，说明按需安装方式与支持版本。

## 3. 评估并替换 Store draft engine

- [x] 3.1 锁定候选 `mutative` 版本，记录官方仓库、不可变 commit SHA、许可证、API 来源和已知语义差异。
- [x] 3.2 对 `immer`/`jotai-immer` 与 `mutative` 运行相同的行为矩阵、吞吐量和 bundle 基准；只有满足设计门槛时继续替换。
  - 结果：`mutative@1.3.0` 行为矩阵通过，draft update 吞吐提升 67.52%，但同口径 createAtom-only raw minified bundle 从 9,725 bytes 增至 18,837 bytes。当前 Store 决策明确性能优先，接受该 bundle 代价并进入实现。
- [x] 3.3 使用 Jotai writable atom 与 `mutative` 实现 `createAtom`，同步更新导出的 draft/updater 类型并移除旧依赖。
- [x] 3.4 更新 Store 单元测试、README 和 breaking migration，覆盖 replacement、nested/array mutation、异常与引用行为。

## 4. 验证与发布准备

- [x] 4.1 对比优化前后 clean install、依赖占用、工具 cold/warm run、Store throughput 和 bundle，确认满足设计门槛并提交报告。
- [x] 4.2 运行 `pnpm typecheck`、`pnpm lint:fix`、`CI=true pnpm test` 和 `pnpm build`。
- [x] 4.3 为受影响的可发布 package 添加 Changeset，准确标记 Store breaking change 和 `react-scripts` 可选依赖迁移。
- [x] 4.4 运行许可证检查，确保新增依赖与保留的第三方包完成必要署名。
