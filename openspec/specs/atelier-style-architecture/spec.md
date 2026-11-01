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

颜色 token 的 TypeScript 事实源 MUST 为 `@omnific/atelier/system` 的公开 `createTheme`、`defaultTokens` 与 `defaultColors`；`createTheme` 内部调用不导出的 `createSystem`。primitive 色阶 MUST 位于嵌套 `tokens.colors`，组件可消费的语义颜色 MUST 位于嵌套 `semanticTokens.colors`。`createSystem` MUST 在同一个配置循环中合并 tokens 与嵌套 colors，并在循环结束后通过 `resolveColors` 使用内部扁平 token record 生成颜色和 CSS 变量，再由 `createTheme` 将传入配置解析出的扁平 `cssVars` 写入 `SystemContext`；公开 API MUST NOT 要求调用方使用 `defineTokens` 或 `defineColors`。应用侧 MUST 通过 `useTheme(system)` 将 `semanticTokens.colors` 产出的 `cssVars` 运行时注入到 DOM（元素或 `:root`）。颜色变量名 MUST 使用扁平 `--color-*` 约定，例如 `--color-bg`、`--color-fg-muted`、`--color-accent-solid`。组件 layout 与 theme MUST 通过 `--color-*` 消费颜色，MUST NOT 在组件内声明另一份颜色色板，MUST NOT 硬编码与语义颜色重复的色值，MUST NOT 直接消费 primitive 色相变量。

结构 token MUST 由 `packages/atelier/styles/tokens/*.scss` 或其他静态 SCSS 文件声明，包含 `--space-*`、`--radius-*`、`--font-*`、`--font-size-*`、`--control-height-*`、`--shadow-*` 等非颜色变量。结构变量 MUST 在构建期进入 `dist/styles.css`，MUST NOT 由 `useTheme` 注入。`packages/atelier/styles` MUST NOT 保存语义颜色色板或与 `system/defaults/colors.ts` 重复的颜色值。结构 scale 的公开值和 prop defs MUST 放在 `packages/atelier/props/*.props.ts`，utility class MUST 放在 `packages/atelier/styles/utilities/*.scss`。

#### Scenario: 组件同时消费颜色与结构变量

- **WHEN** 维护者检查 `button/styles/theme.scss` 与 `button/styles/layout.scss`
- **THEN** 颜色规则使用 `var(--color-role-*)` 或 `var(--color-*)`
- **AND** 高度、间距、圆角、字体和阴影使用静态结构变量
- **AND** 不存在由 `useTheme` 注入的结构变量

#### Scenario: 运行时注入单个主题颜色

- **WHEN** 应用侧调用 `createTheme('app', customTheme)` 并调用 `useTheme(system)`
- **THEN** 当前 system 的 `--color-*` 变量进入对应 `<style>`
- **AND** 目标节点通过 `data-atelier-theme` 选择主题
- **AND** 全程无 React Context、Theme Provider 或 `Theme` 组件

#### Scenario: 结构变量不依赖运行时

- **WHEN** 消费方只导入 `@omnific/atelier/styles.css`，不调用 `useTheme`
- **THEN** 组件仍能获得尺寸、间距、圆角、字体和阴影基础值
- **AND** 只有颜色值需要由应用侧提供或使用默认主题

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

Atelier 组件主题样式 MUST 使用语义颜色 token，例如 `--color-accent-*`、`--color-danger-*`、`--color-warning-*`、`--color-success-*` 和 `--color-info-*`。组件 MUST NOT 直接依赖 primitive 色相 token，例如 `--color-gray-*`、`--color-red-*`。主题枚举与业务 system MUST 负责把具体颜色映射到语义 token。

palette MUST 继续使用现有角色键契约：`contrast`、`fg`、`subtle`、`muted`、`emphasized`、`solid`、`hover`、`active`、`focus-ring`、`border`。MUST NOT 新增 `neutral` palette 或 `bg`、`solid-hover`、`solid-active` 等默认颜色属性。Button 的 `default` MUST 使用现有默认角色变量，`primary` MUST 映射 `accent`，`danger` MUST 映射同名 palette。共享 Sass 映射 MUST 根据 `data-color` 生成 `--color-role-*` 变量，组件 MUST NOT 为每个颜色重复手写角色别名。

#### Scenario: Button 使用语义强调色

