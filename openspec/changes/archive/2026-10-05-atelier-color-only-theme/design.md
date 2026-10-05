# 设计：Atelier 颜色系统与静态结构样式边界

## 背景

当前实现把全部 token 放进 TypeScript，再由 `useTheme` 注入 CSS 变量。这个模型对颜色是合理的，因为颜色需要运行时切换和局部覆盖；但结构 token 不需要运行时切换，继续注入会扩大 `SystemContext`、样式节点内容和组件 props 的职责范围。

本次设计保留 `useTheme` 的 ref 注入模式，只缩小它负责的数据边界。

## 目标

- `useTheme(system)` 继续作为唯一的主题注入入口。
- `system` 只描述扁平颜色。
- 组件只通过 `--color-*` 消费主题颜色。
- 结构尺寸、间距、圆角、字体和阴影由静态 SCSS 消费。
- 组件目录和样式职责保持 Radix 风格，但不引入 `Theme` 组件。

## 非目标

- 不实现 Theme Provider / React Context。
- 不实现新的 CSS-in-JS 运行时。
- 不把组件样式集中到一个全局 recipe 文件。
- 不改变组件视觉结果，除非现有样式错误依赖了具体色相 token。

## 关键决策

### 1. 保留 ref 加 style 的 useTheme

`useTheme(system)` 继续返回对象 ref。ref 指向元素时把颜色变量注入该子树，未挂载时注入 `document.documentElement`。颜色变量继续通过 `document.head` 下的 `<style>` 复用，并以引用次数管理生命周期。

该决策直接保留当前注入模型，不引入 `Theme` wrapper。组件库仍然通过 hook 使用主题。

### 2. 颜色配置使用完全扁平的结构

颜色对象的键就是语义颜色名，不再保留 `colors` 分类层。函数参数可以抽象为两个简单契约，颜色键仍由 `defineColors` 自动推导：

```ts
type ColorValue = {
  value: string;
};

type ColorSet = Record<string, ColorValue>;

const darkColors = defineColors({
  bg: { value: '#18181b' },
  fg: { value: '#fafafa' },
  'accent-solid': { value: '#3b82f6' },
  'accent-hover': { value: '#60a5fa' },
  'accent-active': { value: '#2563eb' },
  'accent-contrast': { value: '#ffffff' },
});

const darkSystem = createSystem('dark', darkColors);
```

`ColorValue` 与 `ColorSet` 只用于约束函数参数，不作为颜色键联合或返回值类型的事实源。

选择完全扁平的原因：

- 当前只有颜色这一种运行时 token，分类层没有实际价值。
- 扁平键可以直接映射为 `--color-${key}`，不需要分类前缀表。
- 合并、覆盖、类型推导和 Storybook 示例都更直接。
- 嵌套结构会鼓励继续把组件状态和结构 token 塞进 system。

### 3. createSystem 返回值只保留颜色结果

`createSystem` 不声明新的返回类型，直接返回 `name`、`colors`、`cssVars`，由 TypeScript 自动推导。`SystemContext` 只作为 `applyCssVars` / `useTheme` 的函数参数契约：

```ts
type SystemContext = {
  name: string;
  colors: ColorSet;
  cssVars: Readonly<Record<string, string>>;
};

const darkSystem = createSystem('dark', darkColors);
```

`colors` 只包含扁平颜色表，`cssVars` 只允许包含颜色变量。下游不能从 `SystemContext` 推导 spacing、radii 或 control height，也不能用它替代 `keyof typeof defaultColors`。

### 4. 结构变量由静态 SCSS 提供

`packages/atelier/styles/_foundation.scss` 负责声明：

```scss
:root {
  --space-4: 16px;
  --radius-md: 6px;
  --font-size-md: 14px;
  --control-height-md: 32px;
  --shadow-sm: 0 2px 4px rgb(24 24 27 / 0.1);
}
```

`styles/index.scss` 必须先加载 foundation，再加载组件样式。该文件只包含非颜色结构 token，不得包含语义颜色色板。组件样式可以直接消费这些静态变量。

