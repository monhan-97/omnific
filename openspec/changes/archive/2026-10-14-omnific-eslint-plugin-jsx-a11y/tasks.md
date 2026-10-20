# 任务

## 1. 基线与约束

- [x] 1.1 记录上游仓库 `https://github.com/eslint-community/eslint-plugin-jsx-a11y-x`、commit `ec06126fa25b4cd10099eba84a88fc94d1a0da90`、MIT 许可证（含 `Copyright (c) 2024-present ES Community Tooling` 与 `Copyright (c) 2016-2024 Ethan Cohen` 两行）与参考源码路径到变更文档 `baseline-report.md`；包内不新增 `NOTICE.md`。
- [x] 1.2 从当前 `node_modules` 复制上游 `src/`、`__tests__/`、`__mocks__/`、`docs/rules/` 到仓库外临时目录作为迁移参考，不把上游 `examples/` 纳入仓库。
- [x] 1.3 记录旧插件运行时依赖基线：`pnpm why eslint-plugin-jsx-a11y-x`、每个依赖的 `pnpm view <pkg> dist.unpackedSize` 与 `du -sh node_modules/.pnpm/<pkg>@<version>`。
- [x] 1.4 用仓库现有真实 JSX 源码（`packages/atelier/**/*.tsx`）作为固定语料，用一次性 `eslint --no-cache` 命令测量旧配置下的 9 次中位耗时与 p95，并记录到 `baseline-report.md`；MUST NOT 新增 fixture 目录、基准脚本或仓库级 `ignore` / `exclude` 配置。
- [x] 1.5 确认本变更不新增规则、不删除规则、不修改规则名称；36 条规则清单以 `upstream-analysis.md` 为准。
- [x] 1.6 确认包内不新增上游不存在的目录或文件（无 `benchmark/`、`fixtures/`、`NOTICE.md`、`examples/`）；`__test__/` 与 `.test.ts` 是对齐仓库测试惯例的命名。

## 2. 包骨架与构建

- [x] 2.1 新建 `packages/eslint-plugin-jsx-a11y/package.json`：`name` 为 `@omnific/eslint-plugin-jsx-a11y`、`version` 为 `0.1.0`、`type: module`、`license: MIT`、`engines` 与 `@omnific/eslint-config-react` 一致、`peerDependencies.eslint` 为 `^10.4.0`。
- [x] 2.2 声明 `main`、`module`、`types`、`exports`（`.`、`./rules/*`、`./util/*`、`./package.json`）、`sideEffects: false`、`files: ["dist", "docs", "README.md", "LICENSE"]`。
- [x] 2.3 声明 `scripts`：`build`（`tsdown -c tsdown.config.mts`）、`typecheck`（`tsc -p tsconfig.json --noEmit`）、`test`（`vitest run`）。
- [x] 2.4 声明 `dependencies`：`@omnific/utils`（`workspace:*`）、`picomatch`、`aria-query`、`axobject-query`、`jsx-ast-utils-x`、`language-tags`、`damerau-levenshtein`。
- [x] 2.5 声明 `devDependencies`：`@omnific/tsconfig`（`workspace:*`）、`@types/aria-query`、`@types/damerau-levenshtein`、`@types/estree`、`@types/estree-jsx`、`@types/language-tags`、`@types/picomatch`、`@typescript-eslint/parser`；MUST NOT 重复声明 `eslint`、`tsdown`、`typescript`、`tsx`、`vitest`（仓库惯例由根 `package.json` 提供）；实现阶段允许临时加入 `eslint-plugin-jsx-a11y-x` 与 `axe-core` 作为 oracle。
- [x] 2.6 新建 `src/types/jsx-ast-utils-x.d.ts`，**从 `'estree-jsx'` 导入** JSX 节点类型并声明实际使用面（`elementType`、`propName`、`getProp`、`getPropValue`、`getLiteralPropValue`、`hasProp`、`hasAnyProp`、`hasEveryProp`、`eventHandlers`、`eventHandlersByType`、`GetPropOptions`、`HasPropOptions`）。
- [x] 2.7 新建 `src/types/axobject-query.d.ts`，声明 `AXObjects`、`elementAXObjects`、`AXObjectRoles`、`AXObjectElements` 四个 Map-like 集合。
- [x] 2.8 新建 `tsconfig.json`，继承 `@omnific/tsconfig/node.json`，`include` 覆盖 `./src` 与 `./__test__`。
- [x] 2.9 新建 `tsdown.config.mts`：`entry` 覆盖 `src/index.ts`、`src/configs/*.ts`、`src/rules/*.ts`、`src/util/*.ts`、`src/util/autocomplete/*.ts`、`src/util/implicitRoles/*.ts`，并设置 `root: 'src'`、`outDir: 'dist'`、`platform: 'node'`、`unbundle: true`、`fixedExtension: false`、`dts: true`、`clean: true`、`exports: false`。
- [x] 2.10 新建 `LICENSE`（MIT，保留上游两行版权声明并追加本仓库版权行）与初始 `README.md`；不新增 `NOTICE.md`。
- [x] 2.11 在根 `pnpm install` 后确认包被 workspace 识别，且 `pnpm --filter @omnific/eslint-plugin-jsx-a11y build` 可执行。

