# 依赖足迹报告：`@omnific/eslint-plugin-jsx-a11y`

本报告按 `dependency-evaluation.md` 与 `specs/dependency-footprint/spec.md` 的方法，对照 `baseline-report.md` 记录替换后的运行时依赖体积与代表性 lint 耗时。

## 环境

| 项目 | 值 |
| --- | --- |
| Node | `v24.13.1` |
| pnpm | `12.11.2` |
| 操作系统 | macOS `26.5`（Build `25F71`） |
| CPU | Apple M1，8 核 |
| 内存 | 8 GB |
| ESLint（性能对照） | `10.13.0`（两端相同；体积基线采集时为 `10.12.0`） |
| 收集时间 | 2026-10-20 |

体积语料说明仍对照 `baseline-report.md`。性能对照**不再使用根配置整栈口径**，改用下方隔离方法。未新增 fixture、基准脚本或仓库级 `ignore` / `exclude`（一次性命令，配置不入库）。

## 命令

体积：

```bash
du -sh node_modules/.pnpm/<pkg>@<version>
pnpm view <pkg>@<version> dist.unpackedSize
```

性能（隔离 A/B，固定 ESLint / 解析器，只开各自 `configs.recommended`）：

```bash
# 两端相同：eslint@10.13.0 + @typescript-eslint/parser@8.71.2
# Omnific：@omnific/eslint-plugin-jsx-a11y（dist）
# 上游：eslint-plugin-jsx-a11y-x@0.2.0
# ignores：node_modules / dist / storybook-static
# 穿插：omnific → upstream → …；各端先预热 1 次
# atelier：15 对；packages 全量 ts/tsx：9 对
# 规则占比：TIMING=1 eslint -c <config> --no-cache <target>
```

统计：中位数为样本排序后的中间值（偶数对取相邻两中位平均）；p95 取排序后最大项（最近秩，小样本）。

## 替换后运行时依赖体积

当前 `packages/eslint-plugin-jsx-a11y/package.json` 的 `dependencies`：

`@omnific/utils`、`aria-query`、`axobject-query`、`damerau-levenshtein`、`jsx-ast-utils-x`、`language-tags`、`picomatch`。

不含 `axe-core`、`minimatch`、`brace-expansion`、`balanced-match`、`eslint-plugin-jsx-a11y-x`。

| 依赖 | 已装版本 | `du -sh` | unpacked（npm） | 类别 |
| --- | --- | --- | --- | --- |
| `aria-query` | 5.3.2 | 668K | 176 114 B | 保留（与上游相同） |
| `axobject-query` | 4.1.0 | 592K | 110 878 B | 保留 |
| `damerau-levenshtein` | 1.0.8 | 32K | 11 813 B | 保留 |
| `jsx-ast-utils-x` | 0.1.0 | 184K | 71 379 B | 保留 |
| `language-tags` | 2.1.0 | 40K | 25 713 B | 保留（基线为 1.0.9 / 32 047 B） |
| `language-subtag-registry` | 0.3.23 | 1.5M | 1 544 744 B | `language-tags` 传递依赖 |
| `picomatch` | 4.0.7 | 116K | 93 759 B | 替换 `minimatch` 族 |
| `@omnific/utils`（`packages/utils/dist`） | workspace | 268K（目录） | 72 741 B（文件合计） | 仓库共享；见下节单独计 |

上游对照口径的运行时依赖 unpacked 合计（不含 `@omnific/utils`）：

```text
176114 + 110878 + 11813 + 71379 + 25713 + 1544744 + 93759 = 2 034 400 B
```

约 2.03 MB。

## 前后对照（体积）

| 指标 | 替换前（基线） | 替换后 | 变化 |
| --- | --- | --- | --- |
| 运行时依赖 unpacked 合计 | 6 016 209 B（约 6.02 MB） | 2 034 400 B（约 2.03 MB） | **-3 981 809 B（-66.2%）** |
| 最大单项依赖 | `axe-core` 3 430 531 B | `language-subtag-registry` 1 544 744 B | -55.0% |
| 插件本体（参考） | `eslint-plugin-jsx-a11y-x` unpacked 267 460 B / `du` 936K | 本包 `dist/` 文件合计 232 905 B / `du` 924K | 本体量级相当 |
| 是否携带 MPL-2.0 运行时源码 | 是（`axe-core`） | 否 | 许可面收敛 |

