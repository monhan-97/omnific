## Purpose

定义 `@omnific/atelier` 的 SCSS 源码组织、组件前缀管理、静态结构 token、运行时颜色消费与 CSS 构建发布约束，确保组件样式职责清晰、类名一致，并向消费方提供无需 Sass 的编译产物。

## Requirements

### Requirement: 集中管理 SCSS 样式源码

`@omnific/atelier` MUST 将共享样式基础设施保存在 `packages/atelier/styles`，并将每个组件的样式源码保存在该组件目录下的 `styles` 子目录。每个有样式的组件 MUST 分别维护布局和主题 SCSS 文件，并通过同目录的 `index.scss` 合并；布局文件只负责结构、尺寸、间距与定位，主题文件只负责颜色、字体、边框、阴影和交互状态。

Box MUST 保持：

- `box/styles/layout.scss`
- `box/styles/index.scss`

Box MUST NOT 保留 `box/styles/theme.scss`，因为 Box 不维护主题样式。

Button 与 BaseButton MUST 保持：

- `button/styles/layout.scss`
- `button/styles/theme.scss`
- `button/styles/base-button.layout.scss`
- `button/styles/base-button.theme.scss`
- `button/styles/index.scss`

根 `styles` MUST 增加共享 `tokens/` 与 `utilities/` 目录，但 MUST NOT 保存单个组件的私有样式。组件 MUST NOT 新增 `packages/atelier/components` 目录。

#### Scenario: 导航 Box 与 Button 样式源码

- **WHEN** 维护者检查组件样式
- **THEN** Box 样式位于 `box/styles/layout.scss`，且不存在 `box/styles/theme.scss`
- **AND** Button 样式位于 `button/styles/layout.scss`、`button/styles/theme.scss` 与 `button/styles/base-button.*.scss`
- **AND** `packages/atelier/components` 不存在

#### Scenario: 构建单一 CSS 产物

- **WHEN** 维护者运行 Atelier build
- **THEN** `dist/styles.css` 包含 tokens、utilities、Box 和 Button layout / theme 规则
- **AND** 包含 `atelier-box` 与 `atelier-button` 小写 kebab-case 组件根 class

### Requirement: 语义 token 集中声明

颜色 token 的 TypeScript 事实源 MUST 继续为 `@omnific/atelier/system`。结构 scale 的公开值和 prop defs MUST 放在 `packages/atelier/props/*.props.ts`，并遵循 Radix 的 `margin.props.ts`、`padding.props.ts`、`width.props.ts`、`height.props.ts` 组织方式。静态结构 CSS 值 MUST 放在 `packages/atelier/styles/tokens/*.scss`，utility class MUST 放在 `packages/atelier/styles/utilities/*.scss`。

Atelier MUST NOT 新增或保留 `packages/atelier/styles/foundation.ts` 或 `packages/atelier/styles/_foundation.scss`。这些文件不是 Radix 结构的一部分，也不能作为 TS 值、class 后缀和 SCSS 值的事实源。组件 MUST 从共享 props 文件读取可接受值，MUST NOT 在组件目录复制 spacing、margin、sizing 或 shadow scale。

#### Scenario: 检查结构 scale 定义位置

- **WHEN** 维护者检查 `packages/atelier`
- **THEN** 存在 `props/padding.props.ts`、`props/margin.props.ts`、`props/width.props.ts`、`props/height.props.ts`
- **AND** 不存在 `styles/foundation.ts` 或 `styles/_foundation.scss`

#### Scenario: 检查 utility class 定义位置

- **WHEN** 维护者检查 `packages/atelier/styles`
- **THEN** 存在 `tokens/` 与 `utilities/` 目录
- **AND** 组件结构 utility class 不在组件目录内定义

### Requirement: 通过映射解析组件前缀

共享变量文件 MUST 定义 `$component-prefixes` 映射，共享函数文件 MUST 定义 `component-prefixes($component)`。组件样式 MUST 仅通过该函数获得组件类名前缀，不得直接读取映射或硬编码完整组件前缀。

#### Scenario: 编译已注册组件样式

- **WHEN** Button 样式调用 `component-prefixes(button)`
- **THEN** Sass 返回 `atelier-button`，编译产物中的 Button 选择器与 React 渲染类名一致

#### Scenario: 请求未注册组件前缀

- **WHEN** 样式调用 `component-prefixes()` 并传入 `$component-prefixes` 中不存在的组件
- **THEN** Sass 编译通过可识别的错误立即失败，不生成缺少命名空间的选择器

### Requirement: 集中声明 TypeScript 组件前缀

