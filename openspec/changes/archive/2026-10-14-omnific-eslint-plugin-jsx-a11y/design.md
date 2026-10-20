# 设计：仓库内 TypeScript 版 jsx-a11y ESLint 插件

## 背景

上游 `eslint-plugin-jsx-a11y-x@0.2.0` 提供 36 条 JSX 可访问性规则、两条 flat config（`recommended`、`strict`）和 `settings['jsx-a11y-x']` 组件映射。本仓库只想替换实现与依赖构成，不想改变规则行为、规则集合和配置语义。

本设计说明如何在不改变可观察行为的前提下，把实现换成符合仓库规范的 TypeScript 包，并说明依赖、构建、测试和文档上的取舍。

## 参考版本

- 仓库：`https://github.com/eslint-community/eslint-plugin-jsx-a11y-x`
- commit：`ec06126fa25b4cd10099eba84a88fc94d1a0da90`
- 许可证：MIT
- 规则实现：`src/rules/*.js`
- 共享工具：`src/util/*.js`、`src/util/*.ts`、`src/util/implicitRoles/*`
- 插件入口：`src/index.js`
- flat config 基线：`src/configs/flat-config-base.ts`
- 用例：`__tests__/src/rules/*.spec.js`、`__tests__/src/util/*.spec.js`、`__tests__/index.spec.js`
- 文档：`docs/rules/*.md`、`README.md`
- 构建与检查：`tsconfig.json`、`package.json`、`eslint.config.mjs`、`vitest.config.js`

上述源码用于确认行为、命名与结构；迁移的是行为契约，不是逐行翻译，且必须保留 MIT 归属信息。

## 目标

- 新增 `@omnific/eslint-plugin-jsx-a11y`，源码、测试、脚本全部使用 TypeScript。
- 保持 36 条规则的名称、选项 schema、默认选项、消息文本和报告位置与上游一致。
- 保持 `configs.recommended`、`configs.strict` 的规则集合、级别与选项一致。
- 使用仓库现有工具链：`tsdown` 构建、`vitest` 测试、`@omnific/tsconfig` 类型基线、`@omnific/utils` 谓词、Changesets 发布。
- 运行时依赖比上游更少更小，且每个保留依赖都有明确用途与保留理由。

## 非目标

- 不新增规则，不修改规则语义，不引入 fixer。
- 不实现 ESLint 8 / `.eslintrc` legacy 配置支持。
- 不实现 `jsx-a11y-x` 命名空间、settings key 或包名的兼容层。
- 不迁移上游 `examples/` 工程与 `eslint-doc-generator` 文档流水线。
- 不引入 `@typescript-eslint/rule-tester` 或 `eslint-plugin-eslint-plugin`。
- 不做规则文档站点、Playground 或 benchmark 流水线。
- 不新增上游不存在的目录或文件（`benchmark/`、`fixtures/`、`NOTICE.md`、`examples/` 等），也不新增基准脚本或 fixture 工程。

## 关键决策

### 1. 包位置、包名与规则命名空间

新增 `packages/eslint-plugin-jsx-a11y`，包名 `@omnific/eslint-plugin-jsx-a11y`，初始版本 `0.1.0`，`type: module`，MIT，`engines` 与 `@omnific/eslint-config-react` 一致（`^22.13.0 || >=24.0.0`），`peerDependencies.eslint` 与 `@omnific/eslint-config` 一致（`^10.4.0`）。

规则命名空间使用 `jsx-a11y`：

```js
// packages/eslint-config-react/index.js
plugins: { 'jsx-a11y': jsxA11y },
rules: { 'jsx-a11y/alt-text': 'error' },
```

未采用 ESLint 对 scoped 包的默认推导名 `@omnific/jsx-a11y`，因为规则 id 会变长且与上游文档对照困难；未保留 `jsx-a11y-x`，因为本包不是上游的延续，保留旧命名会掩盖迁移。

`settings` key 同样使用 `jsx-a11y`，只读取这一个 key。

### 2. 目录结构对齐上游

目标结构：

