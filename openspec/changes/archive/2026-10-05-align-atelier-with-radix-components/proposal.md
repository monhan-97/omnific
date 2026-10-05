# 变更：在当前组件目录内对齐 Atelier 与 Radix

## Why

上一轮 `atelier-color-only-theme` 只完成了颜色运行时和 Box 静态 class，没有补齐 Radix 风格的组件拆分、BaseButton、共享 props、utility class 和 class / data Attribute 约定。

本变更在当前 `box/`、`button/` 目录内完成对齐：

- 不新增 `packages/atelier/components` 目录。
- 不引入 `@radix-ui/react-slot`。
- 不引入 `asChild` 或 Slot 渲染。
- 保留现有 `@omnific/atelier/box`、`@omnific/atelier/button` 子路径导出。

Radix 参考版本固定为：

- 仓库：`https://github.com/radix-ui/themes`
- commit：`1faff10ac26ae17f09944d418c6949b93fc6b566`
- 许可证：MIT
- 许可证地址：`https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/LICENSE`
- 参考文件：
  - `packages/radix-ui-themes/src/components/box.tsx`
  - `packages/radix-ui-themes/src/components/box.props.tsx`
  - `packages/radix-ui-themes/src/components/button.tsx`
  - `packages/radix-ui-themes/src/components/_internal/base-button.tsx`
  - `packages/radix-ui-themes/src/components/_internal/base-button.props.ts`
  - `packages/radix-ui-themes/package.json`

本变更只参考 Radix 的架构和公开行为，不复制其 CSS、颜色系统或组件实现。

## What Changes

- 保留 `packages/atelier/box` 与 `packages/atelier/button` 目录，不新增平级 `components/` 目录。
- 在现有目录内增加 Radix 风格文件：
  - `props/display.props.ts`（displayValues）
  - `box/types.ts`（BoxOwnProps / BoxProps）
  - `button/Button.props.tsx`
  - `button/_internal/base-button.tsx`
  - `button/_internal/base-button.props.ts`
- Button MUST 拆分为公开入口和内部 BaseButton：
  - `button/Button.tsx` 只负责公开入口、`atelier-button` 与 BaseButton 转发。
  - `button/_internal/base-button.tsx` 负责原生 `button`、ref、disabled、loading、loading icon、`data-*` 和 `atelier-base-button`。
- Box 与 Button MUST 继续固定渲染原生根节点：
  - Box 渲染 `div`。
  - Button 渲染 `button`。
  - MUST NOT 新增 `asChild`、Slot 或动态 `as` 标签。
- 组件根类名沿用 Atelier 小写 kebab-case 形态，不采用 Radix 的 PascalCase 根 class：
  - `atelier-box`
  - `atelier-button`
  - `atelier-base-button`
- 组件状态参数使用 `data-*`：
  - `data-disabled`
  - `data-accent-color`
  - `data-radius`
- 恢复 Atelier Box 的外观扩展 props，并拆到 `props` 目录：
  - `props/radius.props.ts`：`radius`
  - `props/shadow.props.ts`：`shadow`
  - `system/defaults/colors.ts`：导出 `defaultColorKeys` / `DefaultColorKey`
  - `props/index.ts`：根据 `AtelierProps` 与颜色 key 直接拼接 `bg` / `borderColor` style 映射
  - `border` 由 Box 组件内联处理，不单独维护 prop defs
- 新增共享 props 与提取逻辑：
  - `packages/atelier/props/maps.ts`（定义扁平 class/style Map 类型与 key helper）
  - `packages/atelier/props/*.props.ts`（声明 value 类型）
  - `packages/atelier/props/index.ts`（平铺声明 `AtelierProps`，并声明按需生成类名的 `getAtelierClassName` 与 `atelierStyleMaps`）
  - `packages/atelier/utils/extractProps.ts`（直接消费 `getAtelierClassName` / `atelierStyleMaps`，同时负责 className 与 style 合并）
