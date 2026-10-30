# 设计：单配置单主题与 primitive token 分层

## 背景

`packages/atelier/system` 当前以扁平颜色为核心：`createSystem('app', defaultColors, customColors)` 合并字符串颜色，`useTheme` 注入 `--color-*`。这个模型简单，但 `defaultColors` 同时承担 primitive 色阶、语义色和 palette 角色，组件难以复用统一颜色契约。

主题切换不应成为 `ThemeConfig` 的一部分。一个配置只描述一个主题；浅色、深色、暖色或品牌主题都应由各自的配置创建各自的 system。应用层只负责选择当前 system。

Chakra UI 最新主题提供了可借鉴的分层：

- `tokens.colors` 保存原始色阶。
- `semanticTokens.colors` 保存 `bg`、`fg`、`border` 和 palette 角色。
- 组件只消费语义 token 和 palette 角色。

参考来源：

- 仓库：https://github.com/chakra-ui/chakra-ui
- 参考版本：`@chakra-ui/react` 3.37.0
- commit：`960ae222ace1df8de835dc3c62d698f1b58b6786`
- 源文件：`packages/react/src/theme/index.ts`、`packages/react/src/theme/semantic-tokens/colors.ts`、`packages/react/src/theme/recipes/button.ts`
- 许可证：MIT。若实现直接复制 Chakra 源码片段，必须保留对应版权与许可证声明。

## 目标

- 建立 primitive tokens → semantic tokens 的颜色分层。
- 保持现有 `default`、`primary`、`danger` Button 颜色角色和 `defaultColors` 键集合不变，只建立 primitive 与 semantic 分层。
- 保留 `useTheme` 的 ref 注入、局部主题和 `<style>` 引用计数模型。
- 通过不同 `ThemeConfig` 创建不同 system 来表达主题切换。
- 保留结构 token 由静态 SCSS 提供的边界。

## 非目标

- 不在 `ThemeConfig` 内实现 `mode`、`colorMode`、`themes`、`currentTheme`、`setTheme` 或类似字段。
- 不实现浅色/深色模式切换、系统偏好检测或 `data-atelier-color-mode`。
- 不公开 `defineTokens`、`defineColors`、`TokenMap`、`ColorMap` 等内部规范化 API。
- 不实现 Chakra 的完整 recipe / slot recipe / layer style / text style / animation style 引擎。
- 不引入 CSS-in-JS、React Context 或 Theme Provider。
- 不把结构 token 写入 `SystemContext` 或运行时样式节点。
- 不支持 breakpoints、响应式 props、grid、Slot / asChild。
- 不支持任意透明度修饰符；首期只支持显式 token 引用。
- 不新增运行时依赖。

## 关键决策

### 1. 一个配置只描述一个主题

`ThemeConfig` 只包含嵌套颜色定义：

```ts
type TokenValue = string;
type TokenGroup = Record<string, TokenValue>;
type TokenDefinition = Record<string, TokenValue | TokenGroup>;

type ColorValue = string;
type ColorGroup = Record<string, ColorValue>;
type ColorDefinition = Record<string, ColorGroup>;

type ThemeConfig = {
  tokens?: {
    colors?: TokenDefinition;
  };
  semanticTokens?: {
    colors?: ColorDefinition;
  };
};
```

`ThemeConfig` MUST NOT 包含：

```ts
// 不这样设计
{
  mode: 'light',
  colorMode: 'dark',
  themes: { light: ..., dark: ... },
  currentTheme: 'light',
  setTheme: () => {},
}
```

需要多个主题时，分别定义配置：

```ts
const lightTheme: ThemeConfig = {
  semanticTokens: {
    colors: {
      bg: { base: '{colors.white}' },
      fg: { base: '{colors.gray.900}' },
    },
  },
};

const darkTheme: ThemeConfig = {
  semanticTokens: {
    colors: {
      bg: { base: '{colors.black}' },
      fg: { base: '{colors.gray.50}' },
    },
  },
};
```

`createSystem` 只负责把传入的配置层合并成一个 system。实现上不构造中间 `ThemeConfig`，而是在单次配置遍历中直接合并 `tokens` 与语义颜色，最后统一解析引用并生成扁平 `colors` 与 `cssVars`：

