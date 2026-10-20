# 依赖替换评估：a11y 插件运行时依赖

## 评估目标

在不改变 36 条规则可观察行为的前提下，降低 `@omnific/eslint-plugin-jsx-a11y` 的运行时依赖数量与安装体积。评估遵循 `dependency-footprint` 既有要求：每项替换必须记录替换前后的直接依赖、传递依赖、安装占用与代表性耗时，并区分共享依赖与新包实际新增的成本。

## 基线

基线是被替换的 `eslint-plugin-jsx-a11y-x@0.2.0` 声明的 7 个运行时依赖，以及它们在本 workspace 的实际调用点。

| 依赖 | 版本 | unpacked | 传递依赖 unpacked | 调用点 |
| --- | --- | --- | --- | --- |
| `axe-core` | 4.14.0 | 3 430 531 B | 0 | 1 |
| `minimatch` | 10.2.6 | 536 122 B | `brace-expansion` 84 997 B + `balanced-match` 17 584 B | 3 |
| `aria-query` | 5.3.2 | 176 114 B | 0 | 51 个文件 |
| `axobject-query` | 4.1.0 | 110 878 B | 0 | 3 |
| `jsx-ast-utils-x` | 0.1.0 | 71 379 B | 0 | 55 个文件 |
| `language-tags` | 1.0.9 | 32 047 B | `language-subtag-registry` 0.3.23 → 1 544 744 B | 1 |
| `damerau-levenshtein` | 1.0.8 | 11 813 B | 0 | 1 |
| 合计 | | 6 016 209 B（约 6.02 MB） | | |

按调用点分摊：`axe-core` 与 `minimatch` 族合计 4 069 234 B（约 4.07 MB，占 67.6%），只服务 4 个调用点，属于典型的高占用低使用面依赖。

## 候选替换

### 1. `minimatch` → `picomatch`

| 指标 | `minimatch@10.2.6` | `picomatch@4.0.7` |
| --- | --- | --- |
| unpacked | 536 122 B | 93 759 B |
| 直接依赖 | `brace-expansion` | 0 |
| 传递依赖 | `balanced-match` | 0 |
| 体积变化 | -442 363 B（-74.4%，含传递依赖 -77.3%） | |

语义校验点：

- 使用点只有 3 处，模式均为组件名 glob（`labelComponents`、`controlComponents`、`componentName`）。
- 需要确认 brace expansion（`{a,b}`）、extglob（`+(a|b)`）、无 magic 时的字面量相等、大小写敏感性四类行为与 `minimatch` 默认选项一致。
- 若任一行为不一致且不能通过等价用例消解，则保留 `minimatch` 并在 `footprint-report.md` 记录否决依据。

结论：替换。需求门槛是体积改善 ≥10%，该候选改善 74.4%，远超门槛。

### 2. 移除运行时 `axe-core`

`axe-core` 只被 `autocomplete-valid` 使用一次调用 `runVirtualRule('autocomplete-valid', { nodeName: 'input', attributes: { autocomplete, type } })`。

候选方案对比：

| 方案 | 体积影响 | 结论 |
| --- | --- | --- |
| 保留 `axe-core` 运行时依赖 | 0 B | 否决：3.43 MB 只为 1 条规则 |
| 懒加载 `axe-core`（首次访问属性时 `createRequire`） | 0 B | 否决：只改善启动耗时，依赖与安装体积不变；ESLint 规则为同步 API，无法真正按需异步加载 |
| 使用 `html-autocomplete`（866 KB） | -2.56 MB | 否决：体积只减 73%，覆盖面与 axe 的 `type` 相关校验语义不同，仍需自研判定 |
| 本地实现 + 对照数据校验 | -3.43 MB | 采用 |
| 本地实现 + 常驻 axe oracle（devDependency） | -3.43 MB（消费者），workspace 不变 | 否决：workspace 仍需安装 3.43 MB；对照数据覆盖 token × `type` 全矩阵后可离开 oracle |

