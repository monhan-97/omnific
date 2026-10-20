# eslint-plugin-jsx-a11y 规范

## Purpose

定义仓库内 `@omnific/eslint-plugin-jsx-a11y` 的包契约、规则集合、配置、依赖与文档一致性要求。

## Requirements

### Requirement: 仓库内提供 `@omnific/eslint-plugin-jsx-a11y` 包

仓库 MUST 新增 `packages/eslint-plugin-jsx-a11y`，包名 MUST 为 `@omnific/eslint-plugin-jsx-a11y`，初始版本 MUST 为 `0.1.0`，MUST 声明 `type: module`、`license: MIT`、`sideEffects: false`，且 MUST NOT 标记为 `private`。`engines.node` MUST 与 `@omnific/eslint-config-react` 一致（`^22.13.0 || >=24.0.0`），`peerDependencies.eslint` MUST 与 `@omnific/eslint-config` 一致。

包 MUST 提供与上游一致的目录结构：

- `src/index.ts`
- `src/configs/flat-config-base.ts`
- `src/rules/*.ts`（36 条规则）
- `src/util/*.ts` 与 `src/util/implicitRoles/*.ts`
- `__test__/`
- `docs/rules/*.md`

#### Scenario: 检查包元数据

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y/package.json`
- **THEN** `name` 为 `@omnific/eslint-plugin-jsx-a11y`，`version` 为 `0.1.0`，`type` 为 `module`，`license` 为 `MIT`
- **AND** 不存在 `"private": true`
- **AND** `peerDependencies.eslint` 与 `@omnific/eslint-config` 的 `peerDependencies.eslint` 相同

#### Scenario: 检查源码目录结构

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y/src`
- **THEN** 存在 `index.ts`、`configs/flat-config-base.ts`、36 个 `rules/*.ts`、`util/` 与 `util/implicitRoles/`
- **AND** 不存在 `.js` 源文件

### Requirement: 插件默认导出契约

插件默认导出 MUST 是满足 ESLint flat config 的插件对象，MUST 包含 `meta`、`rules` 与 `configs`。`meta.name` MUST 为包名，`meta.version` MUST 与 `package.json` 的 `version` 一致且 MUST NOT 在运行时通过 `createRequire`、`import` 或文件系统读取 `package.json`。`configs` MUST 在模块初始化阶段一次构造完成（构造 `configs` 对象 → 被插件对象引用 → 填充后 `Object.freeze`），插件对象与 `configs` MUST 被冻结，导出后 MUST NOT 再变更任何字段。

`configs.recommended` 与 `configs.strict` MUST 存在，其 `name` MUST 为 `jsx-a11y/recommended` 与 `jsx-a11y/strict`，且 `configs.*.plugins['jsx-a11y']` MUST 与默认导出引用相等。

#### Scenario: 校验 meta 与版本号

- **WHEN** 测试加载插件默认导出并读取 `meta`
- **THEN** `meta.name` 为 `@omnific/eslint-plugin-jsx-a11y`
- **AND** `meta.version` 等于 `package.json` 的 `version`

#### Scenario: flat config 引用相等

- **WHEN** 测试遍历 `configs` 的每一项
- **THEN** `config.plugins['jsx-a11y']` 与插件默认导出是同一个对象引用

#### Scenario: 配置命名

- **WHEN** 测试读取 `configs.recommended.name` 与 `configs.strict.name`
- **THEN** 取值分别为 `jsx-a11y/recommended` 与 `jsx-a11y/strict`

### Requirement: 规则清单与上游一致

插件 `rules` MUST 恰好包含以下 36 条规则，规则名 MUST 与上游 `eslint-plugin-jsx-a11y-x@0.2.0` 完全一致，MUST NOT 新增、删除或重命名规则：

```text
alt-text
anchor-ambiguous-text
anchor-has-content
anchor-is-valid
aria-activedescendant-has-tabindex
aria-props
aria-proptypes
aria-role
aria-unsupported-elements
autocomplete-valid
click-events-have-key-events
control-has-associated-label
heading-has-content
html-has-lang
iframe-has-title
img-redundant-alt
interactive-supports-focus
label-has-associated-control
lang
media-has-caption
mouse-events-have-key-events
no-access-key
no-aria-hidden-on-focusable
no-autofocus
no-distracting-elements
no-interactive-element-to-noninteractive-role
no-noninteractive-element-interactions
no-noninteractive-element-to-interactive-role
no-noninteractive-tabindex
no-redundant-roles
no-static-element-interactions
prefer-tag-over-role
role-has-required-aria-props
role-supports-aria-props
scope
tabindex-no-positive
```

