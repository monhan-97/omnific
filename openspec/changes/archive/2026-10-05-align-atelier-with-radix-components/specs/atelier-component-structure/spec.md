# Atelier 组件结构规格增量

## ADDED Requirements

### Requirement: 保留现有组件目录并增加 Radix 风格 props 文件

`@omnific/atelier` MUST 保留 `packages/atelier/box` 与 `packages/atelier/button` 目录，MUST NOT 新增 `packages/atelier/components` 目录。组件 MUST 在现有目录内增加 props 文件和内部实现边界：

- `box/types.ts`（BoxOwnProps / BoxProps）
- `props/display.props.ts`（displayValues / DisplayValue）
- `button/Button.props.tsx`
- `button/_internal/base-button.tsx`
- `button/_internal/base-button.props.ts`

旧组件目录和现有公开导入 MUST 保持可用，MUST NOT 为了结构调整而新增平行组件目录。

#### Scenario: 检查组件源码目录

- **WHEN** 维护者检查 `packages/atelier`
- **THEN** `props/display.props.ts` 中存在 `displayValues`，且存在 `button/Button.props.tsx` 与 `button/_internal/base-button.tsx`
- **AND** 不存在 `packages/atelier/components` 目录

#### Scenario: 保持现有子路径导入

- **WHEN** 使用方导入 `@omnific/atelier/box` 与 `@omnific/atelier/button`
- **THEN** package export 仍然可用
- **AND** `package.json` 不新增 `./components/*`

### Requirement: 不引入 Slot 和 asChild

Atelier MUST NOT 新增 `@radix-ui/react-slot` 或其他 Slot 依赖，MUST NOT 实现 `asChild`、动态 `as` 标签或子元素 props 合并。Box MUST 固定渲染 `div`，Button MUST 固定渲染原生 `button`。

#### Scenario: 检查组件 props

- **WHEN** 维护者检查 Box 与 Button 的类型定义
- **THEN** 不存在 `asChild` prop
- **AND** Box 不存在 `as` prop
- **AND** Button 不存在 Slot 或 cloneElement 逻辑

#### Scenario: 检查 package 依赖

- **WHEN** 维护者检查 `packages/atelier/package.json`
- **THEN** 不存在 `@radix-ui/react-slot`
- **AND** 本次变更没有新增运行时依赖

### Requirement: Button 入口与 BaseButton 分离

`button/Button.tsx` MUST 只负责公开 Button 入口、`atelier-button` class 和 BaseButton 转发。`button/_internal/base-button.tsx` MUST 负责原生 `button`、ref、disabled、loading、loading icon、`data-*` 属性与 `atelier-base-button`。两个文件 MUST NOT 重复处理同一 native button 行为。

#### Scenario: 检查 Button 实现

- **WHEN** 维护者检查 `button/Button.tsx`
- **THEN** 该文件只组合 class、转发 props 与 ref
- **AND** native button、loading 和 disabled 行为位于 `button/_internal/base-button.tsx`

#### Scenario: 原生 Button disabled

- **WHEN** 使用方传入 `<Button disabled>Save</Button>`
- **THEN** 最终节点是原生 `button`
- **AND** `disabled` 生效
- **AND** 节点存在 `data-disabled`
- **AND** 根 class 同时符合 Button 与 BaseButton 约定

### Requirement: 暂时不支持 breakpoints

Atelier MUST 暂时只支持单值 layout / margin / sizing props。Map schema MUST NOT 声明 `responsive` 字段，prop 类型 MUST NOT 接受 `{ xs: ..., sm: ..., md: ... }` 这类响应式对象，`extractProps` MUST NOT 解析 breakpoint key。生成的 utility class MUST NOT 包含 `xs:`、`sm:`、`md:`、`lg:`、`xl:` 前缀。

#### Scenario: 单值 padding

- **WHEN** 使用方传入 `<Box p="4">content</Box>`
- **THEN** Box 输出 `atelier-p-4`
- **AND** 不生成任何断点 class

#### Scenario: 拒绝响应式对象

- **WHEN** 使用方传入 `<Box p={{ sm: '4', md: '6' }}>content</Box>`
- **THEN** TypeScript 不接受该 prop 类型
- **AND** 运行时不生成 `sm:atelier-p-4` 或 `md:atelier-p-6`

