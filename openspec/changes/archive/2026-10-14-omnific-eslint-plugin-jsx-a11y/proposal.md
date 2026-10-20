# 变更：以 TypeScript 重写 eslint-plugin-jsx-a11y-x 为仓库内 `@omnific/eslint-plugin-jsx-a11y`

## Why

`@omnific/eslint-config-react` 当前直接依赖第三方 `eslint-plugin-jsx-a11y-x@^0.2.0`。该包可用，但不符合本仓库的代码与依赖约束：

- 源码为 JS/TS 混写：`src/` 下 66 个 `.js` 文件与 33 个 `.ts` 文件，用 `tsc` + `allowJs` 构建，规则实现里存在 21 处手写 `typeof` 判断和 35 处手写 `null` / `undefined` 比较，无法复用 `@omnific/utils` 谓词，也无法满足仓库 TSDoc、谓词与守卫式分支约定。
- 热路径写法偏旧：常量表使用数组 `indexOf` / `concat`、插件对象在运行时用 `Object.assign` 合并 `configs`、`meta.name` / `meta.version` 通过 `createRequire` 读取 `package.json`。
- 依赖占用与使用面不匹配：`axe-core`（unpacked 3.43 MB）只被 `autocomplete-valid` 一条规则用于 `runVirtualRule`；`minimatch`（unpacked 536 KB，另带 `brace-expansion` 85 KB 与 `balanced-match` 17.6 KB）只用于 3 处组件名 glob 匹配。
- 规则本身缺少现代化元数据：36 条规则全部没有 `meta.type`，只有 1 条声明 `meta.hasSuggestions`，`meta.messages` / `messageId` 基本未使用。
- 上游文档与文档校验依赖 `eslint-doc-generator`（16 个直接依赖），无法直接搬到本仓库工具链。

因此本变更在仓库内以 TypeScript 重写该插件，保持规则清单、选项 schema、消息文本与配置语义一致，同时把依赖、体积和写法收敛到仓库现有规范。

## 上游参考版本

- 仓库：`https://github.com/eslint-community/eslint-plugin-jsx-a11y-x`
- commit：`ec06126fa25b4cd10099eba84a88fc94d1a0da90`
- 版本：`0.2.0`
- 许可证：MIT
- 许可证文件：`LICENSE`
- 参考源码路径：`src/`、`src/rules/`、`src/util/`、`src/util/implicitRoles/`、`src/configs/`、`__tests__/`、`__mocks__/`、`docs/rules/`、`scripts/`、`package.json`、`tsconfig.json`、`eslint.config.mjs`、`vitest.config.js`

深度分析见本变更 `upstream-analysis.md`，依赖替换评估见 `dependency-evaluation.md`。

## What Changes

- 新增 `packages/eslint-plugin-jsx-a11y`：包名 `@omnific/eslint-plugin-jsx-a11y`，初始版本 `0.1.0`，`type: module`，MIT，`peerDependencies.eslint` 与本仓库 `@omnific/eslint-config` 对齐。
- 目录结构对齐上游，但源码全部为 TypeScript：

```text
packages/eslint-plugin-jsx-a11y/
  src/
    index.ts
    configs/
      flat-config-base.ts
    rules/            # 36 条规则，全部 .ts
    util/             # 共享工具，全部 .ts
    util/implicitRoles/  # 隐式 role 表，全部 .ts
  __test__/           # vitest + RuleTester，全部 .test.ts
  docs/rules/         # 36 份规则文档
  scripts/            # 规则脚手架与索引维护脚本（TS，通过 tsx 执行）
  package.json
  tsconfig.json
  tsdown.config.mts
  README.md
  LICENSE
```

- 迁移全部 36 条规则，规则名与上游一一对应：`alt-text`、`anchor-ambiguous-text`、`anchor-has-content`、`anchor-is-valid`、`aria-activedescendant-has-tabindex`、`aria-props`、`aria-proptypes`、`aria-role`、`aria-unsupported-elements`、`autocomplete-valid`、`click-events-have-key-events`、`control-has-associated-label`、`heading-has-content`、`html-has-lang`、`iframe-has-title`、`img-redundant-alt`、`interactive-supports-focus`、`label-has-associated-control`、`lang`、`media-has-caption`、`mouse-events-have-key-events`、`no-access-key`、`no-aria-hidden-on-focusable`、`no-autofocus`、`no-distracting-elements`、`no-interactive-element-to-noninteractive-role`、`no-noninteractive-element-interactions`、`no-noninteractive-element-to-interactive-role`、`no-noninteractive-tabindex`、`no-redundant-roles`、`no-static-element-interactions`、`prefer-tag-over-role`、`role-has-required-aria-props`、`role-supports-aria-props`、`scope`、`tabindex-no-positive`。
- 保持 `configs.recommended` 与 `configs.strict` 的规则集合、严重级别与选项与上游一致，`meta`、`name` 与 `jsx-a11y/<config>` 命名按新包调整。
- 规则命名空间改为 `jsx-a11y`，插件 settings key 改为 `jsx-a11y`（上游为 `jsx-a11y-x`）。
- 现代化实现约束：`meta.type` 全覆盖、`meta.messages` + `messageId` 且消息文本与上游一致、模块级 `Set` / `Map` 常量表、复用 `@omnific/utils` 谓词、构建期注入 `meta.version`、插件对象不可变。
- 测试全部为 TypeScript：`__test__/**/*.test.ts`，使用 `vitest` 与 ESLint 自带 `RuleTester`，对每条用例同时跑默认 parser 与 `@typescript-eslint/parser`，并保留上游规则用例的等价断言。
- 依赖替换：
  - `minimatch` → `picomatch`（unpacked 93.8 KB，零依赖），同时移除 `brace-expansion` 与 `balanced-match`。
  - 移除运行时 `axe-core`：`autocomplete-valid` 改为本地实现，正确性由从上游 oracle 生成并提交的 TS 对照数据（`__test__/parity/`）保证。
  - 保留 `aria-query`、`axobject-query`、`jsx-ast-utils-x`、`damerau-levenshtein`、`language-tags`，并在 `dependency-evaluation.md` 记录保留原因。
  - 运行时不引入 `eslint-doc-generator`、`eslint-plugin-eslint-plugin`、`@babel/eslint-parser`、`@typescript-eslint/rule-tester`。
