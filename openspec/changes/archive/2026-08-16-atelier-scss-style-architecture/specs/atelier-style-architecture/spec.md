## ADDED Requirements

### Requirement: 集中管理 SCSS 样式源码

`@omnific/atelier` MUST 将共享样式基础设施保存在 `packages/atelier/styles`，并将每个组件的样式源码保存在该组件目录下的 `styles` 子目录。每个有样式的组件 MUST 分别维护布局和主题 SCSS 文件，并通过同目录的 `index.scss` 合并；布局文件只负责结构、尺寸、间距与定位，主题文件只负责颜色、字体、边框、阴影和交互状态。

#### Scenario: 导航 Button 样式源码

- **WHEN** 维护者检查 Button 的样式实现
- **THEN** `button/styles/layout.scss` 和 `button/styles/theme.scss` 分别提供布局与主题样式，`button/styles/index.scss` 负责合并，根共享 `styles` 目录中不存在 Button 样式源码

### Requirement: 通过映射解析组件前缀

共享变量文件 MUST 定义 `$component-prefixes` 映射，共享函数文件 MUST 定义 `component-prefixes($component)`。组件样式 MUST 仅通过该函数获得组件类名前缀，不得直接读取映射或硬编码完整组件前缀。

#### Scenario: 编译已注册组件样式

- **WHEN** Button 样式调用 `component-prefixes(button)`
- **THEN** Sass 返回 `atelier-button`，编译产物中的 Button 选择器与 React 渲染类名一致

#### Scenario: 请求未注册组件前缀

- **WHEN** 样式调用 `component-prefixes()` 并传入 `$component-prefixes` 中不存在的组件
- **THEN** Sass 编译通过可识别的错误立即失败，不生成缺少命名空间的选择器

### Requirement: 集中声明 TypeScript 组件前缀

每个 Atelier 组件 MUST 在自身目录的 `constants.ts` 中集中声明 TypeScript 侧 CSS 类名前缀。组件主体及其内部子组件 MUST 复用该组件级常量，不得分别重复调用 `getPrefixCls()` 生成相同前缀。组件级前缀常量 MUST 保持为 package 内部实现，不得仅为复用而加入公共入口或通过组件属性传递。

#### Scenario: Button 内部复用类名前缀

- **WHEN** Button 及其内部 LoadingIcon 构建 CSS 类名
- **THEN** 两者均引用 `button/constants.ts` 导出的 `buttonPrefixCls`，且 Button 目录中只有该文件调用 `getPrefixCls('button')`

### Requirement: 使用浅层 SCSS 嵌套

组件 SCSS SHOULD 在组件根类下使用单层 `&` 嵌套表达 modifier、状态和伪类。复合选择器 MUST 在继续嵌套会降低可读性或改变优先级时保持独立，组件样式 MUST NOT 使用与 DOM 层级绑定的深层嵌套。

#### Scenario: 组织 Button 状态样式

- **WHEN** Button 为尺寸、视觉类型、加载状态或伪类声明样式
- **THEN** 同一根前缀的选择器通过单层 `&` 组织，编译后的选择器与嵌套前保持一致

### Requirement: 构建并发布 CSS 产物

Atelier build MUST 使用 package 自有的 Sass 编译依赖，将只负责聚合组件样式的根 `styles.scss` 编译为单一 `dist/styles.css`。组件目录 MUST NOT 生成或维护 CSS 文件。package MUST 继续通过 `@omnific/atelier/styles.css` 发布编译结果，且消费方 MUST NOT 因导入该入口而需要安装 Sass。

#### Scenario: 构建 Atelier package

- **WHEN** 维护者运行 Atelier build
- **THEN** 构建成功生成包含 Button 布局与主题样式的单一 `dist/styles.css`，源码树只保留根 `styles.scss` 和组件 SCSS

#### Scenario: 消费编译后的样式

- **WHEN** 应用导入 `@omnific/atelier/styles.css`
- **THEN** package resolver 返回已编译 CSS，而不是 SCSS 源码或需要额外预处理的入口
