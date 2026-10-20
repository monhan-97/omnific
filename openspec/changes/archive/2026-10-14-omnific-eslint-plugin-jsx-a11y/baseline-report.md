# 基线与约束报告

本文件记录变更实施前的可复现基线：上游参考版本、旧插件依赖构成、lint 耗时基线、规则清单核对结果与目录边界约束。后续 `footprint-report.md` 必须使用同一环境、同一语料与同一组命令做前后对照。

## 环境

| 项目 | 值 |
| --- | --- |
| Node | `v24.13.1` |
| pnpm | `12.11.2` |
| 操作系统 | macOS `26.5` |
| CPU | Apple M1，8 核 |
| 内存 | 8 GB |
| ESLint | `10.12.0` |
| 收集时间 | 2026-10-14 |

## 上游参考版本

| 项目 | 值 |
| --- | --- |
| 仓库 | `https://github.com/eslint-community/eslint-plugin-jsx-a11y-x` |
| commit | `ec06126fa25b4cd10099eba84a88fc94d1a0da90` |
| 版本 | `0.2.0` |
| 许可证 | MIT |
| 版权声明 | `Copyright (c) 2024-present ES Community Tooling` 与 `Copyright (c) 2016-2024 Ethan Cohen` |
| 迁移参考快照 | `/private/tmp/jsx-a11y-x-src`（仓库外临时目录，含 `src/`、`__tests__/`、`__mocks__/`、`docs/rules/`，未纳入仓库） |
| 未纳入内容 | 上游 `examples/`（`flat-cjs`、`flat-esm`、`legacy`）不迁移 |

包内 MUST NOT 新增上游不存在的目录或文件。本变更因此不引入 `benchmark/`、`fixtures/`、`NOTICE.md` 或 `examples/`，也不新增基准脚本；归属信息改由包内 `LICENSE`（保留上游两行版权并追加本仓库版权行）、源文件 `@file` / `@author` 注释与本报告记录。

## 旧插件依赖基线

`pnpm why eslint-plugin-jsx-a11y-x`：

```text
eslint-plugin-jsx-a11y-x@0.2.0
└── @omnific/eslint-config-react@1.0.6 (dependencies)

Found 1 version of eslint-plugin-jsx-a11y-x
```

体积数据来自 `du -sh node_modules/.pnpm/<pkg>@<version>` 与 `pnpm view <pkg>@<version> dist.unpackedSize`，版本为 workspace 实际安装版本。

| 依赖 | 已装版本 | `du -sh` | unpacked | 调用点 |
| --- | --- | --- | --- | --- |
| `eslint-plugin-jsx-a11y-x` | 0.2.0 | 936K | 267 460 B | 被替换的插件本体 |
| `axe-core` | 4.14.0 | 3.3M | 3 430 531 B | 仅 `autocomplete-valid` |
| `minimatch` | 10.2.6 | 664K | 536 122 B | 3 处组件名 glob |
| `brace-expansion` | 5.0.12 | 124K | 84 997 B | `minimatch` 传递依赖 |
| `balanced-match` | 4.0.4 | 60K | 17 584 B | `brace-expansion` 传递依赖 |
| `aria-query` | 5.3.2 | 668K | 176 114 B | 51 个源文件 |
| `axobject-query` | 4.1.0 | 592K | 110 878 B | 3 个工具 |
| `jsx-ast-utils-x` | 0.1.0 | 184K | 71 379 B | 55 个源文件 |
| `language-tags` | 1.0.9 | 44K | 32 047 B | `lang` 规则 |
| `language-subtag-registry` | 0.3.23 | 1.5M | 1 544 744 B | `language-tags` 传递依赖 |
| `damerau-levenshtein` | 1.0.8 | 32K | 11 813 B | `getSuggestion` |

上述 7 个运行时依赖连同传递依赖合计 unpacked `6 016 209 B`（约 6.02 MB），其中 `axe-core` 与 `minimatch` 族合计 `4 069 234 B`（约 4.07 MB，占 67.6%），只服务 4 个调用点。

## lint 耗时基线

语料为仓库现有真实 JSX 源码，不新增 fixture 目录：

```bash
find packages/atelier -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/storybook-static/*" | wc -l
# 72
```

测量命令（在仓库根目录执行，使用根 `eslint.config.js`，即 `@omnific/eslint-config` + `@omnific/eslint-config-react` 的旧配置）：

```bash
for i in 0 1 2 3 4 5 6 7 8 9; do
  /usr/bin/time -p node_modules/.bin/eslint --no-cache packages/atelier > /dev/null
done
```

方法：第 1 次为预热并丢弃，其余 9 次记录 `/usr/bin/time -p` 的 `real` 秒；中位数取排序后第 5 项，p95 取最近秩（9 个样本的第 9 项）。

