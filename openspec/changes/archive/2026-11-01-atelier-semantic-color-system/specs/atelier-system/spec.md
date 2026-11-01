# Atelier System 规格增量

## MODIFIED Requirements

### Requirement: 在 Atelier 内以 subpath 提供 System token API

`@omnific/atelier` MUST 在 `packages/atelier/system` 实现并经 `@omnific/atelier/system` 导出 `createTheme`、`applyCssVars`、`useTheme`、`defaultTokens`、`defaultColors`、`defaultTheme` 与 `defaultSystem`。`createTheme` MUST 接受 `name: string` 和零份或多份 `ThemeConfig` override，直接解析传入配置，并将其 `cssVars` 解析为传入配置声明的颜色变量；MUST NOT 自动合并 `defaultTheme`。`createSystem` 与 `extendTheme` MUST NOT 作为公开 API 导出；`ThemeConfig` MUST 使用嵌套 `TokenDefinition` 的 `tokens.colors` 与嵌套 `ColorDefinition` 的 `semanticTokens.colors`。`ThemeConfig` MUST NOT 包含 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme` 或任何主题切换状态。公开 API MUST NOT 导出 `defineTokens`、`defineColors`、`TokenMap`、`ColorMap`、`mergeColors` 或 `flattenColors`；嵌套配置的合并、扁平化与颜色展开 MUST 由 `createSystem` 内部实现；`createSystem` MUST 按配置顺序直接合并全部 `ThemeConfig` 的 tokens 与语义颜色，MUST NOT 构造中间 `ThemeConfig` 对象，并由 `mergeTokenDefinition` 在合并时直接输出扁平 `Record<string, string>`、由 `mergeColorDefinition` 将嵌套颜色组展开为扁平颜色表；全部配置合并完成后，`resolveColors` MUST 通过扁平 token key 一次性解析颜色并生成 colors 与 cssVars。`SystemContext`、`TokenValue`、`TokenGroup`、`TokenDefinition`、`ColorValue`、`ColorGroup`、`ColorDefinition` 和 `ThemeConfig` MAY 作为函数参数契约导出。该入口 MUST NOT 要求 React Provider / Context，MUST NOT 引入 Theme 组件，MUST NOT 新增独立 `@omnific/system` package。

#### Scenario: 直接传入嵌套主题配置

- **WHEN** 调用方把包含嵌套 `tokens.colors` 与 `semanticTokens.colors` 的 `ThemeConfig` 传入 `createTheme`
- **THEN** `createTheme` 只解析传入配置并完成嵌套 token 合并和颜色 group 合并
- **AND** 调用方无需调用 `defineTokens` 或 `defineColors`

#### Scenario: 合并同一主题的配置层

- **WHEN** 调用方把包含额外 token 与语义颜色的业务配置传入 `createTheme`
- **THEN** 合并后的 system 使用业务 primitive token 解析语义颜色
- **AND** 未覆盖的 CSS 变量继续由 `dist/styles.css` 的 `:root` 默认值提供
- **AND** 后传入的同名配置覆盖先前配置

#### Scenario: 配置中不包含主题切换状态

- **WHEN** 维护者检查 `ThemeConfig` 类型和 `defaultTheme` 对象
- **THEN** 不存在 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme` 字段
- **AND** 主题切换只能通过选择不同 `SystemContext` 完成

### Requirement: 语义颜色支持 primitive 引用

`ColorValue` MUST 保持为 `string`，系统 MUST NOT 在颜色叶值中引入 `light`、`dark` 或类似模式对象。`semanticTokens.colors` 的叶值 MAY 使用 `{colors.path}` 形式引用 `tokens.colors` 中的 primitive token；primitive token 的值 MUST 是原始颜色字符串，MUST NOT 继续引用其他 token。`createSystem` MUST 在创建 system 时解析引用并生成扁平语义颜色表。引用不存在的 primitive token 时，`createSystem` MUST 抛出可识别错误，MUST NOT 静默生成无效 CSS 变量。首期 MUST NOT 支持任意透明度修饰符。

#### Scenario: 解析嵌套语义颜色中的 primitive 引用

- **WHEN** `semanticTokens.colors.bg.base` 声明为 `'{colors.white}'`，且 `tokens.colors.white` 为 `#ffffff`
- **THEN** `system.colors.bg` 为 `#ffffff`
- **AND** `system.cssVars['--color-bg']` 为 `#ffffff`

#### Scenario: 未知 primitive 引用

- **WHEN** 语义颜色引用不存在的 `{colors.unknown.500}`
- **THEN** `createSystem` 抛出包含引用路径的错误
- **AND** 不返回部分解析的 system

#### Scenario: 颜色配置不包含模式叶值

- **WHEN** 维护者检查 `ColorValue` 与默认语义颜色
- **THEN** 所有颜色叶值均为字符串
- **AND** 不存在 `{ light, dark }` 形式的颜色叶值

### Requirement: 经 useTheme 运行时注入扁平颜色 CSS 变量