```ts
const appSystem = createTheme('app', appTheme);
```

### 2. 主题切换发生在 system 层

主题注册表和当前主题状态属于应用层，不属于 `ThemeConfig`：

```ts
const lightSystem = createTheme('light', lightTheme);
const darkSystem = createTheme('dark', darkTheme);
const warmSystem = createTheme('warm', warmTheme);

const themeRegistry = {
  light: lightSystem,
  dark: darkSystem,
  warm: warmSystem,
} as const;

const system = themeRegistry[themeName];

const themeRef = useTheme(system);
```

`useTheme(system)` 签名保持不变。切换主题只改变传入的 system，`data-atelier-theme` 从 `light` 切换为 `dark` 或 `warm`，不需要额外的模式属性。

### 3. 颜色分为 primitive 与 semantic 两层

`tokens.colors` 保存原始色阶，例如：

```ts
const defaultTokens: TokenDefinition = {
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    900: '#18181b',
    950: '#111111',
  },
  accent: {
    500: '#1677ff',
    600: '#0958d9',
  },
};
```

`semanticTokens.colors` 保存组件可消费的语义颜色：

```ts
const defaultColors: ColorDefinition = {
  bg: {
    base: '{colors.white}',
    muted: '{colors.gray.100}',
  },
  fg: {
    base: '{colors.gray.900}',
    muted: '{colors.gray.600}',
  },
};
```

primitive token 只作为解析来源，不作为组件直接消费的公开颜色契约。组件 MUST 只消费 semantic token，避免依赖 `gray`、`red` 等具体色相。首期 `defaultTokens` MUST 使用嵌套 token 结构，只声明默认语义颜色实际引用的色阶，MUST NOT 预先保留未使用的完整 50–950 色板。`info` MUST 使用独立的 `info.*` primitive token，避免品牌 `accent` 变化时把状态提示色一起改掉。

### 4. createSystem 内部完成合并、解析和 CSS 变量生成

`createSystem` 接收嵌套 `ThemeConfig`，内部按以下顺序处理：

1. 使用同一个 `for...of` 遍历全部 `ThemeConfig`：`mergeTokenDefinition` 把嵌套 token 直接写入扁平 token record，`mergeColorDefinition` 合并嵌套 color groups。
2. 循环结束后，全部 token 覆盖已经确定。
3. 调用一次 `resolveColors`，在 group/key 双循环中通过 `tokens[reference]` 解析引用，并同时生成扁平 colors 与 cssVars。

`flattenColors` MUST 在一次双循环内完成以下结果：

```ts
{
  colors: {
    bg: '#ffffff',
    'bg-muted': '#f4f4f5',
    'accent-solid': '#1677ff',
  },
  cssVars: {
    '--color-bg': '#ffffff',
    '--color-bg-muted': '#f4f4f5',
    '--color-accent-solid': '#1677ff',
  },
}
```

实现 MUST NOT 再拆出 `resolveSystemColors` 等第二步颜色遍历。primitive token 的值 MUST 是原始颜色字符串，MUST NOT 继续引用其他 token。未知引用 MUST 在创建 system 时抛出可识别错误，不能静默生成无效 CSS 变量。

### 5. SystemContext 保持扁平

`SystemContext` 不引入颜色模式维度：

```ts
type SystemContext = {
  name: string;
  colors: Readonly<Record<string, string>>;
  cssVars: Readonly<Record<string, string>>;
};
```

`DefaultColorKey` MUST 由构建脚本基于 `defaultSystem.colors` 生成到 `system/defaults/color-keys.gen.ts`，保证 `Box` 的 `bg`、`borderColor` 等 props 跟随默认语义颜色。生成文件 SHOULD 保持扁平字符串联合，类型层 MUST NOT 使用递归 flatten 推导默认颜色键。

### 6. Color Palette 复用现有角色契约

`defaultColors` MUST 保持现有语义键集合不变，不新增 `neutral` palette，也不新增 `bg`、`solid-hover`、`solid-active` 等角色键。现有 `accent`、`danger`、`warning`、`success`、`info` 继续使用当前角色键：