每个 Atelier 组件 MUST 在自身目录的 `constants.ts` 中集中声明 TypeScript 侧 CSS 类名前缀。组件主体及其内部子组件 MUST 复用该组件级常量，不得分别重复调用 `getPrefixCls()` 生成相同前缀。组件级前缀常量 MUST 保持为 package 内部实现，不得仅为复用而加入公共入口或通过组件属性传递。

#### Scenario: Button 内部复用类名前缀

- **WHEN** Button 及其内部 LoadingIcon 构建 CSS 类名
- **THEN** 两者均引用 `button/constants.ts` 导出的 `buttonPrefixCls`，且 Button 目录中只有该文件调用 `getPrefixCls('button')`

### Requirement: 使用浅层 SCSS 嵌套

组件 SCSS SHOULD 在组件根类下使用单层 `&` 嵌套表达 modifier、状态和伪类。复合选择器 MUST 在继续嵌套会降低可读性或改变优先级时保持独立，组件样式 MUST NOT 使用与 DOM 层级绑定的深层嵌套。

#### Scenario: 组织 Button 状态样式

- **WHEN** Button 为尺寸、视觉类型、加载状态或伪类声明样式
- **THEN** 同一根前缀的选择器通过单层 `&` 组织，编译后的选择器与嵌套前保持一致

### Requirement: 构建并发布 CSS 产物

Atelier build MUST 使用 package 自有的 Sass 编译依赖，将只负责聚合组件样式的 `styles/index.scss` 编译为单一 `dist/styles.css`。组件目录 MUST NOT 生成或维护 CSS 文件。package MUST 继续通过 `@omnific/atelier/styles.css` 发布编译结果，且消费方 MUST NOT 因导入该入口而需要安装 Sass。

#### Scenario: 构建 Atelier package

- **WHEN** 维护者运行 Atelier build
- **THEN** 构建成功生成包含 Button 布局与主题样式的单一 `dist/styles.css`，源码树只保留 `styles/index.scss` 和组件 SCSS

#### Scenario: 消费编译后的样式

- **WHEN** 应用导入 `@omnific/atelier/styles.css`
- **THEN** package resolver 返回已编译 CSS，而不是 SCSS 源码或需要额外预处理的入口

### Requirement: 组件颜色只依赖语义 token

Atelier 组件主题样式 MUST 使用语义颜色 token，例如 `--color-accent-*`、`--color-danger-*`、`--color-warning-*`、`--color-success-*`、`--color-info-*`。组件 MUST NOT 直接依赖具体色相 token，例如 `--color-blue-*`、`--color-red-*`。主题枚举与业务 system MUST 负责把具体颜色映射到语义 token。默认态、变体、禁用态和焦点态 MUST 直接引用共享语义颜色，MUST NOT 在组件内维护仅用于转发的颜色别名。

#### Scenario: Button 使用语义强调色

- **WHEN** 维护者检查 Button 主题样式
- **THEN** primary、outline、hover、active 和 focus 规则使用 `--color-accent-*`
- **AND** danger 规则使用 `--color-danger-*`
- **AND** 不存在 `--color-blue-*` 或 `--color-red-*`

#### Scenario: 切换强调色不修改组件

- **WHEN** 应用侧把 system 的 `accent-solid`、`accent-hover`、`accent-active` 从蓝色切换为其他品牌色
- **THEN** Button 继续使用相同 `--color-accent-*` 变量
- **AND** 无需修改 Button 源码或 class

### Requirement: 结构属性使用静态 class

组件的尺寸、间距、圆角、阴影和形状 MUST 使用静态 class 或静态 CSS 选择器实现。主题枚举和组件结构枚举 MUST NOT 通过 `createSystem` 返回值、`useTheme` 或新的颜色变量改变结构值。`Box` 的 `p`、`px`、`py`、`rounded`、`shadow` MUST 映射到 `box/styles` 中定义的静态 class；`bg`、`borderColor` 可以继续解析为 `--color-*` 引用。

#### Scenario: Button 尺寸使用静态 class

- **WHEN** 使用方传入 `size="large"` 或 `shape="round"`
- **THEN** 组件输出对应静态 class
- **AND** `createSystem` 返回对象的 `cssVars` 不发生变化

#### Scenario: Box 结构属性输出静态 class

- **WHEN** 使用方传入 `p={4}`、`rounded="md"` 或 `shadow="sm"`
- **THEN** Box 输出 `box/styles` 中定义的静态 class
- **AND** 不通过 `styleFromTokens` 写入 padding、border-radius 或 box-shadow 的 inline style

#### Scenario: Box 颜色属性继续使用颜色变量

- **WHEN** 使用方传入 `bg="bg-muted"` 或 `borderColor="accent-solid"`
- **THEN** Box 输出对应的 `var(--color-bg-muted)` 或 `var(--color-accent-solid)`
- **AND** 这些颜色变量由 `useTheme` 注入

### Requirement: 主题边界不引入 Theme 组件