| 样本 | real（秒） |
| --- | --- |
| 预热（丢弃） | 3.34 |
| 1 | 2.41 |
| 2 | 2.84 |
| 3 | 2.22 |
| 4 | 2.22 |
| 5 | 2.26 |
| 6 | 2.33 |
| 7 | 2.90 |
| 8 | 2.73 |
| 9 | 2.21 |

| 指标 | 值 |
| --- | --- |
| 中位耗时 | 2.33 s |
| p95 | 2.90 s |
| 最小 / 最大 | 2.21 s / 2.90 s |

`footprint-report.md` 必须在本语料上以同一命令重新测量新实现，并按 `dependency-footprint` 的门槛判定：体积 SHOULD 至少改善 10%，代表性 lint 中位耗时 MUST NOT 回退超过 5%。

## 规则清单核对

上游 `src/rules` 与 `upstream-analysis.md` 的 36 条清单做集合比对：

```python
import pathlib, re
upstream = {p.stem for p in pathlib.Path('/private/tmp/jsx-a11y-x-src/src/rules').glob('*.js')}
doc = pathlib.Path('openspec/changes/2026-10-14-omnific-eslint-plugin-jsx-a11y/upstream-analysis.md').read_text()
listed = {line.strip() for line in re.search(r'## 规则清单（36 条）\s*```(?:text)?\n(.*?)```', doc, re.S).group(1).strip().splitlines() if line.strip()}
assert upstream == listed, upstream ^ listed
```

结果：上游源文件 36 条、清单 36 条、集合完全一致，差异为空。本变更不新增、不删除、不重命名任何规则。

## 目录边界与仓库配置约束

- 本包内不存在 `benchmark/`、`fixtures/`、`NOTICE.md`、`examples/`。
- 基准测量用一次性命令完成，未新增基准脚本，也未修改根 `eslint.config.js`（无新增 `ignores`）或根 `tsconfig.json`（无新增 `exclude`）。
- `__test__/` 与 `.test.ts` 是对齐仓库既有测试惯例的命名；上游对应目录为 `__tests__/` 与 `.spec.js`。
- 实现阶段临时安装的 `eslint-plugin-jsx-a11y-x` 与 `axe-core` oracle 及其类型垫片，MUST 在替换验证完成后连同依赖一并移除。

## 许可、归属与逐文件来源

| 项目 | 值 |
| --- | --- |
| 上游仓库 | `https://github.com/eslint-community/eslint-plugin-jsx-a11y-x` |
| 上游 commit | `ec06126fa25b4cd10099eba84a88fc94d1a0da90` |
| 上游版本 | `0.2.0` |
| 许可证 | MIT |
| 包内 `LICENSE` | 保留上游两行版权（`ES Community Tooling`、`Ethan Cohen`），并追加 `Copyright (c) 2026-present monhan-97` |
| `NOTICE.md` | 不新增 |

归属保留方式：

- 源文件与规则模块头部的 `@file` / `@author` 注释沿用上游。
- 规则文档与 README 为英文；本变更目录内说明文档为简体中文。

逐文件来源（行为迁移，非逐行复制）：

| 本仓库路径 | 上游对应 |
| --- | --- |
| `packages/eslint-plugin-jsx-a11y/src/rules/*.ts` | `src/rules/*.{js,ts}` |
| `packages/eslint-plugin-jsx-a11y/src/util/**` | `src/util/**`（含 `implicitRoles/`） |
| `packages/eslint-plugin-jsx-a11y/src/index.ts` | `src/index.js` |
| `packages/eslint-plugin-jsx-a11y/src/configs/flat-config-base.ts` | `src/configs/flat-config-base.ts` |
| `packages/eslint-plugin-jsx-a11y/docs/rules/*.md` | `docs/rules/*.md`（规则 id 前缀改为 `jsx-a11y/`） |
| `packages/eslint-plugin-jsx-a11y/__test__/rules/*.test.ts` | `__tests__/src/rules/*.spec.js` |
| `packages/eslint-plugin-jsx-a11y/__test__/util/*.test.ts` | `__tests__/src/util/*.spec.js` |
| `packages/eslint-plugin-jsx-a11y/src/util/autocomplete/**` | 本仓库新增（WHATWG autofill 本地实现，替代 `axe-core`） |

### `axe-core@4.14.0` 仅作实现阶段 oracle

- 上游 `autocomplete-valid` 通过 `axe-core` 的 `runVirtualRule('autocomplete-valid')` 判定。
- 本包用本地 WHATWG 实现替换运行时依赖；对照语料写在 `__test__/parity/autocomplete-parity.json`，由 `axe-core@4.14.0` 在实现阶段生成。
- 规则代表性样本对照写在 `__test__/parity/rules-parity.ts`，由 `eslint-plugin-jsx-a11y-x@0.2.0` 在实现阶段生成。
- oracle 与临时类型垫片不保留在任何 `package.json`；`axe-core` 若仍出现在 lockfile，仅来自无关包（例如 Storybook a11y addon）的传递依赖。
