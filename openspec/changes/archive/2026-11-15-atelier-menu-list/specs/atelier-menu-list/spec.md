# Atelier MenuList 规格增量

## Purpose

定义 `@omnific/atelier` 新增 MenuList、`useListNavigation` 与 `useTypeahead` 的公开 API、焦点模型、键盘行为、MenuItem 注册约定和实现边界。MenuList 负责引用并组合 navigation hooks；hooks 负责纯导航算法；MenuItem 负责语义、ref 和自身视觉状态。

## ADDED Requirements

### Requirement: 提供 Floating UI 同名导航 hooks

`@omnific/atelier/menu`、`@omnific/atelier/navigation` 与 `@omnific/atelier` 主入口 MUST 导出 `useListNavigation`、`useTypeahead` 及其 options 与辅助类型。

两个 hook MUST 使用与 Floating UI 对应 hook 相同的名称和核心能力；为适配 MenuList 的 store 注册模型，选项使用 getter 形式：

- `useListNavigation`：`getActiveIndex`、`getElement`、`getSize`、`onNavigate`、`enabled`、`loop`、`orientation`、`disabledIndices`
- `useTypeahead`：`getActiveIndex`、`getSelectedIndex`、`getLabels`、`onMatch`、`enabled`、`resetMs`、`findMatch`、`ignoreKeys`、`onTypingChange`

实现 MUST NOT 依赖 `@floating-ui/react`、MUI、Emotion 或其他运行时焦点管理库。

#### Scenario: 导入公开 hooks

- **WHEN** 使用方从 `@omnific/atelier/menu` 或 `@omnific/atelier/navigation` 导入 `useListNavigation` 与 `useTypeahead`
- **THEN** 两个 hook 及其类型可从对应入口使用
- **AND** 主入口提供相同导出

### Requirement: useListNavigation 提供列表导航

`useListNavigation` MUST 返回容器事件、item props 和命令式聚焦能力，至少包含：

```ts
onFocus;
onKeyDown;
getItemProps(index);
focusIndex(index);
```

它 MUST：

- 根据 `getActiveIndex` 返回的索引与 `onNavigate` 同步逻辑焦点。
- 支持 `ArrowUp`、`ArrowDown`、`Home`、`End`。
- 支持 `orientation`、`loop` 和 `disabledIndices`。
- 跳过 disabled 或不可用项，并在 `getActiveIndex` 返回越界索引时安全回退。
- 通过 `getElement` 按索引取得真实 DOM element，并调用 `focus({ preventScroll: true })`。
- 提供 `onFocus` / `onKeyDown` / `getItemProps`，让 MenuList 通过组合方式接入事件。

#### Scenario: 方向键移动焦点

- **WHEN** MenuList 中某个 MenuItem 持有焦点，用户按下 `ArrowDown`
- **THEN** 焦点移动到下一个可用 MenuItem
- **AND** `useListNavigation` 的 `onNavigate` 收到新的索引

#### Scenario: 循环与禁用项

- **WHEN** `loop=true` 且焦点位于最后一个可用项，用户按下 `ArrowDown`
- **THEN** 焦点回到第一个可用项
- **AND** `disabledIndices` 中的项不会被聚焦

### Requirement: useTypeahead 提供字符搜索

`useTypeahead` MUST 使用 ref 维护输入字符串、重置计时器和上一次匹配项，并返回可合并到菜单容器的 props。

它 MUST：

- 默认 `resetMs=750`，与 Floating UI 对应 hook 一致。
- 从 `getSelectedIndex` 或当前 active item 之后开始轮转查找。
- 支持前缀匹配、连续相同字符循环和未匹配时的安全回退。
- 支持 `findMatch`、`ignoreKeys`、`getLabels`、可选的 `getSelectedIndex`、修饰键过滤和输入法组合状态保护。
- 返回 `onKeyDown` / `onKeyUp`；`onKeyUp` 在空格释放时结束输入状态。
- 通过 `onMatch` 通知调用方，不直接修改 activeIndex。

#### Scenario: 输入字符定位

- **WHEN** 焦点在菜单内，用户输入 `co`
- **THEN** hook 找到以 `co` 开头的可用项
- **AND** 调用 `onMatch` 返回匹配索引

#### Scenario: 超时重置

- **WHEN** 用户输入字符后超过 `resetMs` 没有继续输入
- **THEN** 搜索字符串被清空
- **AND** 下一次输入重新开始匹配

### Requirement: MenuList 负责引用和组合 hooks

`MenuList` MUST 由自身维护 `ListCollection` store（DOM 顺序、索引和标签）、`ListState` store（active index 与选中项）以及 MenuItem 注册表，并 MUST 引用 `useListNavigation` 与 `useTypeahead` 完成键盘导航。

MenuList MUST NOT 在组件内重复实现方向键、Home/End、循环或 typeahead 算法。

