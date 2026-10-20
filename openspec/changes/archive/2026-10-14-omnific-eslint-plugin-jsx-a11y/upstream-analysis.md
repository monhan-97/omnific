# 上游 `eslint-plugin-jsx-a11y-x` 深度分析

## 分析对象

- 仓库：`https://github.com/eslint-community/eslint-plugin-jsx-a11y-x`
- commit：`ec06126fa25b4cd10099eba84a88fc94d1a0da90`
- 发布时间：2026-10-06
- 版本：`0.2.0`
- 许可证：MIT（`LICENSE`，1121 字节）
- 说明：`package.json` 中 `repository` 仍指向 `es-tooling/eslint-plugin-jsx-a11y-x`，仓库已迁移到 `eslint-community` 组织。

分析方式：从 `main` 抓取源码 tarball，本地统计目录、行数、依赖调用点，并读取已发布到本仓库 `node_modules` 的 `eslint-plugin-jsx-a11y-x@0.2.0` 产物交叉验证。

## 目录结构

```text
eslint-plugin-jsx-a11y-x/
  src/
    index.js                      # 插件入口：rules 表、recommended、strict、createConfig
    configs/
      flat-config-base.ts         # languageOptions.parserOptions.ecmaFeatures.jsx
    rules/                        # 36 条规则（34 个 .js、2 个 .ts）
    util/                         # 25 个工具（.js 与 .ts 混写）
    util/implicitRoles/           # 36 个隐式 role 映射（.js 与 .ts 混写）
  __tests__/
    setup.js                      # 把 vitest 的 it/describe/afterAll 挂到 ESLint RuleTester
    index.spec.js                 # rules 表、configs、schema、引用相等
    src/rules/*.spec.js           # 36 条规则用例
    src/util/*.spec.js            # 工具用例
    __util__/                     # parsers、parserOptionsMapper、ruleOptionsMapperFactory、axeMapping
  __mocks__/                      # 8 个手搓 AST 节点 mock
  docs/rules/*.md                 # 36 份规则文档
  examples/                       # flat-cjs、flat-esm、legacy 三个示例工程
  scripts/                        # create-rule.cjs、addRuleToIndex.js、boilerplate/
  package.json
  tsconfig.json
  eslint.config.mjs
  vitest.config.js
```

规模统计：

| 项目 | 数量 |
| --- | --- |
| 规则文件 | 36 |
| 隐式 role 文件 | 36 |
| 共享工具文件 | 25 |
| 测试文件 | 69 |
| 规则文档 | 36（2695 行） |
| `src` 行数 | 5170 |
| `__tests__` + `__mocks__` 行数 | 10997 |
| `.js` 源文件 | 66 |
| `.ts` 源文件 | 33 |

## 规则清单（36 条）

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

规则元数据现状：

| 指标 | 现状 |
| --- | --- |
| 声明 `meta.type` 的规则 | 0 |
| 使用 `meta.messages` / `messageId` 的规则 | 1（`interactive-supports-focus`） |
| 声明 `meta.hasSuggestions` 的规则 | 1（`interactive-supports-focus`） |
| 提供 fixer（`fix:`）的规则 | 0 |
| 声明 `meta.schema[0]` 的规则 | 18 |
| 使用 `defaultOptions` 的规则 | 21 |
| `meta.docs.url` 指向 `es-tooling/eslint-plugin-jsx-a11y-x/tree/HEAD` 的规则 | 36 |

## 插件入口与配置

- `src/index.js` 用 `createRequire(import.meta.url)` 读取 `../package.json` 得到 `{ name, version }`，写入 `meta`。
- `allRules` 为 36 条规则的对象字面量；`recommendedRules` 与 `strictRules` 为按规则 id 前缀 `jsx-a11y-x/` 书写的规则集合。
- `createConfig(rules, name)` 生成 `{ ...flatConfigBase, name: 'jsx-a11y-x/<name>', plugins: { 'jsx-a11y-x': jsxA11y }, rules }`。
- 最后通过 `Object.assign(jsxA11y, { configs })` 把 `configs` 挂到插件对象上。
- `flat-config-base.ts` 只设置 `languageOptions.parserOptions.ecmaFeatures.jsx: true`。
- 上游 `__tests__/index.spec.js` 断言：`rules` 与 `src/rules` 目录一一对应、`configs.recommended` 存在、每个 `schema[0].type === 'object'`、`configs.*.plugins['jsx-a11y-x']` 与默认导出引用相等。

## settings 语义

上游只读取一个 settings key：`settings['jsx-a11y-x']`。

| 字段 | 语义 |
| --- | --- |
| `components` | 组件名到 DOM 元素名的映射，命中后返回值，否则原样返回 |
| `polymorphicPropName` | 用于解析多态组件的 prop 名，取字面量值替换元素名 |
| `polymorphicAllowList` | 允许应用 `polymorphicPropName` 的原始元素名列表 |

解析逻辑集中在 `src/util/getElementType.js`，其余规则一律通过 `getElementType(context)` 间接读取。

## 依赖调用点

