## Purpose

定义 `@omnific/atelier/system` 的嵌套颜色主题 API：以嵌套 primitive tokens 与 semantic colors 为事实源，经 `createTheme` 将传入的 `ThemeConfig` 解析为 `--color-*` 颜色 `cssVars`，再由 `useTheme` 运行时注入 DOM；`defaultColors` 保持既有语义键集合，结构尺寸、间距、圆角、字体和阴影由静态 SCSS 提供。不引入 React Context、独立 system 包、Theme 组件或 recipe 样式引擎。

## Requirements

### Requirement: 在 Atelier 内以 subpath 提供 System token API

`@omnific/atelier` MUST 在 `packages/atelier/system` 实现并经 `@omnific/atelier/system` 导出 `createTheme`、`applyCssVars`、`useTheme`、`defaultTokens`、`defaultColors`、`defaultTheme` 与 `defaultSystem`。`createTheme` MUST 接受 `name: string` 和零份或多份 `ThemeConfig` override，直接解析传入配置，并将其 `cssVars` 解析为传入配置声明的颜色变量；MUST NOT 自动合并 `defaultTheme`。`createSystem` 与 `extendTheme` MUST NOT 作为公开 API 导出；`ThemeConfig` MUST 使用嵌套 `TokenDefinition` 的 `tokens.colors` 与嵌套 `ColorDefinition` 的 `semanticTokens.colors`。`ThemeConfig` MUST NOT 包含 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme` 或任何主题切换状态。公开 API MUST NOT 导出 `defineTokens`、`defineColors`、`TokenMap`、`ColorMap`、`mergeColors` 或 `flattenColors`。该入口 MUST NOT 要求 React Provider / Context，也 MUST NOT 引入 `Theme` 组件。仓库 MUST NOT 为此新增独立的 `@omnific/system` package。

#### Scenario: 直接传入嵌套主题配置

- **WHEN** 调用方把包含嵌套 `tokens.colors` 与 `semanticTokens.colors` 的 `ThemeConfig` 传入 `createTheme`
- **THEN** `createTheme` 只解析传入配置并完成嵌套 token 合并和颜色 group 合并
- **AND** 调用方无需调用 `defineTokens` 或 `defineColors`

#### Scenario: 合并同一主题的配置层

- **WHEN** 调用方把包含额外 token 与语义颜色的业务配置传入 `createTheme`
- **THEN** 合并后的 system 使用业务 primitive token 解析语义颜色
- **AND** 未覆盖的 CSS 变量继续由 `dist/styles.css` 的 `:root` 默认值提供
- **AND** 后传入的同名配置覆盖先前配置

#### Scenario: 拒绝主题切换状态

- **WHEN** 调用方在 `ThemeConfig` 中传入 `mode`、`colorMode`、`themes`、`currentTheme` 或 `setTheme`
- **THEN** TypeScript 类型检查拒绝该配置

### Requirement: 首期 SystemContext 仅包含颜色构建结果且不含 get 方法

`createTheme` MUST 返回 `name` 与由传入配置解析出的扁平 `cssVars`。`SystemContext` MAY 作为 `applyCssVars` / `useTheme` 的函数参数契约，只描述 `name` 与 `cssVars` 结构，MUST NOT 暴露 `colors` 或内部 token record。公开实例 MUST NOT 包含 `_config`、结构 token、`token`、`isValidSystem`、`$$atelier`、任何 `get*` 方法、`utility` / `utilities`。MUST NOT 导出 `SystemConfig`、`defineConfig` 或 `TokenDictionary`。首期 MUST NOT 导出或实现运行时 `css`、`cva`、`sva`、conditions、recipe 相关 API。

#### Scenario: 检查返回值键名

- **WHEN** 维护者检查 `createTheme('app')` 的公开键
- **THEN** 只包含 `name` 与 `cssVars`
- **AND** 不存在 `_config`、`token`、`$$atelier`、`getTokenCss`、`tokens`、`utility`、`css`、`cva`、`sva`

#### Scenario: 颜色结果不产生结构 token

- **WHEN** 维护者使用包含 `bg`、`accent-solid` 与 `accent-hover` 的颜色配置
- **THEN** `createTheme` 返回对象的 `cssVars` 只包含 `--color-*`
- **AND** 不产生 `--space-*`、`--radius-*`、`--font-size-*`、`--control-height-*` 或 `--shadow-*`

### Requirement: 经 useTheme 运行时注入扁平 CSS 变量

`@omnific/atelier/system` MUST 导出 `useTheme(system)`，返回用于注入的对象 ref（`RefObject`）。`useTheme` 与 `applyCssVars` MUST NOT 接受选项参数。注入 MUST 仅通过挂在 `document.head` 下的 `<style>` 完成，MUST NOT 使用元素 inline style。`<style>` MUST 以 `system.name` 为 key 复用，并以引用次数管理生命周期，归零时 MUST 移除；`system.name` 即主题身份，调用方 MUST 保证同名 system 使用同一配置。目标节点（含 `document.documentElement`）MUST 设置 `data-atelier-theme` 为 `system.name`，样式选择器 MUST 只匹配 `data-atelier-theme`。`applyCssVars` MUST 返回卸载函数。注入 MUST NOT 依赖 React Context、Theme Provider、`Theme` 组件或 `useId`。注入 MUST 直接输出 `system.cssVars`；默认主题基础变量 MUST 由 `dist/styles.css` 的 `:where(:root)` 规则提供。`cssVars` 的变量名 MUST 使用扁平 `--color-${语义键}` 形态，例如 `--color-bg`、`--color-fg-muted`、`--color-accent-solid`。`useTheme` MUST NOT 注入结构变量。

#### Scenario: 未绑定 ref 时注册到 documentElement

- **WHEN** 调用方在组件中调用 `useTheme(system)` 且未将返回的 ref 绑定到任何元素
- **THEN** `document.documentElement` 上出现对应的 `--color-*` 变量
- **AND** `createTheme` 创建的 system 只输出传入配置声明的 `cssVars`
- **AND** 默认主题基础变量由 `dist/styles.css` 提供
- **AND** 目标带有 `data-atelier-theme={system.name}`
- **AND** 不设置 `data-atelier-color-mode`

#### Scenario: 绑定 ref 时作用域到元素

- **WHEN** 调用方将 `useTheme(system)` 返回的 ref 绑定到某个 HTMLElement
- **THEN** 该元素子树内出现对应的 `--color-*` 变量
- **AND** 不依赖把同一份变量留在 `:root` 作为本次注入目标

#### Scenario: 只注入颜色变量

- **WHEN** system 声明 `bg` 与 `accent-solid`，并经 `cssVars` 与 `useTheme` 注入
- **THEN** 目标作用域存在 `--color-bg` 与 `--color-accent-solid`
- **AND** 作用域内不出现由 `useTheme` 注入的 `--space-4`、`--radius-md`、`--control-height-md` 或 `--shadow-sm`

#### Scenario: 同一 system name 复用样式节点

- **WHEN** 多个组件使用相同 `system.name` 调用 `useTheme` 并依次卸载
- **THEN** `document.head` 中对应颜色 `<style>` 只创建一次
- **AND** 仅在最后一个引用卸载后移除

### Requirement: System 核心提供默认主题且允许业务覆盖

`@omnific/atelier/system` MUST 提供 `defaultTokens`、`defaultColors`、`defaultTheme` 与 `defaultSystem`。`defaultTokens` MUST 使用嵌套 `TokenDefinition`，只保存默认语义颜色实际引用的 primitive 色阶；`defaultColors` MUST 使用嵌套 `ColorDefinition`，其键集合 MUST 与变更前保持一致，MUST NOT 新增 `neutral` palette 或其他默认颜色属性；`DefaultColorKey` MUST NOT 因本次变更新增成员；`defaultTheme` MUST 组合两者；`defaultSystem` MUST 由 `defaultTheme` 创建。`info` palette MUST 使用独立 `info.*` primitive token，避免品牌 `accent` 覆盖时改变状态提示色。业务扩展 MUST 通过向 `createTheme` 传入额外 `ThemeConfig` 完成。不同主题 MUST 使用独立 `ThemeConfig` 和独立 `SystemContext`，MUST NOT 通过 `ThemeConfig` 内的模式或主题列表切换。结构尺寸、间距、圆角、字体和阴影 MUST 由静态 SCSS 提供，MUST NOT 作为 `defaultTheme` 或 `createTheme` 返回值的一部分。

#### Scenario: 合并覆盖默认语义颜色

- **WHEN** 维护者使用 `createTheme('app', customTheme)` 创建 system
- **THEN** 同名语义颜色以自定义值为准
- **AND** 未覆盖的默认语义颜色继续可用
- **AND** 不产生结构 token

#### Scenario: info palette 不跟随 accent 覆盖

- **WHEN** 业务主题只覆盖嵌套 `tokens.colors.accent.500`
- **THEN** `accent-solid` 使用新的 accent 值
- **AND** `info-solid` 继续使用独立的 `info.500` 值

#### Scenario: 使用不同配置创建不同主题

- **WHEN** 维护者分别使用 `lightTheme`、`darkTheme` 和 `warmTheme` 调用 `createTheme`
- **THEN** 得到 `light`、`dark` 和 `warm` 三个独立 system
- **AND** 每个 system 只包含自身配置解析后的颜色
- **AND** 应用层通过选择不同 system 切换主题

#### Scenario: 不通过 System 提供尺寸

- **WHEN** 维护者检查 `defaultTheme`、`createTheme` 参数与 `createTheme` 返回对象的 `cssVars`
- **THEN** 不存在 spacing、radii、shadows、fonts、fontSizes 或 controlHeights 分类
- **AND** 尺寸相关实现位于静态 SCSS

### Requirement: 导出可供组件消费的 token 取值类型

`@omnific/atelier/system` MUST 通过构建脚本从 `defaultSystem.colors` 生成 `system/defaults/color-keys.gen.ts` 中的 `DefaultColorKey` 联合，供 Atelier 组件颜色 props 直接使用。类型层 MUST NOT 使用递归 flatten 推导默认颜色键。现有 `accent`、`danger`、`warning`、`success`、`info` MUST 保持当前角色键契约，MUST NOT 新增 `neutral` palette 或新的默认角色键。组件颜色 props MUST 使用语义角色或 palette 名称，MUST NOT 使用具体色相 token 名称作为唯一事实源。结构 props 的类型 MUST NOT 从颜色 system 推导。颜色类型 MUST NOT 包含 `ColorMode` 或按模式分组的键。

#### Scenario: 默认颜色键集合保持不变

- **WHEN** 维护者比较变更前后的 `defaultColors` 键集合与 `DefaultColorKey`
- **THEN** 键集合完全一致
- **AND** 不新增 `neutral`、`bg`、`solid-hover`、`solid-active` 等属性

#### Scenario: Box 背景取值跟随生成类型

- **WHEN** 构建脚本从 `defaultSystem.colors` 重新生成 `DefaultColorKey`
- **THEN** `Box` 的 `bg` prop 类型使用生成结果
- **AND** 无需在 `box/types.ts` 手写维护同名字符串字面量

#### Scenario: 主题切换不改变组件类型

- **WHEN** 应用层从 `lightSystem` 切换到 `darkSystem`
- **THEN** 组件仍使用相同的 `bg`、`fg`、`border` 与 palette 类型
- **AND** 不需要为不同主题维护不同的组件 props 类型

#### Scenario: 尺寸类型不依赖颜色 system

- **WHEN** 维护者检查 Button 与 Box 的结构 props 类型
- **THEN** `size`、`p`、`radius`、`shadow` 等类型来自静态定义或固定联合类型
- **AND** 不依赖颜色对象或 `createTheme` 返回值

### Requirement: 保持包边界与无 Provider 模型

Atelier MUST 继续使用 `useTheme(system)` 作为主题注入入口，MUST NOT 新增 Theme 组件、Theme Provider 或 React Context。主题切换 MUST 通过选择不同 `SystemContext` 完成，MUST NOT 写入 `ThemeConfig`。共享 `system` 只处理颜色，共享 `styles` 只处理静态结构变量和组件样式聚合。首期 MUST NOT 引入运行时 `css`、`cva`、`sva`、recipe、slotRecipe、layerStyle、conditions 或 breakpoints。

#### Scenario: 使用 useTheme 包裹局部主题

- **WHEN** 应用侧需要局部主题
- **THEN** 调用 `useTheme(system)` 并将返回的 ref 绑定到容器
- **AND** 不引入 Theme 组件或 Provider

#### Scenario: 通过不同 system 切换主题

- **WHEN** 应用侧需要从 `light` 切换到 `dark`
- **THEN** 将 `useTheme` 的入参从 `lightSystem` 替换为 `darkSystem`
- **AND** 不修改 `ThemeConfig` 或组件实现
