# 变更：为 Atelier 新增 MenuItem、MenuList、List 文本/图标与 Ant Design 皮肤

## Why

Atelier 需要一个可独立使用的菜单项组件，以及一个负责组合焦点导航和键盘交互的菜单容器。API、状态与组合方式参考 MUI 9.5 的 MenuItem、ListItemIcon 与 ListItemText；MenuList 的导航 hook 和组合方式参考 Floating UI 0.27.20；最终视觉、几何和 light/dark 皮肤对齐 Ant Design 6 MenuItem。

本次不实现 Menu、Popover、SubMenu、ItemGroup 或 Divider。MenuItem 直接渲染原生 button，可以独立使用；MenuList 作为列表容器负责 item 注册、roving tabindex、方向键导航和 typeahead，不负责浮层定位、Portal、焦点陷阱或 Escape。

## What Changes

- 在 `packages/atelier/menu` 新增 `MenuItem`、类型、常量、样式、示例和测试。
- 在 `packages/atelier/navigation` 新增与 Floating UI 同名的 `useListNavigation` 与 `useTypeahead` hooks，以 getter 形式适配 store 注册模型并保留其核心行为。
- 新增 `MenuList` 组件，由它引用并组合 `useListNavigation`、`useTypeahead` 与 MenuItem 注册上下文。
- `MenuList` 支持受控与非受控单选：通过 `selectedKey`、`defaultSelectedKey` 与 `onSelect` 管理，MenuItem 通过 `value` 参与选中。
- 在 `packages/atelier/list` 新增 `ListItemIcon` 与 `ListItemText`。
- `MenuItem` 固定渲染原生 `button`，默认 `type="button"`，设置 `role="menuitem"`。
- `MenuItem` 在 MenuList 中注册 DOM ref，并继续支持无 MenuList 的独立使用；typeahead 标签从 `textContent` 读取。
- 支持 `selected`、`disabled`、`size` 和 `divider`。
- 内容通过 children 组合，使用 `ListItemIcon` 与 `ListItemText`，不提供 `icon` / `extra` props。
- 支持原生 button props、`className`、`style`、`ref`、`tabIndex` 与事件透传。
- MenuItem 几何对齐 Ant Design 6：8px 圆角、4px 外边距、16px 左右内边距、14px 字号；高度复用 Atelier control height scale。
- MenuItem 复用 `ComponentSize`（`small | default | large`），尺寸由静态 class 提供，不进入主题系统。
- selected 文字使用主色，hover、active、focus-visible、disabled 与 divider 使用 Ant Design 状态映射。
- 在 `@omnific/atelier/system` 新增 `antdLightSystem`、`antdDarkSystem` 及对应 `ThemeConfig`。
- light/dark system 只声明 MenuItem 消费且与默认主题不同的颜色，dark 使用 Ant Design Menu `theme="dark"` 皮肤；未声明值由 `:root` 默认主题继承，通过 `useTheme` 局部或全局切换。
- 从 `@omnific/atelier` 主入口导出 `MenuItem`、`ListItemIcon` 与 `ListItemText`。
- 从 `@omnific/atelier/menu` 与主入口导出 `MenuList` 及其类型。
- 从 `@omnific/atelier/menu`、`@omnific/atelier/navigation` 与主入口导出 `useListNavigation`、`useTypeahead` 及其类型。
- 为 `./menu`、`./list` 与 `./navigation` 增加子路径导出。
- 在 `upstream-analysis.md` 与 `design.md` 记录 MUI 9.5 与 Floating UI 0.27.20 的焦点管理参考和实现边界。
- 不新增运行时依赖。
- 明确不迁移 Floating UI 的 `FloatingFocusManager`；本次只实现列表内 roving focus 与 typeahead，焦点陷阱、focus guard、outside inert、close-on-focus-out 和 returnFocus 留给未来的 Menu/Popover 变更。

## 非目标

- 不实现 Menu、Popover、SubMenu、ItemGroup、Divider 组件或 `items` 数据驱动 API。
- 不实现多选、`selectedKeys`、`onDeselect` 或 `MenuRef`；列表单选由 MenuList 和导航 hooks 提供，不由 MenuItem 或 Menu 管理。
- 不迁移 `FloatingFocusManager`，不实现 `initialFocus` 策略、Tab 焦点陷阱、focus guard、`outsideElementsInert`、`closeOnFocusOut`、`returnFocus` 或 Portal/嵌套浮层焦点管理。
- 不提供 `component` / `as` 多态 API。
- 不提供 `icon` / `extra` / `theme` props，避免与 children 组合和 system 主题机制重复。
- 不提供 MUI 的 `classes`、`sx`、`disableGutters`、`disableRipple` 或 `ListItemSecondaryAction`。
- 不使用 `color-mix` 等高级 CSS 语法，不将几何写入主题配置。

## 影响范围

- 受影响 capability：`atelier-menu-item`、`atelier-menu-list`。
- 受影响 package：`packages/atelier`。
- 受影响公开 API：`MenuItem`、`MenuItemProps`、`MenuList`、`MenuListProps`（含 `selectedKey`、`defaultSelectedKey`、`onSelect`）、`ListCollection`、`ListState`、`createListCollectionStore`、`createListStateStore`、`useListCollection`、`useListState`、`useListItem`、`useInteractions`、`useActiveIndex`、`useSelectedKey`、`useListNavigation`、`useTypeahead`、`ComponentSize`、`ListItemIcon`、`ListItemText`、`antdLightTheme`、`antdDarkTheme`、`antdLightSystem`、`antdDarkSystem`。
- 受影响构建入口：`packages/atelier/package.json`、`packages/atelier/main.ts`、`packages/atelier/navigation/index.ts`、`packages/atelier/styles/index.scss`、`packages/atelier/system/index.ts`。
- 用户可观察行为：新增 Ant Design 6 风格的独立菜单项、列表文本/图标容器，以及可直接切换的 Ant Design light/dark 皮肤。
- 破坏性变更：无，本次为纯新增能力。