## 3. 测试基建

- [x] 3.1 新建 `__test__/utils/ruleTester.ts`：用 `RuleTester.describe` / `RuleTester.it` / `RuleTester.itOnly` 接线 `vitest`，并用 `RuleTester.setDefaultConfig` 注入默认 `languageOptions`（`ecmaVersion: 'latest'`、`sourceType: 'module'`、`parserOptions.ecmaFeatures.jsx`）；**不使用** ESLint 10 已移除的 `RuleTester.afterAll`。
- [x] 3.2 新建 `__test__/utils/parsers.ts`：把每个用例展开为「默认 parser」与「`@typescript-eslint/parser`」两遍，并在 `code` 末尾追加说明当前 parser 与选项的注释。
- [x] 3.3 新建 `__test__/utils/parserOptionsMapper.ts`，仅支持 flat config 形态，不保留 ESLint 8 legacy 分支。
- [x] 3.4 不修改根 `vitest.config.ts`；确认 `__test__/**/*.test.ts` 被根 `include` 匹配且测试文件通过显式 import 使用 helper。
- [x] 3.5 不迁移 `__mocks__/` 手搓 AST 节点 mock；需要节点构造时改用 `@typescript-eslint/parser` 解析真实代码片段。

## 4. 共享工具迁移

- [x] 4.1 迁移 `src/util/getElementType.ts`，读取 `settings['jsx-a11y']` 的 `components`、`polymorphicPropName`、`polymorphicAllowList`，行为与上游一致。
- [x] 4.2 迁移 `aria-query` / `axobject-query` 相关工具：`isAbstractRole`、`isInteractiveElement`、`isInteractiveRole`、`isNonInteractiveElement`、`isNonInteractiveRole`、`isPresentationRole`、`isSemanticRoleElement`、`getExplicitRole`、`getComputedRole`。
- [x] 4.3 迁移内容与标签工具：`getAccessibleChildText`、`hasAccessibleChild`、`mayHaveAccessibleLabel`、`mayContainChildComponent`、`isContentEditable`、`isHiddenFromScreenReader`、`isDisabledElement`、`isFocusable`、`isNonLiteralProperty`、`isDOMElement`、`getTabIndex`、`attributesComparator`、`schemas`。
- [x] 4.4 迁移 `src/util/implicitRoles/` 全部 36 个文件与 `index.ts` 聚合入口，保持隐式 role 映射结果一致。
- [x] 4.5 迁移 `src/util/getSuggestion.ts`，改用 `picomatch` 之外的依赖不变；把常量替换为模块级 `Set` / `Map`，并保证建议只在报告路径计算。
- [x] 4.6 用 `@omnific/utils` 谓词替换上游手写 `typeof` 与 `null` / `undefined` 比较；对 `implicitRoles`、`aria-query` 联合类型收窄等例外场景添加注释说明。
- [x] 4.7 为全部导出的函数与类型补 TSDoc；每个 `util` 文件对应至少一个 `__test__/util/*.test.ts`。

## 5. 规则迁移