```text
packages/eslint-plugin-jsx-a11y/
  src/
    index.ts
    configs/
      flat-config-base.ts
    rules/
      alt-text.ts
      ...
      tabindex-no-positive.ts
    util/
      getElementType.ts
      getExplicitRole.ts
      getImplicitRole.ts
      getSuggestion.ts
      getTabIndex.ts
      hasAccessibleChild.ts
      getAccessibleChildText.ts
      getComputedRole.ts
      attributesComparator.ts
      isAbstractRole.ts
      isContentEditable.ts
      isDOMElement.ts
      isDisabledElement.ts
      isFocusable.ts
      isHiddenFromScreenReader.ts
      isInteractiveElement.ts
      isInteractiveRole.ts
      isNonInteractiveElement.ts
      isNonInteractiveRole.ts
      isNonLiteralProperty.ts
      isPresentationRole.ts
      isSemanticRoleElement.ts
      mayContainChildComponent.ts
      mayHaveAccessibleLabel.ts
      schemas.ts
      autocomplete/
        index.ts
        tokens.ts
      implicitRoles/
        index.ts
        a.ts
        area.ts
        article.ts
        aside.ts
        body.ts
        button.ts
        datalist.ts
        details.ts
        dialog.ts
        form.ts
        h1.ts ... h6.ts
        hr.ts
        img.ts
        input.ts
        li.ts
        link.ts
        menu.ts
        menuitem.ts
        meter.ts
        nav.ts
        ol.ts
        option.ts
        output.ts
        progress.ts
        section.ts
        select.ts
        tbody.ts
        textarea.ts
        tfoot.ts
        thead.ts
        ul.ts
  __test__/
    rules/*.test.ts
    util/*.test.ts
    plugin.test.ts
    docs.test.ts
    parity/*.test.ts
    parity/*-parity.ts
    utils/ruleTester.ts
    utils/parsers.ts
    utils/parserOptionsMapper.ts
  docs/rules/*.md
  scripts/
    create-rule.ts
    boilerplate/
  package.json
  tsconfig.json
  tsdown.config.mts
  README.md
  LICENSE
```

`src/util/autocomplete/` 是本设计新增的目录，用于承载 `autocomplete-valid` 的本地实现（见决策 7）。其余目录与文件与上游一一对应。

包内 MUST NOT 新增上游不存在的目录或文件（例如 `benchmark/`、`fixtures/`、`NOTICE.md`、`examples/`）。`__test__/` 与 `.test.ts` 是对齐仓库既有测试惯例的命名（上游为 `__tests__/` 与 `.spec.js`）。

### 3. 插件对象与配置

`src/index.ts` 的默认导出一个不可变插件对象：

- `meta.name`、`meta.version` 与 `package.json` 一致，且不在运行时读取 `package.json`。
- `rules` 为 36 条规则的对象字面量，不使用运行时 `Object.assign` 二次赋值。
- `configs.recommended`、`configs.strict` 通过内部 `createConfig` 生成，`name` 为 `jsx-a11y/recommended` 与 `jsx-a11y/strict`。
- `configs.*.plugins['jsx-a11y']` 与默认导出引用相等（沿用上游 `__tests__/index.spec.js` 的断言）。
- 插件对象整体 `Object.freeze`，避免 flat config 场景下的意外 mutation。

命名导出 `rules`、`configs` 与类型 `RuleName`、`JsxA11ySettings`，供文档一致性与设置类型测试消费。

### 4. TypeScript 写法与 @omnific/utils 复用

- 规则模块使用 `eslint` 自带类型：`import type { Rule } from 'eslint'`，规则导出类型为 `Rule.RuleModule`，`create(context: Rule.RuleContext)`。
- 复用一个按 context 缓存的 `getElementType(context)`，每个规则 `create` 内只构造一次。
- 复用 `@omnific/utils` 谓词替换上游手写判断：`isNil`、`hasValue`、`isString`、`isNumber`、`isBoolean`、`isFunction`、`isArray`、`isArrayEmpty`、`isPlainObject`；上游 21 处 `typeof` 与 35 处 `null` / `undefined` 比较必须收敛为谓词调用。
- 例外场景需要在代码注释中说明原因：`implicitRoles` 返回 `string | null` 且需要与 `aria-query` 类型对齐的守卫、`aria-query` / `axobject-query` 数据集合的运行时能力检测、以及无法由现有谓词表达的联合类型收窄。
- 普通业务分支使用语义正向谓词；`!` 只用于立即 `return` / `continue` / `throw` 的守卫分支。
- 导出的方法与类型都带 TSDoc。