- **WHEN** 维护者检查 Button 主题样式
- **THEN** primary、outline、hover、active 和 focus 规则使用 `--color-role-*`
- **AND** `--color-role-*` 由共享 palette 映射生成
- **AND** 不存在 `--color-gray-*` 或 `--color-blue-*`

#### Scenario: Button 颜色角色保持现有集合

- **WHEN** 维护者检查 `ButtonColor`
- **THEN** 只包含 `default`、`primary`、`danger`
- **AND** 不新增 `warning`、`success`、`info` 取值
- **AND** 根节点继续输出对应的 `data-color`

### Requirement: 结构属性使用静态 class

组件的尺寸、间距、圆角、阴影和形状 MUST 使用静态 class 或静态 CSS 选择器实现。主题枚举和组件结构枚举 MUST NOT 通过 `createTheme` 返回值、`useTheme` 或新的颜色变量改变结构值。`Box` 的 `p`、`px`、`py`、`rounded`、`shadow` MUST 映射到 `box/styles` 中定义的静态 class；`bg`、`borderColor` 可以继续解析为 `--color-*` 引用。

#### Scenario: Button 尺寸使用静态 class

- **WHEN** 使用方传入 `size="large"` 或 `shape="round"`
- **THEN** 组件输出对应静态 class
- **AND** `createTheme` 返回对象的 `cssVars` 不发生变化

#### Scenario: Box 结构属性输出静态 class

- **WHEN** 使用方传入 `p={4}`、`rounded="md"` 或 `shadow="sm"`
- **THEN** Box 输出 `box/styles` 中定义的静态 class
- **AND** 不通过 `styleFromTokens` 写入 padding、border-radius 或 box-shadow 的 inline style

#### Scenario: Box 颜色属性继续使用颜色变量

- **WHEN** 使用方传入 `bg="bg-muted"` 或 `borderColor="accent-solid"`
- **THEN** Box 输出对应的 `var(--color-bg-muted)` 或 `var(--color-accent-solid)`
- **AND** 这些颜色变量由 `useTheme` 注入

### Requirement: 主题边界不引入 Theme 组件

Atelier MUST 继续使用 `useTheme(system)` 作为主题注入入口，MUST NOT 新增 Theme 组件、Theme Provider 或 React Context。主题切换 MUST 通过选择不同 `SystemContext` 完成，MUST NOT 写入 `ThemeConfig`。组件目录和样式职责 MUST 保持一组件一目录、`layout.scss` 与 `theme.scss` 分离的 Radix 风格边界。共享 `system` 只处理颜色，共享 `styles` 只处理静态结构变量和组件样式聚合。首期 MUST NOT 引入运行时 `css`、`cva`、`sva`、recipe、slotRecipe、layerStyle、conditions 或 breakpoints。

#### Scenario: 使用 useTheme 包裹局部主题

- **WHEN** 应用侧需要局部主题
- **THEN** 调用 `useTheme(system)` 并将返回的 ref 绑定到容器
- **AND** 不引入 Theme 组件或 Provider

#### Scenario: 通过不同 system 切换主题

- **WHEN** 应用侧需要从 `light` 切换到 `dark`
- **THEN** 将 `useTheme` 的入参从 `lightSystem` 替换为 `darkSystem`
- **AND** 不修改 `ThemeConfig` 或组件实现

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

### Requirement: 主题配置保持单一职责

`ThemeConfig` MUST 只描述一个主题的颜色配置。`ThemeConfig` MUST NOT 包含 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme`、`defaultThemeName` 或任何主题注册、当前主题和切换状态。主题注册表、当前主题状态和切换逻辑 MUST 位于应用层或独立的主题选择模块。

#### Scenario: 检查 ThemeConfig 字段

- **WHEN** 维护者检查 `ThemeConfig` 类型和任意主题配置文件
- **THEN** 只存在 `tokens` 与 `semanticTokens` 颜色配置
- **AND** 不存在浅色/深色模式字段、主题列表或切换函数

#### Scenario: 新增主题不修改现有配置

- **WHEN** 维护者新增 `warmTheme` 并调用 `createTheme('warm', warmTheme)`
- **THEN** 不需要修改 `lightTheme`、`darkTheme` 或 `defaultTheme`
- **AND** 不需要给现有 system 增加模式字段

#### Scenario: 两个主题独立切换

- **WHEN** 应用层分别渲染使用 `lightSystem` 与 `darkSystem` 的局部主题容器
- **THEN** 每个容器通过各自的 `data-atelier-theme` 命中对应颜色变量
- **AND** 一个容器的主题切换不影响另一个容器
