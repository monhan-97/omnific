# 变更：建立 Atelier SCSS 样式架构

## Why

`@omnific/atelier` 当前直接维护 CSS 文件，组件类名前缀在多份样式中重复写入，新增组件时容易出现 TypeScript 类名与样式选择器不一致。布局与主题样式也分散在组件目录和 package 根目录，缺少统一的样式源码入口与可验证的前缀注册机制。

## What Changes

- 将共享样式基础设施保留在 `packages/atelier/styles`，将各组件样式放在对应组件目录的 `styles` 子目录，并继续拆分为布局与主题文件。
- 使用 SCSS 替代手写 CSS 源码，每个组件通过 `styles/index.scss` 合并布局与主题，根 `styles.scss` 只负责聚合组件样式并编译为单一 `dist/styles.css`。
- 在共享变量文件中新增 `$component-prefixes` 映射，并通过 `component-prefixes()` 函数读取组件类名前缀。
- 在组件目录的 `constants.ts` 中集中声明 TypeScript 侧组件前缀，组件及其内部子组件复用同一常量。
- 要求组件样式不得直接写入组件根类名前缀；未注册的组件前缀在 Sass 编译阶段直接报错。
- 在 package 构建中使用 `sass-embedded` 生成单一 CSS，保持 `@omnific/atelier/styles.css` 消费入口不变。

## 非目标

- 不引入运行时主题生成器或可配置 CSS 类名前缀。
- 不将 SCSS 源码公开为 package API，也不要求消费项目安装 Sass。
- 不改变 Button 的视觉表现、React 属性或现有 `styles.css` 导入方式。

## 影响范围

- 受影响的 capability：`atelier-style-architecture`
- 受影响的 package：`packages/atelier`
- 新增开发依赖：`sass-embedded@1.100.0`
- 公开 API 无破坏性变化；发布产物仍通过 `@omnific/atelier/styles.css` 提供 `dist/styles.css`。