### Requirement: 暂时不支持 grid

Atelier MUST 暂时不支持 grid。display prop MUST NOT 包含 `grid` 或 `inline-grid`。Atelier MUST NOT 提供 grid-area、grid-column、grid-column-start、grid-column-end、grid-row、grid-row-start、grid-row-end、grid-template-columns、grid-template-rows、grid-template-areas 或 grid-auto-flow 等 props。Atelier MUST NOT 生成 grid utility class。

#### Scenario: 检查 display 值

- **WHEN** 维护者检查 maps
- **THEN** display values 不包含 `grid`
- **AND** display values 不包含 `inline-grid`

#### Scenario: 拒绝 grid props

- **WHEN** 使用方传入 `gridColumn`、`gridRow` 或 `gridArea`
- **THEN** TypeScript 不接受这些 props
- **AND** `extractProps` 不生成对应 class

### Requirement: 组件共享 layout 与 margin props

Atelier MUST 在 `packages/atelier/props` 提供按需生成类名的 `getAtelierClassName`、`atelierStyleMaps` 与平铺的 `AtelierProps`；MUST NOT 在模块加载时预展开全量 class 映射。`border` 由 Box 内联处理。`BoxOwnProps` MUST 位于 `box/types.ts`，当前等于 `AtelierProps & { border?: boolean }`。Box MUST 通过 `extractProps(props)` 消费全局 props 解析，生成静态 utility class 与颜色 style，并合并用户 `style`，MUST NOT 在 `box/` 内复制 margin、padding、radius、shadow 或 sizing scale。第一阶段 MUST 覆盖 Box 现有 padding 能力，并新增 margin、display、width、height、min/max sizing。

#### Scenario: 按需生成 class 映射

- **WHEN** 组件只传入 `p="4"` 与 `m="-2"`
- **THEN** 只生成并缓存 `atelier-p-4` 与 `-atelier-m-2`，其余 prop 与值不产生 class 映射

#### Scenario: Box 应用 padding 与 margin

- **WHEN** 使用方传入 `<Box p="4" mx="2" display="block" width="100%">content</Box>`
- **THEN** Box 输出对应 `atelier-*` class
- **AND** 不产生组件私有的 padding 或 margin 配置

#### Scenario: 未声明的原生属性透传

- **WHEN** 使用方传入未知 DOM 属性或事件处理器
- **THEN** 属性或事件透传到最终 DOM 节点
- **AND** 被 prop defs 消费的属性不继续出现在 DOM 上

### Requirement: 组件根 class 与 data 属性遵循 Atelier 约定

Box、Button 与 BaseButton MUST 分别使用小写 kebab-case 的 `atelier-box`、`atelier-button`、`atelier-base-button` 根 class，MUST NOT 使用 Radix 的 PascalCase 根 class。BaseButton MUST 根据状态输出 `data-disabled`、`data-accent-color` 与 `data-radius`。组件 MUST 继续兼容 `data-atelier-theme`，MUST NOT 用 data 属性替代 `useTheme` 的颜色变量注入。

#### Scenario: 检查根 class

- **WHEN** 渲染 Box 与 Button
- **THEN** Box 根节点包含 `atelier-box`
- **AND** Button 根节点包含 `atelier-button` 与 `atelier-base-button`

#### Scenario: 检查 Button data 属性

- **WHEN** Button 传入 `disabled`、`color` 或 `radius`
- **THEN** 最终节点输出对应的 `data-disabled`、`data-accent-color` 或 `data-radius`
- **AND** DOM 上不存在被组件消费的 React 私有 props

### Requirement: Radix 参考信息与许可证记录

Atelier MUST 记录 Radix Themes 参考 commit `1faff10ac26ae17f09944d418c6949b93fc6b566`、MIT 许可证和参考源码路径。若后续直接复制 Radix 源码片段，MUST 保留对应许可证和版权声明。

#### Scenario: 检查第三方参考声明

- **WHEN** 维护者检查本变更的 proposal 或 design
- **THEN** 存在 Radix Themes 仓库地址、固定 commit SHA、源文件路径与 MIT 许可证信息
