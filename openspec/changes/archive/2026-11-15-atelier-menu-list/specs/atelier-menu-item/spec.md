# Atelier MenuItem 规格增量

## Purpose

定义 `@omnific/atelier` 新增 MenuItem、ListItemIcon 与 ListItemText 的公开 API、状态、Ant Design 视觉皮肤和实现边界。MenuItem 固定渲染原生 button，可独立使用；MenuList 及其导航 hooks 由 `atelier-menu-list` 规格定义。本次不实现 Menu、Popover、SubMenu、ItemGroup 或 Divider。

## ADDED Requirements

### Requirement: 提供独立的 MenuItem 与 List 文本/图标组件

`@omnific/atelier` MUST 从 `@omnific/atelier/menu` 导出 `MenuItem` 与 `MenuItemProps`，从 `@omnific/atelier/list` 导出 `ListItemIcon` 与 `ListItemText`。主入口 MUST 同步导出这些组件。

`MenuItem` MUST 固定渲染原生 `button`，默认 `type="button"`，并设置 `role="menuitem"`。`MenuItemProps` MUST 继承 `ComponentPropsWithRef<'button'>`，MUST NOT 强制要求 React `key`。

MenuItem MUST NOT 承担 MenuList、Menu、Popover、SubMenu 或 `Menu.Item` 的职责，MUST NOT 提供 `component`、`as`、`icon`、`extra` 或 `theme`。内容 MUST 通过 children 组合，主题 MUST 通过 `useTheme` 选择不同 `SystemContext` 完成。MenuList 与导航 hooks 的公开 API 由 `atelier-menu-list` 规格定义。

#### Scenario: 独立渲染 MenuItem

- **WHEN** 使用方渲染 `<MenuItem>首页</MenuItem>`
- **THEN** 根节点是 `button`
- **AND** `type="button"` 且 `role="menuitem"`
- **AND** 不要求传入 React `key`

#### Scenario: 使用 children 组合内容

- **WHEN** 使用方渲染 `<MenuItem><ListItemIcon>...</ListItemIcon><ListItemText>首页</ListItemText></MenuItem>`
- **THEN** ListItemIcon 与 ListItemText 分别输出 `atelier-list-item-icon` 与 `atelier-list-item-text` class
- **AND** MenuItem 直接渲染 children，不额外包标题容器

### Requirement: 支持 selected、disabled、size 与 divider

`MenuItemProps` MUST 支持 `selected`、`disabled`、`size` 和 `divider`。`selected` MUST 输出 `atelier-menu-item-selected` class、`data-selected="true"` 与 `aria-current="page"`。

MenuList MAY 从 MenuItem 的 `textContent` 提取 typeahead 标签；该行为 MUST NOT 改变独立 MenuItem 的 DOM 语义或视觉输出。

`disabled` MUST 输出原生 `disabled`、`aria-disabled="true"` 与 `atelier-menu-item-disabled` class，并 MUST NOT 设置 tab 顺序。

`size` MUST 复用 `ComponentSize`（`small | default | large`），并输出 `atelier-menu-item-size-{small|default|large}` class 与 `data-size`。`divider` MUST 输出 `atelier-menu-item-divider` class 与 `data-divider="true"`。

#### Scenario: 禁用 MenuItem

- **WHEN** 使用方渲染 `<MenuItem disabled>禁用项</MenuItem>`
- **THEN** 原生 button 被禁用
- **AND** 节点具有 `aria-disabled="true"` 与 disabled class
- **AND** 节点没有 `tabIndex`

#### Scenario: size 与 divider

- **WHEN** 使用方渲染 `<MenuItem size="small" divider>紧凑项</MenuItem>`
- **THEN** 节点具有 size 与 divider 对应 class 和 data 属性

### Requirement: 几何与 Ant Design 6 MenuItem 对齐

MenuItem MUST 复用 `ComponentSize`（`small | default | large`），默认 `default`。`small` MUST 使用 `--control-height-sm` 和 12px 左右内边距；`default` MUST 使用 `--control-height-md` 和 16px 左右内边距；`large` MUST 使用 `--control-height-lg`、20px 左右内边距和 `--font-size-lg`。MenuItem MUST 使用 8px 圆角、4px 上下外边距、`width: 100%`、14px 字号和 `--line-height-md`。MenuItem MUST 使用 120ms 背景色过渡，边框色与文字色过渡 MUST 使用 200ms。

MenuItem 内 ListItemIcon MUST 使用 14px 最小宽度、14px 图标尺寸、10px 右间距，并继承 MenuItem 文字颜色。ListItemText MUST 保持 `flex: 1 1 auto`、`min-width: 0` 与零 margin。

`small`、`default` 与 `large` MUST 分别输出对应 size class 与 `data-size`。

所有 MenuItem 几何值 MUST 使用静态 SCSS 中的简单 px 属性，MUST NOT 写入 `ThemeConfig` 或 `createTheme`。

#### Scenario: 默认几何

- **WHEN** 使用方渲染默认尺寸 MenuItem
- **THEN** 高度为 32px、圆角为 8px、上下外边距为 4px、左右内边距为 16px
- **AND** 宽度为父容器宽度的 100%

#### Scenario: 选择 MenuItem 尺寸

- **WHEN** 使用方渲染 `<MenuItem size="small">紧凑项</MenuItem>`
- **THEN** 节点输出 `atelier-menu-item-size-small` class 与 `data-size="small"`
- **AND** 高度为 24px、左右内边距为 12px、行高为 `--line-height-md`