| 依赖 | 调用点 | 用途 |
| --- | --- | --- |
| `jsx-ast-utils-x` | 55 个源文件 | JSX AST 取值（`getProp`、`getLiteralPropValue`、`elementType`、`propName`） |
| `aria-query` | 51 个源文件 | `dom`、`roles`、`elementRoles`、`aria` 数据查询 |
| `axobject-query` | 3 个工具 | `isInteractiveElement`、`isNonInteractiveElement`、`isSemanticRoleElement` |
| `minimatch` | 3 个文件 | `label-has-associated-control`、`mayContainChildComponent`、`mayHaveAccessibleLabel` 的组件名 glob |
| `language-tags` | `lang` | `tags.check(value)` 校验 IANA 语言标签 |
| `damerau-levenshtein` | `getSuggestion` | 拼写建议的编辑距离（含转置） |
| `axe-core` | `autocomplete-valid` | `runVirtualRule('autocomplete-valid', ...)` 判定 `autocomplete` 取值是否合法 |

依赖体积（npm `dist.unpackedSize`）：

| 依赖 | unpacked | 直接依赖 |
| --- | --- | --- |
| `axe-core@4.14.0` | 3 430 531 B | 0 |
| `aria-query@5.3.2` | 176 114 B | 0 |
| `axobject-query@4.1.0` | 110 878 B | 0 |
| `jsx-ast-utils-x@0.1.0` | 71 379 B | 0 |
| `minimatch@10.2.6` | 536 122 B | `brace-expansion`（84 997 B）→ `balanced-match`（17 584 B） |
| `language-tags@1.0.9` | 32 047 B | `language-subtag-registry@0.3.23`（1 544 744 B） |
| `damerau-levenshtein@1.0.8` | 11 813 B | 0 |

上游运行时依赖合计约 6.02 MB（unpacked），其中 `axe-core` 与 `minimatch` 族约占 4.07 MB，却只服务 4 个调用点。

## 测试基建

- `__tests__/setup.js` 把 `RuleTester.afterAll / it / itOnly / describe` 指向 `vitest` 对应 API，然后各 spec 使用 `new RuleTester()`。
- `__tests__/__util__/helpers/parsers.js` 的 `parsers.all()` 把每个用例复制三份：默认 parser、`@babel/eslint-parser`（含 `@babel/preset-react` 与 3 个 syntax 插件）、`@typescript-eslint/parser`；为了在失败信息中区分 parser，会给 `code`、`output`、suggestion 输出追加注释。
- `parserOptionsMapper` 同时兼容 ESLint 8 legacy 与 ESLint 9+ flat 配置形态。
- `__mocks__/` 提供 8 个手搓 AST 节点 mock，用于直接测试 `util`，与真实 parser 输出可能漂移。

## 构建与工具链

- `tsconfig.json`：`module: nodenext`、`target: esnext`、`allowJs: true`、`declaration: true`、`noUncheckedIndexedAccess: true`、`exactOptionalPropertyTypes: true`、`rootDir: src`、`outDir: lib`。
- `pnpm build` 直接执行 `tsc`，产物是混合 `lib/*.js` 与 `lib/*.d.ts`，没有 bundle、没有 sourcemap 配置、没有 exports 映射验证。
- `pnpm lint` = `eslint` + `eslint-doc-generator --check`；`eslint.config.mjs` 使用 `eslint-plugin-eslint-plugin` 校验 `meta.docs.description` 前缀与 `meta.docs.url` 模式，并显式关闭 `require-meta-type` 与 `prefer-message-ids`。
- `pnpm tests-only` = `vitest run --coverage`；覆盖率依赖 `@vitest/coverage-v8`。
- 发布链：`changeset` + `clean-pkg-json`；`prepublishOnly` 执行 lint 与测试。
- 开发依赖包含 `@babel/eslint-parser`、`@babel/*` syntax 插件、`jscodeshift`、`minimist`、`semver`、`to-ast` 等，与本仓库工具链不重合。

## 对本次重写有影响的观察

1. 规则逻辑本身是纯 AST 静态分析，不依赖 React 运行时、DOM 或构建期产物，因此可以整体迁移到 TS，且无需改变规则语义。
2. 唯一真正的外部能力依赖是 `autocomplete-valid`（`axe-core`）与 `lang`（`language-tags`）；前者可本地实现并用对照数据校验，后者语义必须保留。
3. `settings` 只有 3 个字段，是插件对外最小可用契约，必须在迁移中保持行为一致。
4. `Object.assign` 挂载 `configs` 与 `createRequire` 读取版本号是最容易被现代化改写、且不改变可观察行为的两处实现细节。
5. 上游用例是本变更最重要的行为基线：规则用例数量大、覆盖细，必须等价迁移而不是重写期望值。
6. `meta.type` 缺失、`messageId` 未使用、`prefer-message-ids` 被关闭，说明上游有意保持在 `eslint-plugin-jsx-a11y` 的旧形态；本仓库重写时补全这些元数据只会影响 `meta` 断言，不影响报告文本。
7. `allowJs` + 混写 `.js` / `.ts` 是上游无法使用 `strictTypeChecked` 全量约束的原因；本仓库重写后 `src` 必须全部为 `.ts`，并纳入根 `tsconfig.json` 的 `pnpm typecheck`。