本地实现依据 WHATWG HTML Standard 的 autofill 语法与 token 表，不复制 `axe-core`（MPL-2.0）源码，因而新包仍可整体保持 MIT。

对照数据生成方式（实现阶段）：

1. 枚举全部 autocomplete token 与 `input` 的 `type` 取值组合，以及一组畸形字符串（大小写变体、多余空格、未知 token、`section-*` 组合、`shipping` / `billing` 前缀组合）。
2. 对每个组合调用上游 `eslint-plugin-jsx-a11y-x` 的 `autocomplete-valid`（内部即 axe `runVirtualRule`），记录是否报告与消息文本。
3. 结果写入 `__test__/parity/autocomplete-parity.ts`（TS 数据模块，不新增 `fixtures/` 目录）并提交；常规测试对其全量比对。
4. 生成完成后从 `package.json` 与 `pnpm-lock.yaml` 中移除 `axe-core`、`minimatch` 与 `eslint-plugin-jsx-a11y-x`，并删除 oracle 的临时类型垫片。

失败回退：若本地实现无法完全对齐对照数据，则回退为保留 `axe-core` 运行时依赖，并在 `footprint-report.md` 记录否决结论。

### 3. 保留 `aria-query`、`axobject-query`、`jsx-ast-utils-x`、`damerau-levenshtein`

| 依赖 | 保留原因 |
| --- | --- |
| `aria-query` | W3C ARIA 规格数据的事实标准（`dom`、`roles`、`elementRoles`、`aria`），零依赖；自维护数据表会引入长期漂移风险 |
| `axobject-query` | 提供 AXObject 侧的 `isInteractiveElement` / `isNonInteractiveElement` / `isSemanticRoleElement` 判定，是 `isInteractiveElement` 等工具的行为来源 |
| `jsx-ast-utils-x` | 已是 `jsx-ast-utils` 的现代化 fork（零依赖，使用可选链，无 polyfill 依赖），本仓库没有等价替代 |
| `damerau-levenshtein` | 11 813 B、零依赖；`fastest-levenshtein`（21 281 B）体积更大且只实现 Levenshtein，不含转置距离，会改变建议结果 |

### 4. 保留 `language-tags`

`language-tags` 自身只有 25 713 B，但会带入 `language-subtag-registry`（1 550 921 B），是本包最大的数据依赖。候选替代：

| 候选 | 体积 | 结论 |
| --- | --- | --- |
| `Intl.Locale`（Node 内置） | 0 B | 否决：只做语法校验，不做 IANA 注册表成员校验，会改变 `lang` 规则行为 |
| `bcp-47` | 34 019 B + `is-alphabetical` / `is-alphanumerical` / `is-decimal` | 否决：同样只做语法解析，不校验注册表成员 |
| `ietf-language-tag-regex` | 依赖 `xregexp@3` | 否决：只做正则语法校验，且引入更重的旧依赖 |

同一批样本的实测差异（`language-tags` 1.0.9）：

```text
"en"           tags.check=true   Intl.Locale=ok(en)
"en-US"        tags.check=true   Intl.Locale=ok(en-US)
"en-us"        tags.check=true   Intl.Locale=ok(en-US)
"EN"           tags.check=true   Intl.Locale=ok(en)
"zz"           tags.check=false  Intl.Locale=ok(zz)
"qaa"          tags.check=false  Intl.Locale=ok(qaa)
"abc-123"      tags.check=false  Intl.Locale=ok(abc-123)
"x-private"    tags.check=false  Intl.Locale=throw
"i-klingon"    tags.check=false  Intl.Locale=throw
"en-GB-oed"    tags.check=false  Intl.Locale=throw
"en_US"        tags.check=false  Intl.Locale=throw
```

由于差异集中在「注册表成员资格」这一规则核心语义上，`language-tags` 保留；`language-subtag-registry` 属于该包的规格数据，不额外评估。