Atelier MUST 继续使用 `useTheme(system)` 作为主题注入入口，MUST NOT 新增 `Theme` 组件、Theme Provider 或 React Context。组件目录和样式职责 MUST 保持一组件一目录、`layout.scss` 与 `theme.scss` 分离的 Radix 风格边界。共享 `system` 只处理颜色，共享 `styles` 只处理静态基础变量和组件样式聚合。

#### Scenario: 使用 useTheme 包裹局部主题

- **WHEN** 应用侧需要局部主题
- **THEN** 调用 `useTheme(system)` 并将返回的 ref 绑定到容器
- **AND** 不引入 `Theme` 组件或 Provider

#### Scenario: 检查组件样式边界

- **WHEN** 维护者检查 Atelier 组件目录
- **THEN** 每个组件的实现、类型、常量、样式、示例和测试仍位于自身目录
- **AND** 组件样式通过 `layout.scss` 与 `theme.scss` 分离职责
- **AND** 不存在集中承载组件状态的 recipe 文件

### Requirement: 共享静态 utility class

Atelier MUST 通过 `getPrefixCls()` 生成结构 utility class 前缀，MUST NOT 在 prop defs 中手写 `atelier-` 字符串。Atelier MUST 在 `packages/atelier/styles/utilities/*.scss` 集中声明静态结构 utility class，并通过 `styles/utilities/index.scss` 聚合。utility class MUST 使用 `atelier-*` 命名，至少覆盖 padding、margin、display 与 sizing。组件 MUST 直接组合这些 utility class，MUST NOT 在组件目录生成自己的 spacing、margin 或 sizing class。

utility class MUST NOT 支持 breakpoints。样式源码 MUST NOT 使用 `@breakpoints`，编译产物 MUST NOT 生成 `xs:`、`sm:`、`md:`、`lg:`、`xl:` 断点变体。
utility class MUST NOT 支持 grid。样式源码 MUST NOT 生成 grid-area、grid-column、grid-row 或 grid-template 相关 class。

#### Scenario: Box 使用共享 padding class

- **WHEN** 使用方传入 `<Box p="4">content</Box>`
- **THEN** Box 输出 `atelier-p-4`
- **AND** `atelier-p-4` 的 CSS 来自 `styles/utilities/padding.scss`

#### Scenario: Box 使用共享 margin class

- **WHEN** 使用方传入 `<Box mx="2" mt="4">content</Box>`
- **THEN** Box 输出 `atelier-mx-2` 与 `atelier-mt-4`
- **AND** 不产生组件私有 margin class

#### Scenario: 组件不复制结构 scale

- **WHEN** 维护者检查 `box/Box.tsx`、`box/types.ts` 与 `props/display.props.ts`
- **THEN** 文件只引用共享 prop defs 与 utility class
- **AND** 不存在组件私有的 padding、margin 或 sizing 映射；Box 自有 display prop def 复用共享 display utility class

### Requirement: 静态 class 与运行时颜色职责分离

结构与尺寸 utility class MUST 由静态 CSS 提供。组件 MUST NOT 通过 inline style 注入 padding、margin、display、width、height、radius 或 shadow。颜色可以由 `--color-*` 变量写入 style，用户传入的 `style` MUST 最后合并。

#### Scenario: Box 结构使用 class

- **WHEN** 使用方传入 `<Box p="4" m="2" display="block">content</Box>`
- **THEN** 结构属性只出现在 class 中
- **AND** 不通过 inline style 写入 padding、margin 或 display

#### Scenario: Box 用户 style 透传

- **WHEN** 使用方传入 `<Box bg="bg-muted" style={{ color: 'red' }}>content</Box>`
- **THEN** 最终节点使用 `var(--color-bg-muted)` 并保留 `color: red`
- **AND** 用户传入的 `style` 最后覆盖组件生成的同名样式

### Requirement: 组件根 class 使用 Atelier kebab-case 命名

Atelier MUST 使用小写 kebab-case 组件根 class，不采用 Radix 的 PascalCase 根 class：

- `atelier-box`
- `atelier-button`
- `atelier-base-button`

`atelier-Box`、`atelier-Button`、`atelier-BaseButton` MUST NOT 作为组件根 class 生成。仓库内测试、Storybook 和文档 MUST 与运行时 class 保持一致。

#### Scenario: 检查 Box 根 class

- **WHEN** 渲染 `Box`
- **THEN** 根节点包含 `atelier-box`
- **AND** 不包含 `atelier-Box`

#### Scenario: 检查 Button 根 class

- **WHEN** 渲染 `Button`
- **THEN** 根节点同时包含 `atelier-button` 与 `atelier-base-button`
- **AND** 不包含 `atelier-Button` 或 `atelier-BaseButton`