### 5. 规则元数据现代化

- 每条规则声明 `meta.type`（`problem` / `suggestion`），取值与上游 `eslint-plugin-jsx-a11y` 的分类一致。
- 每条规则把消息迁移到 `meta.messages` 并使用 `messageId`；消息文本与上游逐字一致，保证 lint 输出不变。
- `meta.docs.description` 保持上游文本；`meta.docs.url` 改为指向本仓库文档：

```text
https://github.com/monhan-97/omnific/tree/HEAD/packages/eslint-plugin-jsx-a11y/docs/rules/<rule-name>.md
```

- 只有实际报告 suggestion 的规则（`interactive-supports-focus`）声明 `meta.hasSuggestions: true`；没有任何规则提供 fixer，不声明 `meta.fixable`。
- 由测试保证：36 条规则都有 `meta.type`、`meta.docs.url` 符合上述模式、每个 `messageId` 都有对应 `meta.messages` 条目。

### 6. 构建与产物

`tsdown.config.mts` 沿用仓库其它 package 的形态：

```ts
export default defineConfig({
  entry: [
    'src/index.ts',
    'src/configs/*.ts',
    'src/rules/*.ts',
    'src/util/*.ts',
    'src/util/autocomplete/*.ts',
    'src/util/implicitRoles/*.ts',
  ],
  root: 'src',
  outDir: 'dist',
  platform: 'node',
  unbundle: true,
  fixedExtension: false,
  dts: true,
  sourcemap: false,
  clean: true,
  exports: false,
  attw: false,
  publint: false,
});
```

- `unbundle: true` + `root: 'src'` 让 `dist/` 镜像 `src/` 目录，与上游 `lib/` 布局一致，并让堆栈信息保持可读。
- 源码使用无扩展名的相对导入，由 tsdown 输出为显式 `./xxx.js`，与 `@omnific/utils`、`@omnific/atelier` 的既有产物一致。
- `package.json` 声明 `sideEffects: false`、`files: ["dist", "docs", "README.md", "LICENSE"]`，导出映射：

```json
{
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "default": "./dist/index.js" },
  "./rules/*": { "types": "./dist/rules/*.d.ts", "import": "./dist/rules/*.js", "default": "./dist/rules/*.js" },
  "./util/*": { "types": "./dist/util/*.d.ts", "import": "./dist/util/*.js", "default": "./dist/util/*.js" },
  "./package.json": "./package.json"
}
```

- `meta.version` 采用构建期常量注入（`define`）或在构建时内联的 JSON 导入；两种做法都不得在运行时报读文件。

### 7. 依赖替换

| 依赖 | 上游用途 | 结论 | 依据 |
| --- | --- | --- | --- |
| `aria-query` | `dom`、`roles`、`elementRoles`、`aria` 数据查询 | 保留 | W3C 规格数据的事实标准，零依赖，unpacked 176 KB |
| `axobject-query` | `isInteractiveElement` / `isNonInteractiveElement` / `isSemanticRoleElement` 判定 | 保留 | 同上的 AXObject 数据，零依赖，unpacked 111 KB |
| `jsx-ast-utils-x` | 全部规则的 JSX AST 取值 | 保留 | 已是 `jsx-ast-utils` 的现代化 fork，零依赖，unpacked 71 KB |
| `damerau-levenshtein` | `getSuggestion` 拼写建议 | 保留 | 零依赖，unpacked 11.8 KB，`fastest-levenshtein` 体积更大且不支持转置距离 |
| `language-tags` | `lang` 规则校验 IANA 子标签 | 保留 | 语义依赖 IANA 注册表；`Intl.Locale` 与 `bcp-47` 语义不等价，见下文 |
| `minimatch` | 3 处组件名 glob 匹配 | 替换为 `picomatch` | `picomatch@4` unpacked 93.8 KB 且零依赖，替代 536 KB + 85 KB + 17.6 KB |
| `axe-core` | 仅 `autocomplete-valid` 的 `runVirtualRule` | 移除运行时依赖 | unpacked 3.43 MB，单规则用途；改为本地实现 + 对照数据校验 |