## 不新增的开发依赖

| 候选 | 上游/常见用法 | 结论 |
| --- | --- | --- |
| `eslint-doc-generator` | 生成与校验规则文档 | 不引入：16 个直接依赖（含 `ajv`、`cosmiconfig`、`jest-diff`、`table`）；改为仓库内文档一致性测试 |
| `@typescript-eslint/rule-tester` | 类型化 RuleTester | 不引入：ESLint 10 自带 `RuleTester` 与类型，已能满足需求 |
| `eslint-plugin-eslint-plugin` | 校验规则元数据 | 不引入：改用 `__test__/plugin.test.ts` 断言 `meta.type`、`meta.docs.url`、`messageId` |
| `@babel/eslint-parser` + `@babel/preset-react` + 3 个 syntax 插件 | 第三条 parser 矩阵分支 | 不引入：用例统一跑默认 parser 与 `@typescript-eslint/parser` 两遍 |
| `@vitest/coverage-v8` | 覆盖率 | 不新增：覆盖率由根 `vitest` 配置决定，本包不单独引入 |

## 开发依赖归属约定

本仓库使用 pnpm 默认的 isolated linker：`packages/utils/node_modules` 下只有它自己声明的 `@omnific/tsconfig`，`packages/hooks/node_modules` 下只有 `@omnific`、`@types`、`react`，根 `node_modules/@types` 只有 `node`、`react`、`react-dom`。以此为前提区分三类：

| 类别 | 是否在本包声明 | 依据 |
| --- | --- | --- |
| 工具链 `eslint`、`tsdown`、`typescript`、`tsx`、`vitest` | MUST NOT 重复声明 | 仓库 8 个包全部只声明 `@omnific/tsconfig`；`packages/utils` 没有自己的 `node_modules/.bin`，仍能执行 `tsdown` 构建，说明 workspace 包脚本使用根 `node_modules/.bin` |
| 运行时依赖 | MUST 在 `dependencies` 声明 | 发布后由消费者安装，缺失即功能损坏；pnpm 不会把未声明的包链接到本包 |
| 类型声明 | MUST 在 `devDependencies` 声明或本地 ambient 声明 | `tsc` 只从本包及祖先目录解析模块；`@typescript-eslint/parser`、`@types/estree` 等在根 `node_modules` 并不存在 |

`@omnific/tsconfig` MUST 以 `workspace:*` 声明，与其余包保持一致。

## 类型声明策略

类型来源分三种，均不进入消费者安装体积：

| 来源 | 依赖 | 说明 |
| --- | --- | --- |
| 内置类型 | `eslint`、`typescript` | ESLint 10 自带 `Rule.RuleModule`、`Rule.RuleContext`、`Rule.Node`、`ESLint.Plugin`、`Linter.Config` 等类型，不引入 `@types/eslint` 或 `@typescript-eslint/utils` |
| DefinitelyTyped | `@types/aria-query@5.0.4`（11 983 B）、`@types/damerau-levenshtein@1.0.2`（3 218 B）、`@types/estree@1.0.9`、`@types/estree-jsx@1.0.5`、`@types/language-tags@1.0.4`（13 152 B）、`@types/picomatch@4.0.3`（17 046 B） | 包名与运行时依赖一致，直接生效 |
| 本地 ambient 声明 | `src/types/jsx-ast-utils-x.d.ts`、`src/types/axobject-query.d.ts` | npm 上没有对应声明（`@types/axobject-query` 为 404），`jsx-ast-utils-x` 是更名 fork |

`@typescript-eslint/parser@8.71.1` MUST 在 `devDependencies` 声明：它目前只存在于 `packages/eslint-config` 的 `dependencies`，根 `node_modules/@typescript-eslint` 不存在，本包无法解析。

不采用 `@types/jsx-ast-utils@3.3.1` 加映射的方案：该包描述的是原版 `jsx-ast-utils` 的 API，与更名 fork 之间没有版本约束，类型漂移会静默发生；本包自持声明可以精确描述 fork 的实际调用面。