#### Scenario: 规则清单比对

- **WHEN** 测试读取 `src/rules` 目录与插件 `rules` 键集合
- **THEN** 两边的规则名集合与上述 36 条完全一致

#### Scenario: 配置引用的规则都存在

- **WHEN** 测试解析 `configs.recommended` 与 `configs.strict` 的规则键
- **THEN** 每一处 `jsx-a11y/<rule>` 都能在 `rules` 中找到同名规则

### Requirement: 规则行为、选项与消息兼容上游

每条规则的选项 schema、默认选项、报告位置与消息文本 MUST 与上游一致。规则 MUST NOT 提供 autofix。报告 MUST 通过 `meta.messages` 与 `messageId` 触发，且 `meta.messages` 中的文本 MUST 与上游 `context.report({ message })` 的文本逐字相同。只有实际产生 suggestion 的规则（`interactive-supports-focus`）MUST 声明 `meta.hasSuggestions: true`。

#### Scenario: 选项 schema 一致

- **WHEN** 测试比对每条规则的 `meta.schema` 与上游同名规则
- **THEN** 结构、类型、`uniqueItems` 与 `additionalProperties` 取值一致
- **AND** 声明 `[schema]` 的规则其 `meta.schema[0].type` 为 `object`

#### Scenario: 消息文本一致

- **WHEN** 测试触发任一 `messageId` 对应错误
- **THEN** 报告消息与上游同一场景的消息文本完全相同

#### Scenario: suggestion 规则

- **WHEN** 测试检查 36 条规则的 `meta`
- **THEN** 只有 `interactive-supports-focus` 声明 `meta.hasSuggestions: true`
- **AND** 没有任何规则声明 `meta.fixable`

### Requirement: 规则元数据现代化

每条规则 MUST 声明 `meta.type`，取值 MUST 为 `problem` 或 `suggestion`。`meta.docs.description` MUST 保持上游文本，且 MUST 以 `Enforce`、`Require` 或 `Disallow` 开头。`meta.docs.url` MUST 指向本仓库文档：

```text
https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/<rule-name>.md
```

#### Scenario: 检查 meta.type

- **WHEN** 测试遍历 36 条规则的 `meta.type`
- **THEN** 每条规则都存在 `meta.type` 且取值为 `problem` 或 `suggestion`

#### Scenario: 检查文档 URL 模式

- **WHEN** 测试遍历 36 条规则的 `meta.docs.url`
- **THEN** 每个 URL 都符合上述模式且包含对应规则名

#### Scenario: 检查文档描述前缀

- **WHEN** 测试遍历 36 条规则的 `meta.docs.description`
- **THEN** 每个描述都以 `Enforce`、`Require` 或 `Disallow` 开头

### Requirement: 插件设置语义与上游一致

插件 MUST 只读取 `settings['jsx-a11y']`，且 MUST 支持 `components`、`polymorphicPropName`、`polymorphicAllowList` 三个字段，行为 MUST 与上游 `settings['jsx-a11y-x']` 相同。插件 MUST NOT 读取 `settings['jsx-a11y-x']`。

#### Scenario: components 映射

- **WHEN** 使用方设置 `settings['jsx-a11y'].components` 为 `{ Foo: 'div' }` 并检查 `<Foo scope="x" />`
- **THEN** 规则按映射后的 `div` 报告

#### Scenario: polymorphicPropName 替换

- **WHEN** 使用方设置 `settings['jsx-a11y'].polymorphicPropName` 为 `as`
- **THEN** `<Foo as="button" />` 按 `button` 解析元素类型

#### Scenario: 旧 settings key 不生效

- **WHEN** 使用方只设置 `settings['jsx-a11y-x'].components`
- **THEN** 插件忽略该配置并按未映射的元素类型执行规则

### Requirement: TypeScript 源码与仓库代码约定

`src/`、`__test__/` 与  MUST 全部使用 TypeScript，MUST NOT 启用 `allowJs`，MUST NOT 存在 `.js` 源文件。规则模块 MUST 使用 `eslint` 自带类型（`Rule.RuleModule`、`Rule.RuleContext`）。

