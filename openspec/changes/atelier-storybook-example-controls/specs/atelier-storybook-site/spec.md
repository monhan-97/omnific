## MODIFIED Requirements

### Requirement: 分离 story 注册与示例实现

Atelier MUST 严格参考 Chakra UI 的 `packages/react/__stories__/*.stories.tsx` 与 `apps/compositions/src/examples` 分离模式，在 `packages/atelier/__stories__` 集中维护 story 注册文件，并 MUST 在对应组件目录内维护 `examples` 示例实现。story 注册文件 MUST 定义分组、装饰器、`component`，以及稳定英文命名的 `StoryObj`；每个 curated story 的 `render` MUST 只引用对应 example 组件，MUST NOT 在注册文件中编写 Button 业务 JSX。每个 curated demo 的稳定英文导出 MUST 对应 `examples` 下的独立示例源码文件。简体中文显示名称、简体中文描述和 `coverageNotes` MUST 写在 `__stories__/*.stories.tsx` 的 story 对象字面量中，以保证 Storybook CSF 静态分析能显示中文名称。示例实现 MUST 从 `@omnific/atelier`、`@omnific/atelier/styles.css` 或其他 workspace package 的公开入口消费代码，不得导入 Atelier 私有模块。

#### Scenario: 注册 Button stories

- **WHEN** Storybook 加载 `button.stories.tsx`
- **THEN** navigation 在 `Components / Button` 下显示稳定英文导出对应的 stories，每个 curated story 的 `render` 来自独立 example 组件，且注册文件不包含 Button 业务 JSX

#### Scenario: 查看中文 story 描述

- **WHEN** 使用者在 Storybook 中浏览 Button stories
- **THEN** 每个 curated story 的侧栏显示名称和描述使用简体中文，命名导出继续使用稳定英文标识

#### Scenario: 检查 demo 与 example 一对一

- **WHEN** 维护者新增或审查某个 curated Button demo
- **THEN** 存在与该稳定英文导出对应的独立 `examples/*.tsx` 实现文件，而不是仅在 stories 注册文件内联示例

#### Scenario: 检查示例消费路径

- **WHEN** 维护者检查 Button 示例的 imports
- **THEN** 示例通过 package 公开入口消费 Button 与图标，不引用 `packages/atelier/button/Button.tsx` 或其他私有文件

### Requirement: 使用 curated examples 展示组件状态

Storybook MUST 全局启用 Controls，并 MUST 关闭 Actions；MUST NOT 把 Autodocs 作为 Button 的主要文档。仓库 MUST 启用 `react-docgen-typescript`（含 `shouldExtractLiteralValuesFromEnum` 与过滤 `node_modules` 的 `propFilter`）。Button 公开 props 类型 MUST 使用 Docgen 可读的写法（例如 `interface extends ComponentPropsWithRef<'button'>`），MUST NOT 使用会阻断枚举推断的 `Override`/`Omit` 合并类型。单按钮 curated stories MUST 通过 `args` 与接收组件 props 的 example `render` 驱动 Controls；矩阵、多按钮或交互态 stories MAY 关闭 Controls。MUST NOT 为枚举单独维护与公开类型重复的 meta `argTypes`，除非 Docgen 仍无法推断。Button MUST 至少提供 `Basic`、`Sizes`、`Variants`、`Disabled`、`Loading`、`Icon`、`IconOnly` 和 `Block` stories，MUST NOT 再提供独立的 `WithControls` playground story。Button stories MUST 维护公开属性覆盖清单，并 MUST 覆盖代表性属性组合；未单独展示的组合 MUST 在 `coverageNotes` 中使用简体中文写明归并或排除原因。

#### Scenario: 浏览 Button 主要状态

- **WHEN** 使用者打开 `Components / Button`
- **THEN** 使用者可通过明确命名的 curated stories 浏览 Button 的默认、尺寸、视觉变体、danger 变体、禁用、加载、图标、纯图标和块级行为

#### Scenario: 在 curated story 中使用 Controls

- **WHEN** 使用者打开任一 Button curated story
- **THEN** Controls 面板可用，且 `variant` / `size` / `shape` 等枚举选项来自组件类型推断而非手写重复列表

#### Scenario: 检查 Button 属性组合覆盖

- **WHEN** 维护者新增、移除或修改 Button 公开属性
- **THEN** Button 的 story 覆盖清单同步更新，列出公开属性值域、代表性组合、覆盖位置，以及在 `coverageNotes` 中使用简体中文列出未单独展示组合的归并或排除原因

#### Scenario: 对齐 Button 判断逻辑

- **WHEN** 维护者依据 `packages/atelier/button/Button.tsx` 调整故事覆盖
- **THEN** 覆盖清单至少显式记录 `size`、`variant`、`shape`、`loading`、`disabled`、`block`、`icon` 和 `icon-only` 这几类判断分支，并说明 `loading` / `disabled` 会阻止点击、`danger` 是独立 variant、原生 `type` 只表示 HTML button type、`circle` 仅在纯图标场景中有可观察意义

#### Scenario: 归并或排除非代表性组合

- **WHEN** 某个 Button 属性组合与已有 story 的可观察行为等价、语义互斥、无法渲染或无法在 Storybook 中观察而不适合单独展示
- **THEN** 覆盖清单在 `coverageNotes` 中使用简体中文记录该组合归并到哪个代表性场景或记录排除原因，而不是静默遗漏
