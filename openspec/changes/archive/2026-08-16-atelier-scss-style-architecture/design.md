# 设计：Atelier SCSS 样式架构

## 背景

Atelier 需要为后续组件提供稳定的全局 CSS 命名空间。React 侧已经通过 `getPrefixCls()` 生成 `atelier-<component>` 类名，样式侧需要同样集中管理组件前缀，同时避免把 SCSS 编译责任转移给 package 消费者。

## 目标

- 将共享样式基础设施与组件样式集中到一个可导航目录。
- 让每个组件样式只能通过注册映射获得类名前缀。
- 保持布局与主题职责分离。
- 在 package 构建期间生成可直接发布和消费的 CSS。

## 非目标

- 不建立跨 TypeScript 与 SCSS 的代码生成器。
- 不公开 `$component-prefixes` 或 `component-prefixes()` 供 package 消费者使用。
- 不在本次变更中重做 Button 设计令牌或视觉样式。

## 关键决策

### 1. 共享基础设施与组件样式分层

样式源码采用以下结构：

```text
packages/atelier/styles/
├── _variables.scss
└── _functions.scss

packages/atelier/button/styles/
├── index.scss
├── layout.scss
└── theme.scss

packages/atelier/styles.scss
```

共享 `styles/` 只包含映射和函数等 Sass partial。组件目录中的 `styles/` 包含该组件的布局、主题和 SCSS 聚合入口，组件样式不会集中堆放到共享目录。

### 2. 映射是样式前缀的唯一来源

`$component-prefixes` 保存组件标识到完整 CSS 类名前缀的映射。`component-prefixes($component)` 使用 Sass `map.get()` 读取映射，并在组件未注册时通过 `@error` 中止编译。

组件样式先调用 `component-prefixes(button)` 得到局部 `$prefix-cls`，再通过插值生成全部选择器和动画名称。组件样式不得直接访问 `$component-prefixes`，也不得硬编码 `atelier-button`。

同一组件根类的 modifier、状态和伪类使用单层 Sass `&` 嵌套，减少前缀重复。跨状态的复合选择器保持独立，避免为了缩短文本引入多层嵌套或改变选择器优先级。

### 3. 集中声明 TypeScript 组件前缀

TypeScript 侧仍由 `getPrefixCls()` 生成完整类名前缀，但每个组件只在自身目录的 `constants.ts` 中调用一次。组件主体和内部子组件引用同一个组件级常量，例如 Button 统一使用 `buttonPrefixCls`，避免在多个模块中重复声明相同前缀。

组件级前缀常量属于实现细节，不从 package 公共入口导出，也不作为 prop 在内部组件之间传递。

### 4. 发布编译后的聚合 CSS

`sass-embedded` 作为 Atelier 的开发依赖，在 TypeScript 构建后将只负责聚合组件样式的根 `styles.scss` 编译为单一 `dist/styles.css`。组件目录不生成或维护 CSS 文件，package 只发布 `dist` 中的编译结果，因此消费方继续导入 `@omnific/atelier/styles.css`，不需要 Sass 工具链。

## 备选方案

- 保留普通 CSS：不能提供映射查询和未知组件的编译期校验，拒绝。
- 将所有组件样式集中在根 `styles/`：组件源码与样式距离过远，无法清晰表达组件边界，拒绝。
- 从 TypeScript 生成 SCSS 映射：当前只有一个组件，会增加生成脚本和同步流程，不符合最小实现，暂不采用。

## 风险与缓解

- TypeScript 与 SCSS 仍分别声明根前缀。构建后的 CSS 选择器和 Button DOM 类名通过测试与产物检查保持一致；只有出现多个无法人工维护的前缀来源时才考虑代码生成。
- 新增 Sass 编译步骤会增加构建时间。使用仓库已有版本的 `sass-embedded`，并只编译一个入口以控制成本。

## 迁移方式

1. 删除旧的 CSS 源文件并迁移到对应组件的 `styles` 目录。
2. 在 `button/constants.ts` 声明 `buttonPrefixCls`，让 Button 及其内部子组件共享该常量。
3. 注册 Button 前缀并让组件样式通过函数获取。
4. 将 Sass 编译接入 package build，通过只负责导入的根 `styles.scss` 生成单一 `dist/styles.css`。
5. 保持 README 和 package export 中的消费路径不变。