实现 MUST 复用 `@omnific/utils` 谓词（`isNil`、`hasValue`、`isString`、`isNumber`、`isBoolean`、`isFunction`、`isArray`、`isArrayEmpty`、`isPlainObject`）替换上游手写 `typeof` 与 `null` / `undefined` 比较，MUST NOT 新增同类手写判断。无法由现有谓词表达的场景（如 `aria-query` / `axobject-query` 联合类型收窄、运行时能力检测）MUST 在代码注释中说明原因。普通业务分支 MUST 使用语义正向谓词，`!` 只允许用于立即 `return`、`continue` 或 `throw` 的守卫分支。导出的方法与类型 MUST 带 TSDoc。

#### Scenario: 检查源码扩展名

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y`
- **THEN** `src/`、`__test__/` 下不存在 `.js` 文件
- **AND** `tsconfig.json` 未启用 `allowJs`

#### Scenario: 检查类型来源

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y/tsconfig.json` 与 `package.json`
- **THEN** 不存在 `@typescript-eslint/utils` 或 `@types/eslint`
- **AND** `@typescript-eslint/parser`、`@types/estree`、`@types/estree-jsx`、`@types/aria-query`、`@types/damerau-levenshtein`、`@types/language-tags`、`@types/picomatch` 声明在 `devDependencies`
- **AND** `dependencies` 中不存在任何 `@types/*`