`@types/*` MUST NOT 出现在 `dependencies`，否则消费者会被强制安装仅编译期需要的包。

### JSX 节点类型的加载条件

`@omnific/tsconfig/node.json` 设置 `types: ["node"]`，因此 `@types/estree-jsx` 不会被自动包含。`@types/estree` 定义 `NodeMap`，`@types/estree-jsx` 通过 `declare module "estree"` 向 `NodeMap` 注入 JSX 节点；只有程序中出现对 `estree-jsx` 的引用时，增强才会加载。

因此 `src/types/jsx-ast-utils-x.d.ts` MUST 从 `'estree-jsx'` 导入 JSX 节点类型。实测对照（`strict` + `verbatimModuleSyntax` + `noUncheckedIndexedAccess` + `types: ["node"]`）：

```text
shim 从 'estree-jsx' 导入   →  tsc --noEmit exit 0
shim 从 'estree' 导入       →  Rule.RuleListener 的 JSXAttribute 退化为 never，报 TS2322 / TS2339
```

### 本地声明覆盖范围

- `src/types/jsx-ast-utils-x.d.ts`：`elementType`、`propName`、`getProp`、`getPropValue`、`getLiteralPropValue`、`hasProp`、`hasAnyProp`、`hasEveryProp`、`eventHandlers`、`eventHandlersByType`，以及 `GetPropOptions` / `HasPropOptions`。
- `src/types/axobject-query.d.ts`：`AXObjects`、`elementAXObjects`、`AXObjectRoles`、`AXObjectElements` 四个 Map-like 集合（含 `get`、`has`、`keys`、`values`、`entries`、`forEach`、`size` 与 `[Symbol.iterator]`）。

两份声明 MUST 只覆盖实际使用面，并在文件头注明来源与维护责任。

## 预期结果

| 指标 | 替换前 | 替换后（预期） | 变化 |
| --- | --- | --- | --- |
| 运行时直接依赖 | `eslint-plugin-jsx-a11y-x` 的 7 个 | `@omnific/utils`、`picomatch`、`aria-query`、`axobject-query`、`jsx-ast-utils-x`、`language-tags`、`damerau-levenshtein` | 数量不变，构成改变 |
| 运行时依赖 unpacked 合计 | 6 016 209 B | 2 040 734 B（含 `@omnific/utils` 的 dist 体积，另计） | -66.1% |
| 最大单项依赖 | `axe-core` 3 430 531 B | `language-subtag-registry` 1 544 744 B | -55.0% |
| 规则包是否携带 MPL-2.0 源码 | 是（`axe-core` 运行时依赖） | 否 | 许可面收敛 |

`@omnific/utils` 的增量成本按 `packages/utils/dist` 实际产物单独记录，不并入上表的上游对照口径。

## 度量方法

`footprint-report.md` 必须记录：

- 环境：`node -v`、`pnpm -v`、macOS 版本、CPU 型号。
- 体积：修改前对 `eslint-plugin-jsx-a11y-x@0.2.0` 的依赖树执行 `pnpm why` 与 `du -sh node_modules/.pnpm/<pkg>@<version>`，并对每个包记录 npm `dist.unpackedSize`；修改后以相同命令度量新包。
- 耗时：在仓库现有真实 JSX 源码语料（`packages/atelier/**/*.tsx`）上分别用旧配置与新配置执行 `eslint --no-cache`，各运行 ≥ 9 次，记录中位耗时与 p95；MUST NOT 新增 fixture 目录、基准脚本或仓库级 `ignore` / `exclude` 配置。
- 门槛：体积 SHOULD 至少改善 10%（预期 66.1%）；代表性 lint 中位耗时 MUST NOT 回退超过 5%。
- 否决记录：任何未达门槛或行为不一致的候选，必须保留原始数据与否决理由。
