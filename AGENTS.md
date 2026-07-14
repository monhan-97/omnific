## AGENTS.md 语言规则

- 根目录以及对应的 `AGENTS.md` 应优先使用中文编写或重新生成。
- `README.md` 应统一使用英文编写或重新生成。
- 命令、包名、路径、配置键、提交消息示例等技术标识需要保持准确时，可以保留英文原文。

## graphify

本项目在 `graphify-out/` 中维护了知识图谱，包含 god nodes、社区结构以及跨文件关系。

当用户输入 `/graphify` 时，先调用 `skill` 工具并传入 `skill: "graphify"`，然后再做任何其他事情。

规则：
- 对于代码库相关问题，如果 `graphify-out/graph.json` 存在，先运行 `graphify query "<question>"`。需要查看关系时使用 `graphify path "<A>" "<B>"`，需要聚焦某个概念时使用 `graphify explain "<concept>"`。这些命令会返回范围更小的子图，通常比直接阅读 `GRAPH_REPORT.md` 或原始 grep 输出更合适。
- hook 或增量更新后，`graphify-out/` 中出现脏文件是正常情况；图谱文件有未提交变更不是跳过 graphify 的理由。只有当任务本身是在处理过期或错误的图谱输出，或者用户明确要求不要使用 graphify 时，才跳过 graphify。
- 如果 `graphify-out/wiki/index.md` 存在，先使用它进行大范围导航，而不是直接浏览原始源码。
- 只有在做大范围架构审查，或者 `query`、`path`、`explain` 没有提供足够上下文时，才阅读 `graphify-out/GRAPH_REPORT.md`。
- 修改代码后，运行 `graphify update .` 以保持图谱最新（仅 AST，无 API 成本）。

## 验证

生成或修改代码后，在根目录运行：
- `pnpm typecheck`
- `pnpm lint:fix`

## 代码风格

- 项目代码应优先复用 `@omnific/utils` 已有工具方法，禁止重复手写同类判断逻辑。
- 禁止直接使用 `typeof` 判断值的类型；统一使用 `@omnific/utils` 提供的类型谓词。仅在工具库底层实现、运行时能力检测或无法由现有谓词表达的场景中例外，并应说明原因。
- `null` 和 `undefined` 的空值判断统一使用 `@omnific/utils` 中的 `isNil`、`hasValue` 或更具体的谓词，禁止手写 `value === null`、`value === undefined`、`value == null` 等判断。
- 普通业务分支应使用语义正向、与分支意图一致的谓词，避免通过逻辑非运算符 `!` 绕着表达条件。
- 守卫式条件允许使用 `!`，但该分支必须立即 `return`、`continue`、`break` 或 `throw`，用于提前结束当前执行路径。例如 `if (!isFunction(value)) return;`。进入主要业务逻辑的分支仍应保持正向表达。
- 禁止为了规避 `!` 而使用 `=== false`、`=== true`、`!== false` 或 `!== true` 比较布尔结果。应优先采用守卫式提前退出、交换 `if`/`else` 分支，或使用与目标分支语义一致的谓词。
- 导出的方法和类型都需要添加文档型注释，例如 JSDoc/TSDoc。

## 模块与导出

- 组件、函数和路径调整后，直接更新所有调用方，禁止为了兼容旧名称或旧路径保留别名导出、转发导出或兼容入口。
- 禁止新增仅用于维持历史导入方式的 barrel、wrapper 或 deprecated re-export；无实际使用方的旧入口应直接移除。

## 样式组织

- `components` 目录中的样式按职责拆分为“布局”和“主题”两份样式文件；布局文件负责结构、尺寸、间距与定位，主题文件负责颜色、字体、边框、阴影及交互状态等视觉表现。
- `components` 目录之外的样式统一使用 CSS Modules，文件名采用 `*.module.css`、`*.module.scss` 等对应形式，禁止新增全局样式导入。

## 发布

准备发布时：

- 发布前检查本地包版本是否已经存在于 npm。
- 使用 Changesets 进行版本升级和 changelog 生成。
- 只为有可发布变更的包添加发布说明。
- changelog 条目应聚焦功能变更、依赖影响或破坏性变更。
- 发布前运行验证：
  - `CI=true pnpm test`
  - `pnpm build`
- 先按包分别提交变更，再单独提交共享发布或工具链变更。
- 使用以下命令逐个发布已变更的包：
  - `pnpm publish --access public --no-git-checks`
- 如果 npm 需要认证，而非交互式 OTP 不可用，使用交互式浏览器或二维码流程。
- 使用以下命令确认已发布版本：
  - `pnpm view <package> version`

## 提交消息快捷方式

当用户输入 `/cm`、`cm` 或 `commit msg` 时，按以下方式处理：

> 根据当前已暂存的变更生成 Conventional Commit 消息，尽可能按包拆分提交，然后按包提交已暂存变更。不要 push。

规则：
- 检查 `git diff --cached` 和 `git diff --cached --stat`。
- 如果没有已暂存变更，检查 `git status --short`，并询问用户是要先暂存文件，还是要基于未暂存变更处理。
- 优先按 `packages/<name>/...` 对已暂存文件分组。当某个包有可发布变更或包内自有变更时，为该包创建一个提交。
- 根目录或共享文件，例如 `package.json`、`pnpm-lock.yaml`、`.changeset/*`、`AGENTS.md`、根配置文件以及跨包工具链变更，应放入单独的 shared/tooling 提交；除非它们明显只属于某一个包的变更。
- 提交前按将要创建的顺序返回推荐提交消息。
- 每个分组只提交该组对应的已暂存文件。不要包含未暂存变更。
- 优先使用英文 Conventional Commits，例如 `feat(request): add abort signal composition`。
- 使用目录名作为 package scope，例如 `feat(store): ...`、`fix(request): ...`、`chore(tsconfig): ...`，共享或仅根目录变更使用 `chore(repo): ...`。
- 只有在有助于说明选择时，才附上一句简短中文解释。
- 除非用户明确要求 push，否则不要运行 `git push`。
