# 变更：使图标行为与可审计的上游参考保持一致

## 变更原因

`packages/icons` 当前自行维护 SVG 标记和组件行为，却没有可审计的上游参考。这会使渲染后的图标几何与行为发生偏移，并产生不必要的实现决策维护成本。

## 变更内容

- 仅将 `lucide-icons/lucide` 用作图标 SVG 几何与 React 组件行为的可审计参考。
- 引用源码前锁定一个上游 commit，使采用的每项行为和图稿节点都可审计、可复现。
- 严格参考共享 SVG 默认值、ref 转发、prop 处理、children 位置和组件创建结构的实现。
- 所有本地文件、组件、类型、函数、导出、CSS class token 和 package API 均沿用 Omnific 命名体系；不得把上游文件名或符号名复制到项目代码中。
- 将每个本地图标映射到明确的上游 Lucide 图标，并原样复制其 SVG 节点数据。
- 将 `LoadingIcon` 映射到 Lucide 的 `loader-circle` 图稿，并移除本地自定义的 SVG 动画标记。
- 添加聚焦检查，将本地渲染的 SVG 结构与锁定上游源码生成的 fixture 对比。
- 记录上游来源、锁定 commit、图标映射、有意的命名适配和许可证署名。

## 影响范围

- 受影响的 capability：`react-icons`
- 受影响的 package：`packages/icons`
- 现有 `LoadingIcon` 导入保持有效，但其图稿几何与可审计参考一致，并且不再包含内嵌 SVG 动画。
- 不向依赖或分发文件添加任何 Lucide package。上游仓库名、文件名、图标名和符号名仅出现在审计文档、源码署名和必须明确来源的测试 fixture 中。
- 运行时 DOM 不输出上游品牌 class 名；调用方提供的 `className` 继续原样透传。