门槛：**体积 SHOULD ≥10% 改善** → **达标**（实测 -66.2%，与 `dependency-evaluation.md` 预期 -66.1% 一致）。

### 移除与新增拆分

| 项 | unpacked | 说明 |
| --- | --- | --- |
| 移除 `axe-core` | -3 430 531 B | 本地 WHATWG autocomplete 实现 |
| 移除 `minimatch` + `brace-expansion` + `balanced-match` | -638 703 B | 改为 `picomatch` |
| 新增 `picomatch` | +93 759 B | 零传递依赖 |
| 净变（对照口径） | -3 981 809 B | 上表合计 |

`language-tags` 由基线 `1.0.9`（32 047 B）升到已装 `2.1.0`（25 713 B），传递的 `language-subtag-registry@0.3.23` 体积不变。

## 共享依赖 vs 新包实际新增成本

| 类别 | 依赖 | 说明 |
| --- | --- | --- |
| 与上游同构、对照口径保留 | `aria-query`、`axobject-query`、`jsx-ast-utils-x`、`damerau-levenshtein`、`language-tags` + `language-subtag-registry` | 替换前后都需要；不计入「新增成本」 |
| 工作区已存在的共享实例 | `picomatch`（亦被 Changesets / Vite 工具链使用）、`aria-query`（测试库另有 5.3.0） | 安装树中可能去重；本包仍声明自己的版本约束 |
| 本变更相对上游的净新增声明 | `picomatch`（相对移除的 minimatch 族仍大幅更小） | 见上表 |
| 仓库共享、单独列出 | `@omnific/utils` | 不并入上游对照口径合计 |

### `@omnific/utils` 增量（单独列出）

| 指标 | 值 |
| --- | --- |
| 声明方式 | `workspace:*` |
| `packages/utils/dist` 文件合计 | **72 741 B** |
| `du -sh packages/utils/dist` | 268K（含目录元数据） |
| 计入对照口径？ | **否**（按 `dependency-evaluation.md`：增量单独记录） |
| 是否为消费者新装整树？ | 否；Omnific workspace / 已依赖 `@omnific/utils` 的消费者可共享同一包 |

若把 utils 强行加进运行时合计：2 034 400 + 72 741 = 2 107 141 B，相对基线仍为 **-65.0%**，体积门槛仍达标。

## lint 性能对照（隔离 A/B，正式口径）

验证目标：固定 ESLint 版本、只开 jsx-a11y、更大语料 + 多次中位对比，并用 `TIMING=1` profile 规则执行占比。  
对照对象：`@omnific/eslint-plugin-jsx-a11y` vs `eslint-plugin-jsx-a11y-x@0.2.0`。  
采集时间：`2026-10-20T00:22:58+08:00`（UTC `2026-10-19T16:22:58.208Z`）。

门槛（相对上游插件）：中位耗时 MUST NOT 回退 >5%。实测 Omnific **更快**，达标。

### atelier（72 文件，穿插 15 对）

| 指标 | Omnific | 上游 | 差 |
| --- | --- | --- | --- |
| 中位 real | **0.46 s** | 0.51 s | **-0.05 s（-9.8%）** |
| p95 | 0.49 s | 0.53 s | -0.04 s |
| 最小 / 最大 | 0.45 / 0.49 | 0.49 / 0.53 | — |

Omnific 样本（秒）：

```text
0.47 0.46 0.46 0.46 0.45 0.46 0.46 0.49 0.47 0.48 0.46 0.46 0.45 0.47 0.47
```

上游样本（秒）：

```text
0.52 0.51 0.50 0.52 0.50 0.53 0.52 0.52 0.49 0.51 0.52 0.51 0.51 0.51 0.50
```

穿插成对原始值（`omnific` / `upstream`）：