#### Scenario: 图标几何

- **WHEN** MenuItem 直接包含 ListItemIcon
- **THEN** 图标为 14px，右间距为 10px
- **AND** 图标颜色继承 MenuItem 当前文字颜色

### Requirement: 使用 Ant Design 状态颜色

MenuItem MUST 使用 Atelier 语义颜色 token 表达 Ant Design 交互状态：

- 默认文字：`--color-fg`
- 非选中 hover：`--color-bg-muted`
- 非选中 active：`--color-accent-subtle`
- selected 文字：`--color-accent-fg`
- selected 背景：`--color-accent-subtle`
- focus-visible：3px `--color-accent-border` 轮廓，offset 1px
- disabled 文字：`--color-fg-disabled`
- disabled 背景：透明
- divider：`--color-border-muted`

selected 项 hover 时 MUST 保持 selected 背景与文字颜色。MUST NOT 通过整体 `opacity` 组合禁用颜色。MUST NOT 使用 `color-mix` 或其他高级 CSS 颜色函数。

#### Scenario: selected 状态

- **WHEN** 使用方渲染 `<MenuItem selected>首页</MenuItem>`
- **THEN** 节点输出 selected class、`data-selected="true"` 与 `aria-current="page"`
- **AND** 文字使用 `--color-accent-fg`
- **AND** 背景使用 `--color-accent-subtle`

#### Scenario: focus-visible

- **WHEN** 键盘用户聚焦 MenuItem
- **THEN** 节点显示 3px `--color-accent-border` 轮廓
- **AND** 轮廓偏移为 1px

#### Scenario: disabled 状态使用统一 token

- **WHEN** 使用方渲染禁用 MenuItem
- **THEN** 文本和 ListItemIcon 都使用 `--color-fg-disabled`
- **AND** 背景为透明
- **AND** 不通过整体 `opacity` 组合禁用颜色

### Requirement: 提供 Ant Design Menu light 与 dark system preset

`@omnific/atelier/system` MUST 导出 `antdLightTheme`、`antdDarkTheme`、`antdLightSystem` 与 `antdDarkSystem`。两个 system MUST 使用不同名称，并 MUST 只声明 MenuItem 消费的颜色变量：

```text
--color-bg
--color-fg
--color-bg-muted
--color-accent-fg
--color-accent-subtle
--color-accent-border
--color-fg-disabled
--color-border-muted
```

系统 MUST NOT 声明 danger、warning、success、info palette 或其他与 MenuItem 无关的颜色。与 Atelier 默认主题相同的值 MUST 省略，并由 `:root` 默认主题继承；MUST NOT 重复写入相同值。

light system MAY 继续继承默认主题已经匹配的 `--color-accent-fg` 与 `--color-accent-subtle`。dark system MUST 使用 Ant Design Menu `theme="dark"` 的皮肤值，覆盖 MenuItem 的 8 个颜色变量；MUST NOT 使用 ConfigProvider `darkAlgorithm` 的 `#141414`、`#15325b`、`#1668dc` 组合替代 Menu dark 皮肤。

MenuItem MUST 不感知 system 名称，只消费当前作用域内的 CSS 变量。应用 MUST 通过 `useTheme(antdLightSystem)` 或 `useTheme(antdDarkSystem)` 切换皮肤。

#### Scenario: 只写 MenuItem 增量主题

- **WHEN** 检查 `antdLightTheme` 与 `antdDarkTheme`
- **THEN** 只包含 MenuItem 消费的颜色变量
- **AND** 每一项都与 `defaultSystem` 对应 CSS 变量的值不同
- **AND** 不包含 danger、warning、success、info 等完整 palette

#### Scenario: 局部切换 light 与 dark

- **WHEN** 两个容器分别把 `useTheme` 的 ref 绑定到 `antdLightSystem` 与 `antdDarkSystem`
- **THEN** 容器内的 MenuItem 使用各自作用域的 CSS 变量
- **AND** 不需要修改 MenuItem props 或组件实现

#### Scenario: 主题只包含颜色

- **WHEN** 检查 `antdLightSystem.cssVars` 与 `antdDarkSystem.cssVars`
- **THEN** 不包含 `--control-height-lg` 或 `--radius-lg` 等结构变量
- **AND** MenuItem 几何仍由静态 SCSS 提供

### Requirement: 原生属性、ref 与可访问性透传

MenuItem MUST 允许使用方透传原生 button props、`className`、`style`、`id`、`title`、`type`、`tabIndex`、事件处理器与 `ref`。组件 class 与用户 `className` MUST 合并，用户 `style` MUST 最后生效。

`ListItemIcon` 与 `ListItemText` MUST 允许透传原生 span props，并合并用户 `className`。

#### Scenario: ref 与原生属性

- **WHEN** 使用方给 MenuItem 传入 `ref`、`id`、`tabIndex` 和 `className`
- **THEN** ref 指向原生 button
- **AND** 原生属性与合并后的 class 出现在最终节点上

### Requirement: 单次渲染与无全局查询

MenuItem 与 ListItemIcon / ListItemText MUST 直接渲染自身 props，不创建隐藏测量树，不使用全局 DOM 查询，不引入 Context、外部 store 或 `useSyncExternalStore`。

#### Scenario: 不创建隐藏节点

- **WHEN** 使用方渲染一个 MenuItem
- **THEN** DOM 中只存在一个 button 及其 children
- **AND** 不存在 `display: none` 的重复测量节点
