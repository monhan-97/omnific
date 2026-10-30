# 变更：为 Atelier 引入嵌套颜色主题配置与 primitive token 分层

## Why

当前 `@omnific/atelier/system` 把颜色建模为扁平 `ColorSet`。`defaultColors` 直接混合 primitive 色阶与语义颜色，调用方无法区分原始色和语义颜色；同时 `defaultColors` 的键集合与 `DefaultColorKey` 已经承担组件 props 契约。本次只引入 primitive token 分层和嵌套 `ThemeConfig`，不新增 `defaultColors` 属性。

主题切换应通过不同的主题配置创建不同的 system 完成，而不是把 `light`、`dark`、`themes`、`colorMode` 或当前主题状态塞进同一份 `ThemeConfig`。一个配置只描述一个完整主题；应用层负责选择使用哪个 system。

Chakra UI 最新主题的 primitive tokens → semantic tokens → palette 契约值得借鉴，但 Atelier 应继续保留 CSS 变量、静态 class 和 `useTheme` 注入方式，不引入 Emotion/Panda 运行时。

本变更只调整颜色主题模型；结构尺寸、间距、圆角、字体和阴影继续由静态 SCSS 提供。

## What Changes

- **BREAKING**：公开主题构造入口改为 `createTheme(name: string, ...overrides: ThemeConfig[])`；内部 `createSystem` 不再导出。`createTheme` 直接解析传入配置，并将其 `cssVars` 解析为传入配置声明的颜色变量，不自动合并 `defaultTheme`。`ThemeConfig` 的 `tokens.colors` 与 `semanticTokens.colors` 都使用嵌套定义，MUST NOT 包含 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme` 或类似的主题切换字段。
- **BREAKING**：不再公开 `defineTokens` 与 `defineColors`。调用方直接传入嵌套 token 与 color 配置，由 `createTheme` 内部的 `createSystem` 按配置顺序直接合并全部配置的 tokens 与语义颜色，不构造中间 `ThemeConfig` 对象；`mergeTokenDefinition` 在合并时直接输出扁平 token record，`mergeColorDefinition` 将嵌套颜色组展开为扁平颜色表，全部配置合并完成后一次性完成引用解析和 CSS 变量生成。
- **BREAKING**：`ColorValue` 保持 `string`，一个 `ThemeConfig` 只描述一个主题。需要浅色、深色或其他主题时，分别创建独立配置和独立 system。
- **BREAKING**：`SystemContext` 只包含 `name` 与扁平 `cssVars`；`cssVars` 表示传入配置解析出的颜色变量。不暴露 `colors` 或内部 token record，也不引入按模式分组的返回值。
- 新增 `defaultTokens`、`defaultTheme`，将 `defaultColors` 调整为嵌套默认语义颜色；`defaultColors` 的键集合与 `DefaultColorKey` MUST 保持不变；`defaultSystem` 由 `defaultTheme` 创建。
- 语义颜色支持 primitive 引用，例如 `'{colors.gray.900}'`；primitive token MUST 使用原始颜色字符串，`createTheme` 内部的 `createSystem` 在构建 system 时解析引用并检测未知引用。
- 保持 `defaultColors` 现有属性集合；现有 `accent`、`danger`、`warning`、`success`、`info` 角色键不变；不新增 `neutral` palette、`bg`、`solid-hover`、`solid-active` 等新属性。
- Button 的 `color` 保持 `default | primary | danger`；`default` 使用现有默认角色变量，`primary` 映射 `accent`，`danger` 映射同名 palette。本次不扩展 `ButtonColor`。
- 删除公开 `mergeColors`、`flattenColors`、`defineTokens` 与 `defineColors`；嵌套输入的规范化和颜色展开由 `createSystem` 内部实现。
- `useTheme(system)` 签名保持不变；主题切换由调用方选择不同 system，`data-atelier-theme` 仍作为 system 身份。
- `dist/styles.css` 内置 `defaultSystem` 的 `:where(:root)` 默认颜色回退，`useTheme` 仍负责运行时颜色覆盖和局部主题；不新增 `systemToCss` 公开 API。

## 非目标

- 不在 `ThemeConfig` 内实现浅色/深色模式、主题列表、当前主题或切换函数。
- 不实现自动系统偏好检测、`prefers-color-scheme` 或 `data-atelier-color-mode`。
- 不暴露 `defineTokens`、`defineColors`、`TokenMap`、`ColorMap` 或其他内部规范化 API。
- 不引入完整 recipe、slot recipe、layer style、text style、animation style 或 conditions 引擎。
- 不引入运行时 `css`、`cva`、`sva`、Theme Provider 或 React Context。
- 不把 spacing、radius、shadow、fontSize、controlHeight 等结构 token 纳入 `useTheme` 注入。
- 不引入 breakpoints、响应式 props、grid 或 Slot / asChild。
- 不新增独立 `@omnific/system` workspace package，不新增运行时依赖。
- 不重做现有组件视觉；`default`、`primary`、`danger` 的默认外观应与当前实现保持等价。
- 不新增 `defaultColors` 属性或 `DefaultColorKey` 成员；不新增 `neutral` palette、新的 palette 角色键或 `ButtonColor` 取值。

## 影响范围

- 受影响 capability：`atelier-system`、`atelier-style-architecture`。
- 受影响 package：`packages/atelier`。
- 依赖：不新增运行时依赖，不修改 workspace package 依赖。
- 受影响公开 API：`SystemContext`、`createTheme`、`defaultColors`、`defaultSystem`。`createSystem` 与 `extendTheme` MUST NOT 导出。
- 新增公开 API：`TokenValue`、`TokenGroup`、`TokenDefinition`、`ColorGroup`、`ColorDefinition`、`ThemeConfig`、`defaultTokens`、`defaultTheme`。
- 移除公开 API：`defineTokens`、`defineColors`、`mergeColors`、`flattenColors`、`TokenMap`、`ColorMap`。
- 用户可观察行为：主题配置直接使用嵌套 token / color 结构；不同 `ThemeConfig` 创建不同 system 并分别切换；`defaultColors` 键集合、`DefaultColorKey` 与 Button 颜色角色保持不变；`useTheme`、`data-atelier-theme` 和局部主题模型保持不变。
- 破坏性变更：调用方需要把 `defineTokens` / `defineColors` 包装移除，改为直接传入嵌套配置，并更新 `createTheme`、`defaultColors` 和旧合并工具用法；`defaultColors` 的叶值改为 primitive 引用，但键集合不变。

## 迁移要求

颜色配置由：

```ts
const appTheme = {
  semanticTokens: {
    colors: defineColors({
      bg: { base: '{colors.white}' },
      fg: { base: '{colors.gray.900}' },
    }),
  },
};