MenuList 根节点 MUST：

- 渲染 `role="menu"`。
- 设置 `aria-orientation="vertical"`。
- 设置 `tabIndex=-1`。
- 合并 hooks 提供的 `onKeyDown` / `onFocus` 与用户传入的处理函数。

`role`、`aria-orientation` 与 `tabIndex` MUST 允许使用方覆盖。`aria-orientation` 为 `horizontal` 时，方向键导航 MUST 使用 `ArrowLeft` / `ArrowRight`；默认 `vertical` 时使用 `ArrowUp` / `ArrowDown`。

MenuList MUST 支持 `size`、`selectedKey`、`defaultSelectedKey`、`onSelect`、`onKeyDown`、`onFocus`、`onKeyUp`、`onClick`、原生 div props 和 ref。

#### Scenario: 组合 hooks

- **WHEN** 使用方渲染 `<MenuList><MenuItem>首页</MenuItem></MenuList>`
- **THEN** MenuList 根节点具有 `role="menu"`、`aria-orientation="vertical"` 和 `tabIndex="-1"`
- **AND** 键盘导航由 `useListNavigation` 计算
- **AND** 字符搜索由 `useTypeahead` 计算

#### Scenario: 水平方向导航

- **WHEN** 使用方传入 `aria-orientation="horizontal"` 且某个 MenuItem 持有焦点
- **THEN** `ArrowRight` / `ArrowLeft` 移动焦点
- **AND** `ArrowDown` / `ArrowUp` 不触发列表导航

#### Scenario: 用户事件合并

- **WHEN** 使用方给 MenuList 传入 `onKeyDown`
- **THEN** MenuList 先执行内部 hook 处理，再调用用户 `onKeyDown`
- **AND** 用户可以通过事件状态决定后续行为

### Requirement: MenuList 支持受控与非受控单选

`MenuList` MUST 支持 `selectedKey`、`defaultSelectedKey` 与 `onSelect`，并通过 MenuItem 的 `value` 识别可选项。

- `selectedKey` 不为 `undefined` 时进入受控模式；点击带 `value` 的 MenuItem MUST NOT 修改内部选中值，只调用 `onSelect`。
- `selectedKey` 为 `undefined` 时使用 `defaultSelectedKey` 作为初始值，并在点击后更新内部选中值。
- 未提供 `value` 的 MenuItem 不参与列表选中，MenuItem 自身的 `selected` 继续控制视觉状态。
- MenuList 内提供 `value` 的 MenuItem，其选中状态 MUST 由 `selectedKey` 覆盖。
- 点击当前已选中的项 MUST NOT 重复触发 `onSelect`。
- `role="menuitemradio"` 或 `role="menuitemcheckbox"` 时，选中状态 MUST 映射到 `aria-checked`。
- MenuList MUST NOT 提供多选；`selectedKey` 保持单值。

#### Scenario: 非受控选中

- **WHEN** 使用方渲染 `<MenuList defaultSelectedKey="home"><MenuItem value="home">首页</MenuItem></MenuList>`
- **THEN** 首页 MenuItem 输出 selected 状态
- **AND** 点击另一个带 `value` 的 MenuItem 后内部选中值更新并调用 `onSelect`

#### Scenario: 受控选中

- **WHEN** 使用方传入 `selectedKey="home"` 并点击另一个带 `value` 的 MenuItem
- **THEN** `onSelect` 收到新的 key
- **AND** 在 `selectedKey` 更新前，首页 MenuItem 仍保持选中

#### Scenario: 已选中项不重复触发

- **WHEN** 点击当前 `selectedKey` 对应的 MenuItem
- **THEN** `onSelect` 不被调用

### Requirement: MenuList 尺寸继承

MenuList MUST 接受 `size: 'small' | 'default' | 'large'`，默认 `'default'`。

MenuList MUST 在根节点输出 `data-size`，并通过 CSS 自定义属性向内部 MenuItem 传播尺寸：

- `--menu-item-height`
- `--menu-item-padding-inline`
- `--menu-item-font-size`

MenuItem MUST 使用这些变量并提供 default fallback。MenuItem 自身的 `size="small" | "large"` MUST 通过局部覆盖同名变量优先于 MenuList；`size="default"` MUST 保留列表继承值，独立使用时回退到默认尺寸。

#### Scenario: 列表尺寸继承

- **WHEN** 使用方渲染 `<MenuList size="small">`，内部 MenuItem 未覆盖 size
- **THEN** MenuItem 使用 small 高度和 inline padding
- **AND** MenuList 根节点具有 `data-size="small"`

#### Scenario: 单项覆盖

- **WHEN** `MenuList size="large"` 内的某个 MenuItem 设置 `size="small"`
- **THEN** 该 MenuItem 使用 small 尺寸
- **AND** 其他 MenuItem 继续继承 large 尺寸