`language-tags` 保留依据（同一批样本下 `tags.check` 与 `Intl.Locale` 结论不同）：

```text
"zz"           tags.check=false  Intl.Locale=ok
"qaa"          tags.check=false  Intl.Locale=ok
"abc-123"      tags.check=false  Intl.Locale=ok
"x-private"    tags.check=false  Intl.Locale=throw
"en-GB-oed"    tags.check=false  Intl.Locale=throw
```

`Intl.Locale` 只做语法校验，不做 IANA 注册表成员校验，替换会改变 `lang` 规则的报告行为，因此不采用。

`autocomplete-valid` 的本地实现按 WHATWG HTML Standard 的 autofill 语法与 token 表实现，只依赖仓库内代码，不复制 `axe-core`（MPL-2.0）源码。正确性通过两层验证：

1. 实现阶段以 `eslint-plugin-jsx-a11y-x` 与 `axe-core` 作为临时 oracle，对全量 token × `type` 组合与畸形字符串语料生成 expected 结果，写入 `__test__/parity/autocomplete-parity.ts`（TS 数据模块，不新增 `fixtures/` 目录）。
2. 常规测试对该数据模块全量比对；若本地实现与 expected 出现任何不一致，则回退为把 `axe-core` 作为运行时依赖并记录该回退结论。

oracle 与临时类型垫片用完后，`axe-core`、`minimatch`、`eslint-plugin-jsx-a11y-x` 都不得留在任何 `package.json` 与 `pnpm-lock.yaml` 中。

### 8. 测试基建

- `__test__/utils/ruleTester.ts` 封装 `RuleTester`：把 `afterAll` / `it` / `itOnly` / `describe` 接到 vitest，并注入 `languageOptions`（`ecmaVersion: 'latest'`、`sourceType: 'module'`、`parserOptions.ecmaFeatures.jsx`）。
- 每条用例跑两遍：默认 parser（espree）与 `@typescript-eslint/parser`；不迁移上游的 `@babel/eslint-parser` 分支，避免引入 Babel 依赖树。
- 每个用例在代码后追加注释说明当前 parser 与选项，保留上游 `parsers.all` 的可读性收益，但不使用上游 `__mocks__` 手搓 AST 的写法。
- 不修改根 `vitest.config.ts`：测试文件通过显式 import 引入 helper，避免给其他 package 的测试引入 `eslint` 加载成本。

### 9. 文档与许可

- `README.md`（英文）说明安装、flat config 用法、`recommended` / `strict`、settings、规则表与迁移说明。
- `docs/rules/*.md`（英文）逐条迁移上游文档，更新规则 id 前缀与 `meta.docs.url`。
- 不引入 `eslint-doc-generator`（16 个直接依赖）。改用 `__test__/docs.test.ts` 做一致性检查：`src/rules` 与 `docs/rules` 一一对应、README 规则表覆盖全部规则、`recommended` / `strict` 标记与配置一致。
- `LICENSE` 保留上游两行版权声明并追加本仓库版权行；上游仓库、commit `ec06126fa25b4cd10099eba84a88fc94d1a0da90`、MIT 许可证、逐文件来源与 `axe-core@4.14.0` 仅作为实现阶段 oracle 的说明记录在变更文档中。
- 保留上游 `@file` / `@author` 归属注释。

### 10. 与 AGENTS 的取舍

- 仓库要求样式拆分、barrel 禁止等规则与本包无关；本包不新增 barrel，`src/util/implicitRoles/index.ts` 是上游既有的数据聚合入口，保留其职责。
- 仓库要求复用 `@omnific/utils`：本包把该包加入运行时依赖，`@omnific/utils` 为 `workspace:*` 且 `sideEffects: false`，在 unbundle 产物中按文件引入。
- 仓库要求「不要自己造方法」：`autocomplete-valid` 的本地实现是为满足体积与依赖目标而产生的唯一自研逻辑，且必须由对照数据与保留依赖的低收益证据支撑，详见决策 7。

