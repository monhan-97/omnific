# react-icons 规范

## ADDED Requirements

### Requirement: 锁定 Lucide 来源

图标 package MUST 使用 `lucide-icons/lucide` 的一个不可变 commit，作为 React 组件约定与 SVG 图稿的唯一事实来源。package 文档 MUST 为每个复制的图标记录 commit SHA、上游文件路径和本地组件名。

#### Scenario: 审计图标来源

- **WHEN** 维护者检查本地图标组件
- **THEN** 文档标明复制该图标所依据的准确 Lucide commit 和源文件

#### Scenario: 请求升级 Lucide

- **WHEN** package 采用更新的 Lucide revision
- **THEN** 来源 commit、复制的实现、SVG fixture、署名和受影响的图标映射一并更新

### Requirement: 精确使用上游 SVG 图稿

每个本地图标 MUST 渲染与锁定 Lucide commit 中映射图标相同的图稿节点。元素名、元素顺序、path 数据、坐标、半径、点及其他几何属性 MUST 原样复制。本地组件 MUST NOT 添加、删除、近似、优化或重新设计 SVG 图稿节点。

#### Scenario: 渲染 LoadingIcon 图稿

- **WHEN** 渲染未提供自定义 children 的 `LoadingIcon`
- **THEN** 其图稿节点和几何属性与锁定的 Lucide `loader-circle` 来源完全一致

#### Scenario: 上游图标包含多个节点

- **WHEN** 图标定义包含多个 SVG 图稿节点
- **THEN** 本地组件按上游顺序将每个节点恰好渲染一次

#### Scenario: 自定义动画会改变图稿

- **WHEN** 本地实现考虑添加 `animate`、`animateTransform` 或其他非上游 SVG 节点
- **THEN** 不将该节点添加到图标图稿中

### Requirement: 参考组件行为

共享 renderer 和图标组件 MUST 严格遵循锁定 commit 中 `lucide-react` 的实现结构和可观察行为，包括 ref 转发、SVG prop 支持、默认 SVG 属性、children 位置和 `absoluteStrokeWidth` 计算。除非仓库规则或本地 package 标识要求有文档记录的适配，否则本地源码 MUST 保留上游实现风格。上游命名和上游品牌 class 名组合属于明确的本地适配，MUST NOT 复制。

#### Scenario: 使用默认 props

- **WHEN** 渲染未提供 props 的图标
- **THEN** 其根 SVG 使用与锁定 `lucide-react` renderer 相同的默认尺寸、颜色、fill、stroke width、line cap、line join 和 view box

#### Scenario: 提供 SVG props

- **WHEN** 调用方提供标准 SVG props、`size`、`color`、`strokeWidth`、`absoluteStrokeWidth`、`className`、children 或 ref
- **THEN** 组件以与锁定 `lucide-react` 实现相同的可观察行为处理这些输入

#### Scenario: 渲染调用方 class 名

- **WHEN** 渲染本地图标
- **THEN** 其根 SVG 透传调用方提供的 `className`，且不添加上游品牌或图标名称 class token

### Requirement: 本地命名隔离

package 的所有本地文件、目录、组件、函数、变量、类型、导出、package API、生成声明和运行时 class token MUST 使用现有 Omnific 标识。MUST NOT 添加以 `lucide`、`Lucide`、上游 React 实现文件或上游图标组件命名的文件或符号。上游名称 MAY 仅出现在审计文档、必要的许可证署名、来源注释和标识锁定来源的测试 fixture 中。

#### Scenario: 在本地实现参考代码

- **WHEN** 维护者参考上游 renderer、类型、factory 或图标定义
- **THEN** 本地实现保留参考行为和图稿，同时使用项目自有命名和文件边界

#### Scenario: 构建 package

- **WHEN** 维护者检查源文件、生成声明、导出、依赖和渲染的 class token
- **THEN** 除已记录的来源例外外，没有引入任何上游 package、实现文件、符号或品牌命名

### Requirement: 最小本地表面

package MUST 仅实现已导出图标所需、与参考保持一致的共享代码。MUST NOT 将任何 Lucide package 添加为依赖、完整复制上游实现文件、引入通用图标生成器，或公开当前导出不需要的推测性 API。

#### Scenario: 引入共享实现

- **WHEN** 添加本地 renderer 和组件创建 helper
- **THEN** 它们支持 package 当前导出的图标，且不添加未使用的 registry、alias、兼容 wrapper 或生成工具

### Requirement: 上游一致性检查

自动化测试 MUST 检测每个本地图标的渲染图稿与锁定上游来源生成的 fixture 之间的偏移。检查 MUST 覆盖节点类型、节点顺序和全部几何属性；组件行为检查 MUST 覆盖受支持的参考兼容 props 和 ref。

#### Scenario: 在本地修改几何

- **WHEN** path 值、坐标、元素类型或图稿节点顺序与锁定 fixture 不同
- **THEN** 自动化测试失败

#### Scenario: 仅调用方 children 不同

- **WHEN** 调用方通过公开 SVG props 传入 children
- **THEN** 上游图稿保持不变，并按照锁定 `lucide-react` renderer 的行为放置 children