### Requirement: MenuList 管理 active 和 roving tabindex

MenuList MUST NOT 接受初始 active item 配置；初次渲染时 activeIndex 为 `null`。MenuList MUST 在内部维护 activeIndex 变化，不向调用方暴露导航回调。

MenuItem 的 `tabIndex` MUST 满足：

- active item：`0`
- 其他 item：`-1`
- disabled item：不参与导航

MenuList MUST NOT 在渲染阶段调用 `focus()`。MenuList MUST NOT 在挂载时主动抢占焦点；键盘导航和 typeahead 命中时焦点移动 MUST 使用 real DOM focus，不使用 `aria-activedescendant`。

#### Scenario: 初始无 active item

- **WHEN** MenuList 首次渲染
- **THEN** 所有 MenuItem 的 `tabIndex=-1`
- **AND** MenuList 不自动聚焦任何 MenuItem

#### Scenario: 容器获得焦点

- **WHEN** MenuList 容器自身获得焦点
- **THEN** 第一个可用 MenuItem 获得焦点并成为 active item
- **AND** 该项 `tabIndex=0`

#### Scenario: 无可用项

- **WHEN** MenuList 中没有可用 MenuItem，且容器获得焦点
- **THEN** MenuList 不设置 active item
- **AND** MenuList 容器保持 `tabIndex=-1`
- **AND** 不抛出异常

### Requirement: MenuItem 支持 MenuList 注册并保持独立使用

MenuItem 在 MenuList 中 MUST 通过 `useListItem` 注册自身 DOM element；typeahead 标签 MUST 来自 `node.textContent`；`disabled` / `selected` 由 MenuItem 自身输出到 DOM；离开 MenuList 时 MUST 保持当前独立 button 行为。

MenuItem MUST 合并用户 ref 与 MenuList 注册 ref，且最终 ref MUST 指向原生 button。MenuList 中 MenuItem 的 `onFocus` MUST 同步 activeIndex。

#### Scenario: 独立使用

- **WHEN** 使用方在没有 MenuList 的情况下渲染 `<MenuItem>首页</MenuItem>`
- **THEN** MenuItem 仍渲染原生 button、`role="menuitem"` 和默认 `tabIndex=-1`
- **AND** 不要求提供 Context

#### Scenario: 注册与 ref 合并

- **WHEN** 使用方在 MenuList 中渲染带 ref 的 MenuItem
- **THEN** MenuList 注册表包含该 DOM element，`ListCollection` 的标签集合包含文本值
- **AND** 用户 ref 仍指向同一个原生 button

### Requirement: MenuList 与浮层焦点职责分离

MenuList MUST NOT 负责定位、Portal、焦点陷阱、`Escape`、Tab 关闭、`inert`、焦点 guard 或关闭后焦点返回。上述行为 MUST 由上层 Menu/Popover 负责。

MenuList MUST NOT 在打开动画、`keepMounted`、关闭和重新打开时重复抢占上层已经管理的焦点。

本变更 MUST NOT 迁移或复制 `FloatingFocusManager`。MUST NOT 实现 `initialFocus` 策略、Tab 焦点陷阱、focus guard、`outsideElementsInert`、`closeOnFocusOut`、`returnFocus` 或 Portal/嵌套浮层焦点管理；上述能力 MUST 由未来的 Menu/Popover 变更单独实现。

MenuList 的焦点职责 MUST 限于列表内 roving tabindex、方向键导航和 typeahead。

#### Scenario: Escape 不由 MenuList 处理

- **WHEN** 用户在 MenuList 中按下 `Escape`
- **THEN** MenuList 不调用 `onClose`、不设置 `inert`、不创建焦点 guard
- **AND** 事件交由上层浮层处理

#### Scenario: 不迁移 FloatingFocusManager

- **WHEN** 审查本次 MenuList 实现和包依赖
- **THEN** 代码中不包含 `FloatingFocusManager` 的复制、Tab 焦点陷阱、focus guard、outside inert 或 returnFocus 逻辑
- **AND** 包依赖中不出现 `@floating-ui/react`、`@floating-ui/react-dom`、`@floating-ui/utils` 或 `tabbable`

### Requirement: MenuList 性能与依赖边界

MenuList 和 hooks MUST：

- 在事件发生时通过 `getElement` / `getSize` / `getLabels` 读取当前列表，不在渲染阶段执行全局 DOM 查询或布局测量。
- 不为每个 MenuItem 注册独立 keydown 监听器。
- 不在每次键盘导航时重新挂载 MenuItem 或重建整个列表。
- 不把 DOM element 放入需要参与 React 渲染的数据结构。
- 不新增运行时依赖。

#### Scenario: 键盘导航不重建菜单项

- **WHEN** 用户连续按下方向键
- **THEN** 现有 MenuItem DOM 节点保持挂载
- **AND** 导航只更新 active 状态和焦点