- 删除上一轮引入的 `packages/atelier/styles/foundation.ts` 与 `_foundation.scss`。Radix 没有这两个文件；结构 value 类型放在 `packages/atelier/props/*.props.ts`，静态 CSS 值放在 `packages/atelier/styles/tokens/*`，utility class 放在 `packages/atelier/styles/utilities/*`。
- 结构 utility class 前缀 MUST 通过 `getPrefixCls()` 生成，不使用手写 `atelier-` 字符串。例如 `getPrefixCls('p')` 生成 `atelier-p`，最终输出 `atelier-p-4`。
- 暂时不支持 breakpoints。layout / margin / sizing prop MUST 只接受单个字符串值，MUST NOT 接受 `{ sm: ..., md: ... }` 这类响应式对象，MUST NOT 生成 `sm:atelier-p-4` 这类断点 class。
- 暂时不支持 grid。display MUST NOT 包含 `grid` 或 `inline-grid`，MUST NOT 新增 grid-area、grid-column、grid-row 等 props，也 MUST NOT 生成 grid utility class。
- 新增共享静态结构与 utility class：
  - `packages/atelier/styles/tokens/*.scss`
  - `packages/atelier/styles/utilities/*.scss`
  - `atelier-p-*`
  - `atelier-px-*`
  - `atelier-py-*`
  - `atelier-m-*`
  - `atelier-mx-*`
  - `atelier-my-*`
  - display 与 sizing utility class
- Box MUST 消费共享 display / layout / margin prop defs、拆分后的外观 props 和静态 utility class，MUST NOT 在 `box/` 内维护 padding、margin、display、radius、shadow 或 sizing scale。
- `package.json` MUST 保持现有 `./box`、`./button`、`./system`、`./transition` 和 `./styles.css` export，MUST NOT 新增 `./components/*`。
- 保留 `useTheme` 作为主题注入入口，MUST NOT 新增 Theme 组件、Theme Provider 或 React Context。
- 保持仓库 AGENTS 的样式拆分规则：Box 无主题样式，只保留 `box/styles/layout.scss`；Button 继续使用 `button/styles/layout.scss`、`button/styles/theme.scss`，BaseButton 样式放在 `button/styles` 内。

## 非目标

- 不引入 `@radix-ui/react-slot`。
- 不新增 `packages/atelier/components` 目录。
- 不实现 `asChild`、`as`、Slot、子元素 props 合并或 ref 合并。
- 不修改 `atelier-color-only-theme` 已确定的颜色运行时模型。
- 不引入 Theme 组件或 React Context。
- 不复制 Radix Themes 的完整 token、颜色生成器或组件实现。
- 不采用 Radix 的单组件单 CSS 文件布局。
- 暂时不实现 breakpoints、响应式 props 或响应式 utility class。
- 暂时不实现 grid 及其相关 layout props。
- 不在本变更内补齐 Radix 全部组件；范围为 Box、Button、BaseButton、共享 layout / margin props、utility class 和现有导出下的组件结构。

## 影响范围

- 受影响 capability：新增 `atelier-component-structure`；修改 `atelier-style-architecture`
- 受影响 package：`packages/atelier`
- 受影响公开 API：保留现有子路径；组件 class、内部文件结构和部分 props 提取行为发生变化
- 受影响 DOM 契约：根 class 与 `data-*` 属性
- 受影响依赖：无新增运行时依赖
- 破坏性变更：无组件根 class 迁移破坏；保留 `atelier-box`、`atelier-button`，BaseButton 新增 `atelier-base-button`

## 迁移要求

组件导入路径不变：

```ts
import { Box } from '@omnific/atelier/box';
import { Button } from '@omnific/atelier/button';
```

组件根 class 保持现有小写 kebab-case，不按 Radix 的 PascalCase 形态迁移：

```css
.atelier-box
.atelier-button
.atelier-base-button
```

仓库 MUST NOT 新增 `atelier-Box`、`atelier-Button` 或 `atelier-BaseButton` 根 class。测试、Storybook、示例和文档 MUST 与运行时 class 保持一致。

## 测试范围

- 验证 Box 仍渲染 `div`，并输出 `atelier-box`。
- 验证 Button 渲染原生 `button`，同时输出 `atelier-button` 与 `atelier-base-button`。
- 验证 Button disabled、loading、aria、ref 与 loading icon。
- 验证 `data-disabled`、`data-accent-color`、`data-radius`。
- 验证共享 layout / margin props 生成 `atelier-*` class。
- 验证 Box 的用户 `style` 透传，且不生成结构 inline style。
- 验证 Box、Button 继续输出 `atelier-box`、`atelier-button`，BaseButton 输出 `atelier-base-button`。
- 验证 `@omnific/atelier/box`、`@omnific/atelier/button` export 仍可用。
- 验证命令：

```bash
pnpm --filter @omnific/atelier typecheck
pnpm --filter @omnific/atelier test
pnpm --filter @omnific/atelier build
pnpm typecheck
pnpm lint:fix
pnpm build:storybook
```
