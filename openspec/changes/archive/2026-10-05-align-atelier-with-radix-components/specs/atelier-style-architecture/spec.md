# Atelier 样式架构规格增量

## MODIFIED Requirements

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

## ADDED Requirements

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