const appSystem = createTheme('app', appTheme);
```

调整为：

```ts
const appTheme = {
  semanticTokens: {
    colors: {
      bg: { base: '{colors.white}' },
      fg: { base: '{colors.gray.900}' },
    },
  },
};

const appSystem = createTheme('app', appTheme);
```

主题切换方式保持为在应用层选择不同 system；关键约束是每个 system 必须由独立的主题配置创建，而不是把主题差异写进同一个 `ThemeConfig`：

```ts
const lightTheme = {
  semanticTokens: {
    colors: {
      bg: { base: '{colors.white}' },
      fg: { base: '{colors.gray.900}' },
    },
  },
};

const darkTheme = {
  semanticTokens: {
    colors: {
      bg: { base: '{colors.black}' },
      fg: { base: '{colors.gray.50}' },
    },
  },
};

const lightSystem = createTheme('light', lightTheme);
const darkSystem = createTheme('dark', darkTheme);

const themeRegistry = {
  light: lightSystem,
  dark: darkSystem,
} as const;

const system = themeRegistry[themeName];
```

调用方不得继续依赖 `defineTokens`、`defineColors`、`mergeColors` 或 `flattenColors`。业务需要新增 primitive token 时直接传入嵌套 `tokens.colors`，需要覆盖语义颜色时直接传入嵌套 `semanticTokens.colors`；仓库按现有模块规范直接更新调用方，不保留旧签名、旧返回值结构或兼容转发导出。

## 参考来源

- Chakra UI 仓库：https://github.com/chakra-ui/chakra-ui
- 参考版本：`@chakra-ui/react` 3.37.0
- 固定 commit：`960ae222ace1df8de835dc3c62d698f1b58b6786`
- 许可证：MIT，https://github.com/chakra-ui/chakra-ui/blob/main/LICENSE
- 参考文件：
  - `packages/react/src/theme/index.ts`
  - `packages/react/src/theme/semantic-tokens/colors.ts`
  - `packages/react/src/theme/recipes/button.ts`
  - `packages/react/src/theme/layer-styles.ts`