TS 侧另保留一份共享 `styles/foundation.ts`，只描述 spacing、radius、shadow 的 token 名与 class 后缀，用于 props 类型和 class 拼接。它不持有 CSS 值，也不得被复制到 Box 或其他组件目录；实际颜色值之外的样式值仍只存在于 `_foundation.scss`。

### 5. 颜色使用语义 token

组件主题样式不得依赖具体色相：

```scss
// 不推荐
color: var(--color-blue-solid);

// 推荐
color: var(--color-accent-solid);
```

主题枚举或业务 system 负责把 `accentColor` 映射为 `--color-accent-*`。组件不需要知道当前强调色是 blue、red 还是自定义品牌色。

状态色同样使用语义角色：

- `--color-danger-*`
- `--color-warning-*`
- `--color-success-*`
- `--color-info-*`

### 6. 枚举与结构属性

主题枚举只选择颜色 system：

```ts
const system = appearance === 'dark' ? darkSystem : lightSystem;
const themeRef = useTheme(system);
```

组件结构枚举继续映射静态 class：

```tsx
<Button size="large" shape="round" />
```

`size`、`shape`、radius、scaling 等不得改变 `createSystem` 返回对象的 `cssVars`，也不得导致 `useTheme` 重新注入结构变量。`Box` 的 `p`、`px`、`py`、`rounded`、`shadow` 同理，使用组件目录下的静态 class。

### 7. 目录与 Radix 风格边界

保留一组件一目录：

```text
packages/atelier/
  system/
    create-system.ts
    css-vars.ts
    define-colors.ts
    merge-colors.ts
    use-theme.ts
    defaults/
      colors.ts
  styles/
    _foundation.scss
    _variables.scss
    _functions.scss
    index.scss
  button/
    Button.tsx
    styles/
      layout.scss
      theme.scss
      index.scss
  box/
    Box.tsx
    styles/
      layout.scss
      theme.scss
      index.scss
```

不设置 `Theme` 组件，不新增组件状态 recipe 引擎。共享 `system` 只处理颜色，共享 `styles` 只处理静态基础和组件聚合。

## 备选方案

### 方案 A：继续注入全部 token

优点是单次 `useTheme` 可以覆盖所有变量；缺点是结构 token 没有运行时切换需求，却扩大了公开 API、样式节点和测试面，也使主题配置无法保持扁平。

### 方案 B：引入 Theme 组件

Theme 组件可以简化 ref 使用方式，但用户当前明确要求保留 `useTheme`，且该方案会改变现有组件库使用方式，因此不采用。

### 方案 C：保留 colors 分类层

`{ colors: { bg: ... } }` 可以提供视觉分组，但当前只有颜色一种运行时 token，分类层只增加一次间接层。采用完全扁平配置。

## 风险与处理

- **颜色迁移不完整**：会导致新 system 缺少现有组件需要使用的语义变量。处理方式是让组件 props 使用 `keyof typeof defaultColors` 自动推导，并让组件只引用该集合。
- **旧调用方继续使用 `_config` 或 `defaultConfig`**：这是 BREAKING。处理方式是更新仓库内全部调用方、示例和文档，不保留兼容导出。
- **静态 foundation 与颜色 system 重名**：通过测试和命名检查确保 foundation 只包含非颜色变量，`createSystem` 返回对象的 `cssVars` 只包含 `--color-*`。
- **focus ring 和 shadow 含颜色**：focus ring 颜色通过静态 CSS 的 `color-mix()` 引用 `--color-*`；中立阴影保留静态色值，不进入运行时 system。
- **SSR 与首屏**：继续使用当前 `useLayoutEffect` + `<style>` 模型，不扩大本次变更范围。

## 测试策略

- 单元测试覆盖扁平颜色合并、覆盖顺序、CSS 变量生成。
- 单元测试验证 `useTheme` 只注入 `--color-*`。
- 单元测试验证未绑定 ref 时注入 `documentElement`，绑定 ref 时注入目标元素。
- 单元测试验证同一 `system.name` 的 `<style>` 复用和卸载。
- 样式构建验证 `dist/styles.css` 包含静态 foundation 变量。
- 组件测试验证 Button 语义颜色 class 和 Box 静态结构 class。