- [x] 5.1 迁移 `aria` 组规则：`aria-activedescendant-has-tabindex`、`aria-props`、`aria-proptypes`、`aria-role`、`aria-unsupported-elements`、`role-has-required-aria-props`、`role-supports-aria-props`。
- [x] 5.2 迁移内容与标签组规则：`alt-text`、`anchor-ambiguous-text`、`anchor-has-content`、`anchor-is-valid`、`control-has-associated-label`、`heading-has-content`、`img-redundant-alt`、`label-has-associated-control`。
- [x] 5.3 迁移交互与焦点组规则：`click-events-have-key-events`、`interactive-supports-focus`、`mouse-events-have-key-events`、`no-noninteractive-tabindex`、`tabindex-no-positive`。
- [x] 5.4 迁移 role 与元素组规则：`no-interactive-element-to-noninteractive-role`、`no-noninteractive-element-interactions`、`no-noninteractive-element-to-interactive-role`、`no-redundant-roles`、`no-static-element-interactions`、`prefer-tag-over-role`。
- [x] 5.5 迁移文档与媒体组规则：`html-has-lang`、`iframe-has-title`、`lang`、`media-has-caption`、`no-access-key`、`no-aria-hidden-on-focusable`、`no-autofocus`、`no-distracting-elements`、`scope`。
- [x] 5.6 为每条规则声明 `meta.type`、`meta.docs.description`、`meta.docs.url`（指向本仓库 `packages/eslint-plugin-jsx-a11y/docs/rules/<name>.md`）、`meta.schema`、`meta.defaultOptions`。
- [x] 5.7 把每个 `context.report({ message })` 迁移为 `meta.messages` + `messageId`，消息文本与上游逐字一致；`interactive-supports-focus` 声明 `meta.hasSuggestions: true`，其余规则不声明 fixer。
- [x] 5.8 为 36 条规则各建 `__test__/rules/<name>.test.ts`，等价迁移上游 `__tests__/src/rules/*.spec.js` 的 valid / invalid 用例与选项组合。
- [x] 5.9 确认没有规则提供 autofix，且 `meta.schema[0].type === 'object'` 的上游约束仍成立。

## 6. 插件对象与配置

- [x] 6.1 新建 `src/configs/flat-config-base.ts`，只声明 `languageOptions.parserOptions.ecmaFeatures.jsx`。
- [x] 6.2 新建 `src/index.ts`：对象字面量声明 36 条规则的 `rules` 表与 `configs`，不使用运行时 `Object.assign` 二次赋值。
- [x] 6.3 `meta.name` / `meta.version` 与 `package.json` 一致，且不通过 `createRequire` 或文件系统读取 `package.json`。
- [x] 6.4 `configs.recommended` / `configs.strict` 的 `name` 为 `jsx-a11y/recommended` 与 `jsx-a11y/strict`，规则集合、级别与选项与上游一致。
- [x] 6.5 `configs.*.plugins['jsx-a11y']` 与默认导出引用相等，插件对象冻结并导出 `rules`、`configs`、`RuleName`、`JsxA11ySettings`。
- [x] 6.6 新建 `__test__/plugin.test.ts`：rules 清单与 `src/rules` 目录一一对应、configs 引用相等、`meta` 与 `package.json` 一致、`meta.type` 与 `meta.docs.url` 规范、`settings['jsx-a11y']` 三个字段行为与上游一致。

## 7. 依赖替换

- [x] 7.1 把 `label-has-associated-control`、`mayContainChildComponent`、`mayHaveAccessibleLabel` 的 glob 匹配切换到 `picomatch`，并补充 brace expansion、extglob、字面量相等、大小写敏感性四类等价用例。
- [x] 7.2 新建 `src/util/autocomplete/tokens.ts` 与 `src/util/autocomplete/index.ts`，按 WHATWG HTML Standard 的 autofill 语法实现 `autocomplete-valid` 校验，不复制 `axe-core`（MPL-2.0）源码。
- [x] 7.3 重写 `src/rules/autocomplete-valid.ts` 使用本地实现，保持 `inputComponents` 选项与失败消息文本与上游一致。
- [x] 7.4 生成 `__test__/parity/autocomplete-parity.ts`（TS 数据模块）：枚举全部 autocomplete token × `input` `type` 组合与畸形字符串语料，用上游插件（内部 axe `runVirtualRule`）记录 expected 结果。
- [x] 7.5 生成 `__test__/parity/rules-parity.ts`（TS 数据模块）：对每条规则的代表性代码样本运行上游插件并记录报告结果，作为常规 parity 回归基线。
- [x] 7.6 新建 `__test__/parity/autocomplete.test.ts` 与 `__test__/parity/rules.test.ts`，对全部对照数据断言新实现输出与 expected 完全一致。
- [x] 7.7 从所有 `package.json` 与 `pnpm-lock.yaml` 中移除 `axe-core`、`minimatch`、`brace-expansion`、`balanced-match`、`eslint-plugin-jsx-a11y-x`；若本地实现无法对齐对照数据，回退为保留 `axe-core` 运行时依赖并记录否决结论；同时删除 oracle 的临时类型垫片。