## 备选方案

### 方案 A：直接内联上游源码，只改构建配置

保持上游 JS/TS 混写，仅把它 vendor 到仓库内。改动最小，但仍保留 `allowJs`、手写 `typeof`、`axe-core`、`minimatch` 与全部上游依赖，不满足现代化、依赖更少、体积更小的要求，因此否决。

### 方案 B：保留 `jsx-a11y-x` 命名空间与 settings key

消费者零改动，`@omnific/eslint-config-react` 只需换依赖。但会让仓库长期维护一个并非自己名义的命名空间，且与「无兼容别名」的仓库规则冲突，因此否决。

### 方案 C：只包装上游包，不改实现

新增包 re-export 上游插件并覆盖部分规则。改动最小，但依赖与体积问题原样保留，也违反仓库禁止转发导出的规则，因此否决。

### 方案 D：保留 `axe-core` 作为运行时依赖

`autocomplete-valid` 直接调用 `runVirtualRule`。行为兼容风险最低，但保留 3.43 MB 运行时依赖，与体积目标冲突，因此否决；作为决策 7 中失败时的回退方案保留。

### 方案 E：使用 `@typescript-eslint/rule-tester`

类型化 RuleTester，但需要新增依赖树（含 `ajv`、`lodash.merge`、`semver` 等），而 ESLint 自带 `RuleTester` 已能满足需求，因此不采用。

### 方案 F：用 `eslint-doc-generator` 维护文档

与上游一致，可自动生成规则表，但需要 16 个直接依赖；文档为静态文件即可，改用仓库内一致性测试，因此不采用。

## 风险与处理

- 规则行为漂移：以对照数据全量比对 + 上游用例等价迁移 + 36 条规则逐个 valid / invalid 覆盖控制；消息文本逐字比对。
- `autocomplete-valid` 本地实现不完整：以 token × `type` 全矩阵对照数据与畸形字符串语料校验，不一致时回退方案 D。
- `picomatch` 与 `minimatch` 语义差异（brace expansion、extglob、大小写）：对 3 个使用点补充等价用例，差异无法消除时保留 `minimatch` 并在报告中记录否决。
- 体积/耗时门槛未达标：按 `dependency-footprint` 既有要求记录否决结果并保留原实现，不强行替换。
- 消费方迁移遗漏：`@omnific/eslint-config-react` 的规则 id 全部替换，并在 README 与 CHANGELOG 记录 BREAKING。
- 上游归属信息遗漏：`LICENSE` 上游版权声明与文件头归属注释纳入验收清单。

## 测试策略

- 单元与用例测试：`__test__/rules/*.test.ts`、`__test__/util/*.test.ts`。
- 契约测试：`__test__/plugin.test.ts`（rules 清单、configs 引用相等、`meta` 与 `package.json` 一致、`meta.type` 与 `meta.docs.url`）。
- 文档测试：`__test__/docs.test.ts`。
- 兼容对照测试：`__test__/parity/*.test.ts` + `__test__/parity/*-parity.ts`。
- 消费方测试：`packages/eslint-config-react` 的配置规则 id 全部可在新插件 `rules` 中找到。
- 命令：`pnpm --filter @omnific/eslint-plugin-jsx-a11y typecheck`、`pnpm --filter @omnific/eslint-plugin-jsx-a11y build`、`CI=true pnpm test`、`pnpm typecheck`、`pnpm lint:fix`、`CI=true pnpm build`、`graphify update .`。

## 迁移方式

1. 抓取上游源码快照与对照数据，记录体积与耗时基线。
2. 建立包骨架与构建、测试基建。
3. 迁移 `util/`、`implicitRoles/`、36 条规则、`configs`、`index.ts`。
4. 提交文档、许可与一致性测试。
5. 迁移 `@omnific/eslint-config-react` 并更新其 README / CHANGELOG。
6. 生成 `footprint-report.md`，确认替换前后体积与耗时门槛，删除临时 oracle。
7. 添加 Changeset 并按仓库发布流程发布新包与配置包。