#### Scenario: 检查工具链依赖不重复声明

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y/package.json` 的 `devDependencies`
- **THEN** 不存在 `eslint`、`tsdown`、`typescript`、`tsx`、`vitest`
- **AND** 存在 `@omnific/tsconfig`（`workspace:*`）

#### Scenario: JSX 节点类型增强已加载

- **WHEN** 维护者检查 `src/types/jsx-ast-utils-x.d.ts`
- **THEN** 该文件从 `'estree-jsx'` 导入 JSX 节点类型
- **AND** `pnpm typecheck` 下 `Rule.RuleListener` 的 `JSXAttribute` / `JSXOpeningElement` 选择器具有节点类型而不是 `never`

#### Scenario: 检查谓词复用

- **WHEN** 维护者检查 `src/util/` 与 `src/rules/`
- **THEN** 空值与类型判断使用 `@omnific/utils` 谓词
- **AND** 每处例外都带有说明原因的注释

#### Scenario: 类型检查通过

- **WHEN** 在仓库根目录运行 `pnpm typecheck`
- **THEN** 新包源码与测试文件类型检查通过

### Requirement: TypeScript 测试与用例覆盖

测试 MUST 全部位于 `__test__/` 且 MUST 使用 `vitest` 与 ESLint 自带 `RuleTester`，MUST NOT 引入 `@typescript-eslint/rule-tester`。测试 helper MUST 使用 ESLint 10 提供的 `RuleTester.describe`、`RuleTester.it`、`RuleTester.itOnly` 与 `RuleTester.setDefaultConfig` 接线，MUST NOT 依赖已在 ESLint 10 移除的 `RuleTester.afterAll`。每条规则 MUST 至少有 1 个 valid 与 1 个 invalid 用例，并 MUST 覆盖其选项 schema 与默认选项。每个用例 MUST 同时以默认 parser 与 `@typescript-eslint/parser` 运行。上游 `__tests__/src/rules/*.spec.js` 与 `__tests__/src/util/*.spec.js` 的行为断言 MUST 被等价迁移。根 `vitest.config.ts` MUST NOT 被修改。

#### Scenario: 运行测试

- **WHEN** 在仓库根目录运行 `CI=true pnpm test`
- **THEN** 新包全部测试通过
- **AND** 根 `vitest.config.ts` 未发生变更

#### Scenario: 双 parser 矩阵

- **WHEN** 维护者检查任一 `__test__/rules/*.test.ts`
- **THEN** 该用例同时覆盖默认 parser 与 `@typescript-eslint/parser`

#### Scenario: 互斥断言

- **WHEN** 维护者检查测试与 `package.json`
- **THEN** 不存在 `@typescript-eslint/rule-tester`、`@babel/eslint-parser` 或 `eslint-plugin-eslint-plugin`

### Requirement: 构建产物与导出映射

包 MUST 使用 `tsdown` 构建，MUST 以 `unbundle` 模式输出到 `dist/`，且 `dist/` MUST 镜像 `src/` 的目录结构。产物 MUST 为 ESM，相对导入 MUST 带显式 `.js` 扩展名。构建 MUST 输出 `.d.ts`，且 `package.json` 的 `exports` MUST 至少覆盖 `.`、`./rules/*`、`./util/*` 与 `./package.json`。构建 MUST NOT 依赖运行时读取 `package.json`。

#### Scenario: 构建产物可被 Node ESM 解析

- **WHEN** 运行 `pnpm --filter @omnific/eslint-plugin-jsx-a11y build` 并检查 `dist/index.js`
- **THEN** 文件存在，且其中的相对导入都带有显式 `.js` 扩展名

#### Scenario: 产物目录镜像源码

- **WHEN** 构建完成后检查 `dist/`
- **THEN** 存在 `rules/`、`util/`、`util/implicitRoles/` 与 `configs/`，且不存在 `src/` 前缀层级

#### Scenario: 导出可解析

- **WHEN** 在 Node 中按 `exports` 映射导入 `@omnific/eslint-plugin-jsx-a11y` 与 `@omnific/eslint-plugin-jsx-a11y/rules/alt-text`
- **THEN** 两次导入都成功并返回规则或插件对象

### Requirement: 性能实现约束

实现 MUST 避免上游热路径写法：常量表查找 MUST 使用模块级 `Set` 或 `Map`，MUST NOT 对常量数组使用 `indexOf` 或 `includes`；`getElementType(context)` MUST 在每次规则 `create` 中只构造一次，并在同一规则内复用；拼写建议 MUST 只在报告路径计算，MUST NOT 在 valid 路径产生额外分配；插件对象 MUST NOT 在运行时被变更。

#### Scenario: 常量表查找

- **WHEN** 维护者检查 `src/rules/` 与 `src/util/`
- **THEN** 常量集合以模块级 `Set` / `Map` 声明
- **AND** 不存在对常量数组调用 `indexOf` 或 `includes` 的查找

#### Scenario: elementType 复用

- **WHEN** 维护者检查任一规则 `create`
- **THEN** `getElementType(context)` 只在 `create` 中调用一次，监听器内复用其结果

#### Scenario: 建议计算时机

- **WHEN** 维护者检查 `src/util/getSuggestion.ts` 的调用点
- **THEN** 只在即将报告错误的路径调用

### Requirement: 文档、许可与目录边界

包 MUST 包含英文 `README.md`、36 份 `docs/rules/*.md`、`LICENSE`（MIT）、`src/`、`__test__/` 与 。`LICENSE` MUST 保留上游版权声明（`Copyright (c) 2024-present ES Community Tooling` 与 `Copyright (c) 2016-2024 Ethan Cohen`）并追加本仓库版权行。迁移后的源文件 MUST 保留上游 `@file` / `@author` 归属注释。`docs/rules/` 与 `README.md` 规则表 MUST 由测试校验与 `src/rules` 一致。

包内 MUST NOT 新增上游不存在的目录或文件，例如 `benchmark/`、`fixtures/`、`NOTICE.md` 与 `examples/`；MUST NOT 新增基准脚本或 fixture 工程。`__test__/` 与 `.test.ts` 是对齐本仓库既有测试惯例的命名（上游为 `__tests__/` 与 `.spec.js`）。上游仓库地址、commit、许可证与逐文件来源 MUST 记录在变更文档中。

#### Scenario: 文档覆盖

- **WHEN** 测试比对 `src/rules` 与 `docs/rules`
- **THEN** 每条规则都有同名文档文件
- **AND** `README.md` 规则表包含全部 36 条规则

#### Scenario: 归属信息完整

- **WHEN** 维护者检查 `LICENSE` 与变更文档
- **THEN** `LICENSE` 含上游两行版权声明与本仓库版权行
- **AND** 变更文档记录了上游仓库 `https://github.com/eslint-community/eslint-plugin-jsx-a11y-x`、commit `ec06126fa25b4cd10099eba84a88fc94d1a0da90`、MIT 许可证与来源文件路径

#### Scenario: 不新增上游不存在的结构

- **WHEN** 维护者检查 `packages/eslint-plugin-jsx-a11y`
- **THEN** 不存在 `benchmark/`、`fixtures/`、`NOTICE.md` 或 `examples/`
- **AND** 不存在基准脚本或 fixture 工程

#### Scenario: 不引入文档生成器

- **WHEN** 维护者检查 `package.json`
- **THEN** 不存在 `eslint-doc-generator`