## 8. 文档与许可

- [x] 8.1 迁移 36 份 `docs/rules/*.md`（英文），更新规则 id 前缀为 `jsx-a11y/` 与文档 URL。
- [x] 8.2 编写 `README.md`（英文）：安装、flat config 用法、`recommended` / `strict`、settings、规则表，以及从 `eslint-plugin-jsx-a11y-x` 迁移的说明。
- [x] 8.3 在变更文档记录上游仓库、commit `ec06126fa25b4cd10099eba84a88fc94d1a0da90`、MIT 许可证、逐文件来源，以及 `axe-core@4.14.0` 仅作为实现阶段 oracle 的说明；包内不新增 `NOTICE.md`。
- [x] 8.4 保留上游 `@file` / `@author` 归属注释。
- [x] 8.5 新建 `__test__/docs.test.ts`：`src/rules` 与 `docs/rules` 一一对应、README 规则表覆盖全部规则、`recommended` / `strict` 标记与配置一致。

## 9. 消费方迁移

- [x] 9.1 `packages/eslint-config-react/package.json`：移除 `eslint-plugin-jsx-a11y-x`，新增 `@omnific/eslint-plugin-jsx-a11y`（`workspace:*`）。
- [x] 9.2 `packages/eslint-config-react/index.js`：插件 key 改为 `jsx-a11y`，全部规则 id 前缀由 `jsx-a11y-x/` 改为 `jsx-a11y/`，不改变已启用规则集合与选项。
- [x] 9.3 更新 `packages/eslint-config-react/README.md` 与 `CHANGELOG`，记录 BREAKING 迁移步骤（规则 id 前缀与 settings key）。
- [x] 9.4 确认根 `eslint.config.js` 组合 `@omnific/eslint-config` 与 `@omnific/eslint-config-react` 后仍可运行 `pnpm lint:fix`。

## 10. 度量与报告

- [x] 10.1 按 `dependency-evaluation.md` 的度量方法采集替换后的依赖体积、`du -sh` 与 npm `dist.unpackedSize` 数据。
- [x] 10.2 在同一语料与同一组命令上采集新配置的 `eslint --no-cache` 9 次中位耗时与 p95。
- [x] 10.3 编写 `footprint-report.md`：环境、命令、样本数、统计方法、前后对照、门槛判定（体积 SHOULD ≥10%，中位耗时 MUST NOT 回退 >5%）与任何否决结论。
- [x] 10.4 确认报告中区分共享依赖与新包实际新增的成本，并把 `@omnific/utils` 的增量单独列出。

## 11. 验证与收口

- [x] 11.1 运行 `pnpm --filter @omnific/eslint-plugin-jsx-a11y typecheck`。
- [x] 11.2 运行 `pnpm --filter @omnific/eslint-plugin-jsx-a11y build`，确认 `dist/` 镜像 `src/` 且相对导入带显式 `.js`。
- [x] 11.3 运行 `pnpm --filter @omnific/eslint-plugin-jsx-a11y test` 与根 `CI=true pnpm test`。
- [x] 11.4 运行根 `pnpm typecheck` 与 `pnpm lint:fix`。
- [x] 11.5 运行 `CI=true pnpm build`。
- [x] 11.6 运行 `graphify update .`。
- [x] 11.7 添加 Changeset：新包 `minor`（`0.1.0`），`@omnific/eslint-config-react` 为含 BREAKING 的版本变更。
- [x] 11.8 检查 OpenSpec 全部 Markdown 均为简体中文，固定结构关键词、路径、命令与代码标识除外。