- `contrast`
- `fg`
- `subtle`
- `muted`
- `emphasized`
- `solid`
- `hover`
- `active`
- `focus-ring`
- `border`

组件继续通过 `data-color` 选择现有角色：

```scss
:where([data-color='default']) {
  @include default-color-role;
}

:where([data-color='primary']) {
  @include color-role(accent);
}

:where([data-color='danger']) {
  @include color-role(danger);
}
```

Button 的公开 `color` 类型保持 `default | primary | danger`。`default` 继续使用现有默认角色变量，`primary` 映射 `accent`，`danger` 映射同名 palette。solid 变体继续通过 `solid`、`hover`、`active` 生成角色变量；本次不扩展 `ButtonColor`，也不引入新的默认颜色属性。

### 7. 结构 token 继续由静态 SCSS 提供

本变更只扩展颜色层。`--space-*`、`--radius-*`、`--font-*`、`--font-size-*`、`--control-height-*`、`--shadow-*` 继续由 `packages/atelier/styles/tokens/*.scss` 声明，不进入 `createSystem` 返回值，也不由 `useTheme` 注入。

### 8. 不引入完整 recipe 引擎

Atelier 当前只有少量组件，且样式由 SCSS 管理。首期只借鉴 recipe 的“角色契约”思路：

- palette 通过共享角色变量表达。
- variant 和 size 继续使用静态 class。
- hover、active、disabled、focus-visible 继续在组件 theme SCSS 中维护。
- 不新增运行时 style resolver、`css`、`cva` 或 `sva`。

等 Card、Field、Dialog 等复合组件出现后，再单独提案 slot recipe 或组件样式契约。

### 9. 默认主题静态输出

`dist/styles.css` MUST 在结构样式之前包含由 `defaultSystem.cssVars` 生成的 `:where(:root)` 默认颜色规则。该选择器特异性为 0，自定义 system 的 `[data-atelier-theme]` 规则 MUST 能覆盖它；未覆盖的语义 key 继续继承默认值。静态默认颜色与 `useTheme` 运行时颜色注入 MUST 共用同一套 `cssVars`，结构 token 边界不变；不新增 `systemToCss` 公开 API。

## 备选方案

### 方案 A：把模式写进 ThemeConfig

例如在同一配置中使用 `mode`、`themes` 或 `{ light, dark }` 叶值。实现会引入模式维度、组合规则和切换状态，但当前需求是“不同配置切换主题”，因此拒绝。

### 方案 B：直接引入 Chakra 的完整 styled-system

能力最完整，但会引入 Emotion/Panda 依赖、运行时开销和新的主题 Provider 模型，与 Atelier 当前 CSS-first 架构冲突。拒绝。

### 方案 C：保留当前扁平颜色，只增加颜色

实现成本最低，但无法建立 primitive 与 semantic 边界，也无法让调用方区分原始色与语义颜色。拒绝。

### 方案 D：公开 defineTokens / defineColors

可以让调用方预先规范化颜色，但会增加公开 API、两套表示和类型理解成本。当前 `ThemeConfig` 足够小，由 `createSystem` 内部规范化更简单，因此拒绝。

## 风险与迁移

- 公开主题构造入口从 `createSystem` 迁移为 `createTheme`，`createSystem` 与 `extendTheme` 不再导出；`defaultColors`、`SystemContext`、`mergeColors`、`flattenColors`、`defineTokens` 和 `defineColors` 相关签名或导出会变化，属于 BREAKING。
- 自定义主题需要从包装函数迁移到嵌套 `ThemeConfig`。
- 需要同步更新 Storybook、system examples、Box 类型和所有默认颜色引用。
- 每个主题需要提供完整或可覆盖的语义配置；多个主题应共享 primitive tokens 和基础主题配置，避免重复。
- 同名 system 仍共享样式节点；本次不改变该行为，但文档和测试必须明确 name 即主题身份。
- 若实现直接复制 Chakra 源码，必须补充 MIT 许可证和版权声明；首期应优先自行实现，避免复制大段源码。