`createTheme` 返回对象 MUST 只提供 `name` 与由传入配置解析出的扁平 `cssVars`，MUST NOT 暴露 `colors` 或内部 token record。`@omnific/atelier/system` MUST 导出 `useTheme(system)`，返回用于注入的对象 ref（`RefObject`）。`useTheme` 与 `applyCssVars` MUST NOT 接受选项参数。注入 MUST 仅通过挂在 `document.head` 下的 `<style>` 完成，MUST NOT 使用元素 inline style。样式选择器 MUST 只匹配 `data-atelier-theme={system.name}`，MUST NOT 引入 `data-atelier-color-mode` 或其他模式属性。目标节点（含 `document.documentElement`）MUST 设置 `data-atelier-theme={system.name}`。`applyCssVars` MUST 返回卸载函数，并在卸载时移除本次设置的属性。`<style>` MUST 以 `system.name` 为 key 复用并引用计数，归零时 MUST 移除。注入 MUST 直接输出 `system.cssVars`；默认主题基础变量 MUST 由 `dist/styles.css` 的 `:where(:root)` 规则提供。`cssVars` MUST 只包含语义 `--color-*` 变量，MUST NOT 包含结构变量。

`dist/styles.css` MUST 在结构样式之前包含由 `defaultSystem.cssVars` 生成的 `:where(:root)` 默认颜色规则；该规则 MUST 只包含语义 `--color-*` 变量，并 MUST 允许 `data-atelier-theme` 规则覆盖。静态默认颜色与运行时颜色注入 MUST 共用同一套 `cssVars`。

#### Scenario: 未绑定 ref 时注册到 documentElement

- **WHEN** 调用方调用 `useTheme(system)` 且未将返回的 ref 绑定到任何元素
- **THEN** `document.documentElement` 上出现 `data-atelier-theme={system.name}`
- **AND** `createTheme` 创建的 system 只输出传入配置声明的 `cssVars`
- **AND** 默认主题基础变量由 `dist/styles.css` 提供
- **AND** 该节点的 `--color-*` 使用当前 system 的值

#### Scenario: 绑定 ref 时作用域到元素

- **WHEN** 调用方将 `useTheme(system)` 返回的 ref 绑定到某个 HTMLElement
- **THEN** 该元素子树内出现当前 system 的完整颜色变量
- **AND** 不依赖把同一份变量留在 `:root` 作为本次注入目标

#### Scenario: 只注入颜色变量且不引入模式属性

- **WHEN** system 声明 `bg` 与 `accent-solid`，并经 `cssVars` 与 `useTheme` 注入
- **THEN** 目标作用域存在 `--color-bg` 与 `--color-accent-solid`
- **AND** 作用域内不出现 `--space-4`、`--radius-md`、`--control-height-md` 或 `--shadow-sm`
- **AND** 不设置 `data-atelier-color-mode`

#### Scenario: 静态默认主题允许自定义主题覆盖

- **WHEN** 消费方导入 `@omnific/atelier/styles.css` 并使用自定义 system
- **THEN** `:where(:root)` 提供默认 `--color-*` 回退
- **AND** 自定义 `data-atelier-theme` 规则覆盖同名变量
- **AND** 自定义 system 未声明的变量继续继承默认值
- **AND** 静态默认颜色不产生 `--space-*`、`--radius-*`、`--control-height-*` 或 `--shadow-*`

#### Scenario: 同一 system name 复用样式节点

- **WHEN** 多个组件使用相同 `system.name` 调用 `useTheme` 并依次卸载
- **THEN** `document.head` 中对应颜色 `<style>` 只创建一次
- **AND** 仅在最后一个引用卸载后移除

### Requirement: System 核心提供默认主题且允许业务覆盖

`@omnific/atelier/system` MUST 提供 `defaultTokens`、`defaultColors`、`defaultTheme` 与 `defaultSystem`。`defaultTokens` MUST 使用嵌套 `TokenDefinition`，只保存默认语义颜色实际引用的 primitive 色阶，MUST NOT 预先保留未使用的完整色板；`defaultColors` MUST 使用嵌套 `ColorDefinition`，且其键集合 MUST 与变更前保持一致，MUST NOT 新增 `neutral` palette 或其他默认颜色属性；`DefaultColorKey` MUST NOT 因本次变更新增成员；`defaultTheme` MUST 组合两者；`defaultSystem` MUST 由 `defaultTheme` 创建。`info` palette MUST 使用独立 `info.*` primitive token，避免品牌 `accent` 覆盖时改变状态提示色。业务扩展 MUST 通过向 `createTheme` 传入额外 `ThemeConfig` 完成。不同主题 MUST 使用独立 `ThemeConfig` 和独立 `SystemContext`，MUST NOT 通过 `ThemeConfig` 内的模式或主题列表切换。结构尺寸、间距、圆角、字体和阴影 MUST 由静态 SCSS 提供，MUST NOT 作为 `defaultTheme` 或 `createTheme` 返回值的一部分。

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

`@omnific/atelier/system` MUST 通过构建脚本从 `defaultSystem.colors` 生成 `system/defaults/color-keys.gen.ts` 中的 `DefaultColorKey` 联合，供 Atelier 组件颜色 props 直接使用。类型层 MUST NOT 使用递归 flatten 推导默认颜色键。现有 `accent`、`danger`、`warning`、`success`、`info` MUST 保持当前角色键契约，MUST NOT 新增 `neutral` palette、`bg`、`solid-hover`、`solid-active` 等属性。组件颜色 props MUST 使用语义角色或 palette 名称，MUST NOT 使用具体色相 token 名称作为唯一事实源。结构 props 的类型 MUST NOT 从颜色 system 推导。颜色类型 MUST NOT 包含 `ColorMode` 或按模式分组的键。

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