```text
0.47/0.52  0.46/0.51  0.46/0.50  0.46/0.52  0.45/0.50
0.46/0.53  0.46/0.52  0.49/0.52  0.47/0.49  0.48/0.51
0.46/0.52  0.46/0.51  0.45/0.51  0.47/0.51  0.47/0.50
```

### 更大语料 `packages/**/*.{ts,tsx}`（420 文件，穿插 9 对）

| 指标 | Omnific | 上游 | 差 |
| --- | --- | --- | --- |
| 中位 real | **1.38 s** | 1.43 s | **-0.05 s（-3.5%）** |
| p95 | 1.43 s | 1.57 s | -0.14 s |
| 最小 / 最大 | 1.36 / 1.43 | 1.40 / 1.57 | — |

Omnific 样本（秒）：

```text
1.37 1.37 1.39 1.38 1.36 1.41 1.38 1.43 1.40
```

上游样本（秒）：

```text
1.40 1.43 1.55 1.42 1.44 1.45 1.42 1.43 1.57
```

穿插成对原始值（`omnific` / `upstream`）：

```text
1.37/1.40  1.37/1.43  1.39/1.55  1.38/1.42  1.36/1.44
1.41/1.45  1.38/1.42  1.43/1.43  1.40/1.57
```

### `TIMING=1` 规则执行占比（atelier）

规则合计：Omnific **8.186 ms**，上游 **10.083 ms**（wall time 仍以解析 / I/O / ESLint 框架为主）。

Omnific Top 10：

| Rule | Time (ms) | Relative |
| --- | ---: | ---: |
| `jsx-a11y/no-autofocus` | 2.312 | 19.5% |
| `jsx-a11y/label-has-associated-control` | 1.387 | 11.7% |
| `jsx-a11y/interactive-supports-focus` | 1.103 | 9.3% |
| `jsx-a11y/alt-text` | 0.603 | 5.1% |
| `jsx-a11y/no-noninteractive-element-interactions` | 0.554 | 4.7% |
| `jsx-a11y/aria-unsupported-elements` | 0.538 | 4.5% |
| `jsx-a11y/aria-proptypes` | 0.510 | 4.3% |
| `jsx-a11y/mouse-events-have-key-events` | 0.475 | 4.0% |
| `jsx-a11y/no-static-element-interactions` | 0.397 | 3.4% |
| `jsx-a11y/anchor-has-content` | 0.307 | 2.6% |

上游 Top 10：

| Rule | Time (ms) | Relative |
| --- | ---: | ---: |
| `jsx-a11y-x/label-has-associated-control` | 3.458 | 25.9% |
| `jsx-a11y-x/interactive-supports-focus` | 1.535 | 11.5% |
| `jsx-a11y-x/no-redundant-roles` | 0.972 | 7.3% |
| `jsx-a11y-x/no-noninteractive-element-interactions` | 0.903 | 6.7% |
| `jsx-a11y-x/alt-text` | 0.683 | 5.1% |
| `jsx-a11y-x/no-static-element-interactions` | 0.634 | 4.7% |
| `jsx-a11y-x/role-supports-aria-props` | 0.625 | 4.7% |
| `jsx-a11y-x/aria-unsupported-elements` | 0.537 | 4.0% |
| `jsx-a11y-x/mouse-events-have-key-events` | 0.443 | 3.3% |
| `jsx-a11y-x/aria-proptypes` | 0.293 | 2.2% |

关键规则对照：`label-has-associated-control` Omnific **1.387 ms** vs 上游 **3.458 ms**（约 **-60%**），与 `picomatch` 缓存等热路径优化一致。

## 总判定

| 门槛 | 结果 |
| --- | --- |
| 体积 SHOULD ≥10% 改善 | **通过**（-66.2%） |
| 中位耗时 MUST NOT 回退 >5%（相对上游，隔离口径） | **通过**（atelier -9.8%，wide -3.5%） |
| 行为 / parity | 已通过（见 `__test__/parity` 与规则测试） |

无依赖候选被否决回退；`picomatch` 与本地 autocomplete 均保留。
