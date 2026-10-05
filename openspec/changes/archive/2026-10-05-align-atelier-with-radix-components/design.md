# 设计：在现有组件目录内对齐 Radix

## 背景

Atelier 当前使用 `box/`、`button/` 组件目录。用户要求对齐 Radix 的组件拆分和静态 CSS 约定，但不新增 `components/` 目录，也不引入 `@radix-ui/react-slot`。

因此本设计保留现有目录，只调整目录内部的职责和组件组合方式。

## 参考版本

- 仓库：`https://github.com/radix-ui/themes`
- commit：`1faff10ac26ae17f09944d418c6949b93fc6b566`
- 许可证：MIT
- Box：`packages/radix-ui-themes/src/components/box.tsx`
- Box props：`packages/radix-ui-themes/src/components/box.props.tsx`
- Button：`packages/radix-ui-themes/src/components/button.tsx`
- BaseButton：`packages/radix-ui-themes/src/components/_internal/base-button.tsx`
- BaseButton props：`packages/radix-ui-themes/src/components/_internal/base-button.props.ts`
- package exports：`packages/radix-ui-themes/package.json`

上述源码只用于确认架构、命名和组合方式，不直接复制实现。

## 目标

- 保留 `box/`、`button/` 目录和现有子路径导出。
- 在目录内增加 Radix 风格的 props 文件、BaseButton、共享 props、extractProps 和 utility class；display prop defs 放在 `props/display.props.ts`，`BoxOwnProps` 与 `BoxProps` 放在 `box/types.ts`。
- 不引入 Slot、asChild 或新增运行时依赖。
- 保留 `useTheme`，不引入 Theme 组件。

## 非目标

- 暂时不支持 breakpoints、响应式 props 或 `sm:` / `md:` 断点 class。
- 暂时不支持 grid、grid display、grid-area、grid-column、grid-row 或 grid utility class。
- 不新增 `components/` 目录。
- 不引入 `@radix-ui/react-slot`。
- 不实现动态标签、asChild 或 Slot 合并。
- 不复刻 Radix 的单组件单 CSS 文件布局。
- 不复刻 Radix 的全量组件。

## 关键决策

### 1. 保留现有目录

目标结构：

```text
packages/atelier/
  box/
    Box.tsx
    constants.ts
    types.ts
    index.ts
    styles/
      index.scss
      layout.scss
  button/
    Button.tsx
    Button.props.tsx
    LoadingIcon.tsx
    constants.ts
    types.ts
    index.ts
    _internal/
      base-button.tsx
      base-button.props.ts
    styles/
      index.scss
      layout.scss
      theme.scss
      base-button.layout.scss
      base-button.theme.scss
  utils/
    extractProps.ts
  props/
    maps.ts
    index.ts
    padding.props.ts
    margin.props.ts
    display.props.ts
    width.props.ts
    height.props.ts
    radius.props.ts
    shadow.props.ts
  styles/
    tokens/
      index.scss
      space.scss
      radius.scss
      shadow.scss
      typography.scss
      control.scss
    utilities/
      padding.scss
      margin.scss
      display.scss
      sizing.scss
      radius.scss
      shadow.scss
      border.scss
    index.scss
```

不创建 `packages/atelier/components`。

### 2. 固定原生根节点

Box MUST 固定渲染 `div`。Button MUST 固定渲染原生 `button`。

```tsx
<Box>content</Box>
<Button>continue</Button>
```

不增加：

- `as`
- `asChild`
- Slot
- 子元素 clone 或 props 合并

### 3. Button 与 BaseButton 分离

`button/Button.tsx` 只负责：

- 公开 `ButtonProps`。
- 添加现有 `atelier-button` class。
- 将 props 和 ref 转交 BaseButton。

`button/_internal/base-button.tsx` 负责：

- 默认渲染 `button`。
- 处理 loading、disabled、ref。
- 新增 `atelier-base-button` class。
- 输出 `data-disabled`、`data-accent-color`、`data-radius`。
- 处理 loading 时的内容隐藏、可访问性和 loading icon。

### 4. 共享 props 和提取逻辑

第一版只支持单值静态 class，不支持 responsive object。Map schema MUST NOT 声明响应式对象，`extractProps` MUST NOT 处理 breakpoint key。

`props/*.props.ts` 负责声明 value 类型：

- `PaddingValue`
- `MarginValue`
- `DisplayValue`
- `RadiusValue`
- `ShadowValue`
- `DefaultColorKey`

`props/index.ts` 负责平铺声明 `AtelierProps`，并声明出：

- `getAtelierClassName(propName, value)`：按 `propName` 与值按需生成 class，且只缓存实际用到的组合，不在模块加载时预展开全量映射
- `atelierStyleMaps: Map<string, CSSProperties>`，key 为 `propName:value`