- 文档与许可：`README.md` 与 `docs/rules/*.md` 使用英文；`LICENSE` 保持 MIT，保留上游版权声明（`Copyright (c) 2024-present ES Community Tooling` 与 `Copyright (c) 2016-2024 Ethan Cohen`）并追加本仓库版权行；上游仓库、commit `ec06126fa25b4cd10099eba84a88fc94d1a0da90`、许可证与逐文件来源记录在变更文档，包内不新增 `NOTICE.md`。
- 消费方迁移：`@omnific/eslint-config-react` 移除 `eslint-plugin-jsx-a11y-x` 依赖，改为依赖 `@omnific/eslint-plugin-jsx-a11y`，并把规则 id 前缀从 `jsx-a11y-x/` 改为 `jsx-a11y/`，不改变已启用的规则集合与选项。
- 记录并提交体积与耗时基线报告：`footprint-report.md`。

## 非目标

- 不新增、不删除、不重命名任何规则；不改变任何规则选项 schema、默认选项和报告消息文本。
- 不改变 `configs.recommended` / `configs.strict` 的规则集合、严重级别与选项值。
- 不保留 `jsx-a11y-x` 规则命名空间、`jsx-a11y-x` settings key、旧包名 `eslint-plugin-jsx-a11y-x` 或其他兼容别名。
- 不支持 ESLint 8 或 `.eslintrc` legacy 配置；本包只提供 flat config。
- 不引入 `eslint-doc-generator` 或任何文档生成器；规则文档为仓库内静态 Markdown。
- 不引入 `@typescript-eslint/rule-tester`、`eslint-plugin-eslint-plugin`、`@babel/eslint-parser`。
- 不新增规则文档站点、示例工程或 Storybook 集成；上游 `examples/` 不迁移。
- 不改变 `@omnific/eslint-config-react` 之外的任何 lint 配置行为。
- 不新增上游不存在的目录或文件（`benchmark/`、`fixtures/`、`NOTICE.md`、`examples/` 等），基准测量只用一次性命令与仓库现有语料，不引入基准脚本或 fixture 工程。

## 影响范围

- 受影响的 capability：`eslint-plugin-jsx-a11y`（新增）、`eslint-config-react`（新增）、`dependency-footprint`（新增 Requirement）。
- 受影响的 package：新增 `packages/eslint-plugin-jsx-a11y`；修改 `packages/eslint-config-react`。
- 受影响的依赖：
  - 新增运行时依赖：`picomatch`、`@omnific/utils`。
  - 新增开发依赖：`@typescript-eslint/parser`、`tsx`、`@omnific/tsconfig`、`tsdown`（均已在 workspace 内使用）。
  - 移除依赖：`eslint-plugin-jsx-a11y-x` 及其运行时会带入的 `aria-query`、`axe-core`、`axobject-query`、`damerau-levenshtein`、`jsx-ast-utils-x`、`language-tags`、`minimatch`；其中除 `axe-core` 与 `minimatch` 族以外，其余由新包直接声明。
- 上游参考信息按 OpenSpec 要求记录仓库地址、不可变 commit、源文件路径与 MIT 许可证要求。

## 迁移要求

- BREAKING（仅影响 `@omnific/eslint-config-react` 消费方）：

```text
jsx-a11y-x/alt-text              ->  jsx-a11y/alt-text
settings['jsx-a11y-x']           ->  settings['jsx-a11y']
settings['jsx-a11y-x'].components -> settings['jsx-a11y'].components
```

- 迁移步骤：
  1. 升级 `@omnific/eslint-config-react`。
  2. 把自定义规则 id 前缀 `jsx-a11y-x/` 全局替换为 `jsx-a11y/`。
  3. 把 `settings['jsx-a11y-x']` 重命名为 `settings['jsx-a11y']`。
- 不提供兼容层、别名导出或双命名空间支持；未迁移的配置会报未知规则，属于预期行为。
- `@omnific/eslint-config-react` 的 README 与 CHANGELOG 必须记录该迁移步骤。

## 测试范围

- `packages/eslint-plugin-jsx-a11y` 的 36 条规则：每条至少覆盖 1 个 valid 与 1 个 invalid 用例，并覆盖其选项 schema 与默认选项。
- 上游规则用例等价迁移：上游 `__tests__/src/rules/*.spec.js` 的有效/无效用例必须在新包中以 TS 用例等价覆盖，断言消息文本与错误数量。
- 插件契约测试：`rules` 清单、`configs` 引用相等、`meta.name` / `meta.version` 与 `package.json` 一致、`meta.type` 与 `meta.docs.url` 规范。
- 行为兼容对照测试：从上游插件与 axe oracle 生成的 TS 对照数据（`__test__/parity/`）上，新实现输出必须完全一致。
- 设置语义测试：`settings['jsx-a11y'].components`、`polymorphicPropName`、`polymorphicAllowList` 行为与上游一致。
- 消费方测试：`@omnific/eslint-config-react` 引用的规则 id 全部由新插件提供，且规则集合与迁移前一致。
- 文档一致性测试：36 条规则都有 `docs/rules/<name>.md`，README 规则表与 `src/rules` 目录一致。
