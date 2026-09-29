# 设计：瘦版 createSystem（仅 ThemeTokens，运行时注入）

## 背景

token 无 TS 单一事实源、无合并能力。参考 Chakra `createSystem` 命名，但去掉 `SystemConfig` 包装与全部 `get*` 方法，首期只合并 `ThemeTokens` 并暴露 CSS 变量表。主题值经运行时 CSS 变量注入，不经 React Context。

## 目标

- `defineTokens` + `createSystem(name, ...tokenSets)` + `cssVars` + `useTheme` + 可供 props 用的 token 类型。

## 非目标

- `SystemConfig`、`getTokenCss` / `TokenDictionary.get*`、utilities、运行时 `css` / recipe、React Theme Provider / Context、独立 `@omnific/system` 包。

## 关键决策

### 1. 包边界

`packages/atelier/system` → `@omnific/atelier/system`。

### 2. 首期 API

```ts
createSystem(name: string, ...tokenSets: ThemeTokens[]): SystemContext

type SystemContext = {
  name: string
  _config: ThemeTokens
  cssVars: Readonly<Record<string, string>>
}

useTheme(system: SystemContext): RefObject<HTMLElement | null>
```

`SystemContext` 仅为 createSystem 返回对象的类型名（对齐 Chakra），**不是** React Context。

### 3. 运行时注入（非 Context）

- `useTheme(system)` 返回对象 ref。
- `useLayoutEffect` 读取 `ref.current`：有元素则挂到该节点，否则挂到 `document.documentElement`；均设置 `data-atelier-theme={system.name}`。
- `<style>` 只挂在 `document.head` 下；以 `system.name` 为 key，值为引用次数；归零时移除。不使用 inline style。

### 4. 扁平 CSS 变量 + 语义色

变量名保持 `--color-bg` 等。`defaultConfig` 含结构 scale 与库默认语义色；业务覆盖：`createSystem('app', defaultConfig, themeTokens)`。

### 5. 与静态样式的关系

库发布用 `styles.css` **只**聚合组件 layout/theme；token 值一律由 `createSystem` + `useTheme` 运行时注入。删除 `_tokens.scss`，避免与 TS tokens 双源漂移。

## 迁移方式

1. system 最小 API（进行中）。
2. `useTheme` 运行时注入；删除 `_tokens.scss`。
3. Box 类型对齐。
4. 验证。