`box/types.ts` 直接使用 `AtelierProps`，并额外内联 `border?: boolean`。

`utils/extractProps.ts` MUST 负责：

- 从 props 中解析全局 class 与 style 映射声明的属性。
- 生成静态 class。
- 合并公共 className 与 style，用户 style 最后覆盖。
- 将剩余原生 props 透传给 DOM。

### 5. 共享静态 utility class

Radix 没有 `styles/foundation.ts` / `_foundation.scss`。Atelier MUST NOT 保留这两个自制桥接文件。

结构 scale 按 Radix 方式拆分：

- 公开 value 类型与 Map：`props/padding.props.ts`、`props/margin.props.ts`、`props/width.props.ts`、`props/height.props.ts`
- 静态 CSS 值：`styles/tokens/space.scss`、`radius.scss`、`shadow.scss`、`typography.scss`、`control.scss`
- utility class：`styles/utilities/padding.scss`、`margin.scss`、`display.scss`、`sizing.scss`

`styles/utilities/*.scss` 统一生成：

- `atelier-p-*`
- `atelier-px-*`
- `atelier-py-*`
- `atelier-m-*`
- `atelier-mx-*`
- `atelier-my-*`
- `atelier-mt-*`
- `atelier-mr-*`
- `atelier-mb-*`
- `atelier-ml-*`
- `atelier-display-*`
- sizing class

Box MUST 只组合这些共享 class，MUST NOT 在 `box/` 内生成自己的 padding 或 margin class。

### 6. class 与 data Attribute

根 class 沿用 Atelier 小写 kebab-case，不采用 Radix 的 PascalCase 命名：

- `atelier-box`
- `atelier-button`
- `atelier-base-button`

BaseButton 输出：

- `data-disabled`
- `data-accent-color`
- `data-radius`

颜色变量仍由 `useTheme` 注入，`data-*` 不使用颜色值替代 CSS 变量。

### 7. 导出保持不变

`package.json` 继续提供：

- `@omnific/atelier`
- `@omnific/atelier/box`
- `@omnific/atelier/button`
- `@omnific/atelier/system`
- `@omnific/atelier/transition`
- `@omnific/atelier/styles.css`

不新增 `./components/*`。

`tsdown` 继续按现有 `box/index.ts`、`button/index.ts` 生成入口。新增内部文件由这些入口引用，不改变公开 export。

### 8. 与 AGENTS 的取舍

仓库 AGENTS 要求组件样式拆分为 layout / theme。该规则继续保留：

- Box：`box/styles/layout.scss`；Box 不维护 theme 样式文件
- Button：`button/styles/layout.scss`、`button/styles/theme.scss`
- BaseButton：`button/styles/base-button.layout.scss`、`button/styles/base-button.theme.scss`

这是与 Radix 单 CSS 文件布局的有意差异，也是本变更唯一保留的结构差异。

## 备选方案

### 方案 A：新增 components 目录

更接近 Radix 文件布局，但用户明确要求不新增该目录，因此不采用。

### 方案 B：使用 @radix-ui/react-slot 实现 asChild

可以更接近 Radix wrapper 行为，但用户明确要求不引入该依赖和 Slot，因此不采用。

### 方案 C：保持当前 Button 单体实现

改动小，但无法形成 Radix 风格的 Button / BaseButton 分层，也缺少共享 props 和 utility class，因此不采用。

## 风险与处理

- **class 兼容**：保留 `atelier-box`、`atelier-button`，BaseButton 新增 `atelier-base-button`；不引入 PascalCase 根 class，因此无需迁移旧组件根 class。
- **props 规模扩大**：layout props 可能持续增加。处理方式是先覆盖 Box 现有能力、margin、display 与 sizing，再按需扩展。
- **loading 与 disabled**：拆分 BaseButton 后需要确保 loading、disabled、ref 和 aria 行为不回归。处理方式是保留现有测试并增加 data Attribute 断言。
- **样式双源**：props 定义与实际 CSS class 可能漂移。处理方式是用共享 scale 与单元测试校验 class 输出。
- **许可证**：只参考架构，不复制 Radix 源码。若后续复制任何实现，必须保留 MIT 许可和版权声明。

## 测试策略

- Box：验证固定 `div`、`atelier-box`、padding、margin、display、sizing 和用户 style 透传。
- Button：验证原生 button、disabled、loading、aria、ref、loading icon。
- BaseButton：验证 class、data Attribute、loading 包裹和事件行为。
- props：验证 margin / layout 提取、Box 自有 props、未知 props 透传和 className / style 合并。
- 导出：验证 `@omnific/atelier/box`、`@omnific/atelier/button` 和包根导出。
- 构建：验证 `dist/box`、`dist/button`、`dist/styles.css`，并确认没有 `dist/components` 新入口。
- 回归：Storybook 的 Box、Button、System stories 全部可构建。
