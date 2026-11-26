# 上游参考分析

> 本文件保留 MUI 9.5 的 API、状态与 composition 分析，并补充 MUI 9.5 与 Floating UI 0.27.20 的焦点管理机制。最终视觉、几何与 light/dark 皮肤以 Ant Design 6 MenuItem 为准，见 `design.md`。MenuList 相关内容作为本次实现依据。

## 参考来源

| 项目              | 仓库                                           | 固定版本与 commit                                                               | 许可证           | 参考文件                                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| MUI Material      | https://github.com/mui/material-ui.git         | `@mui/material@9.5.0`，commit `1c3f8b4903f21cfad12c102edb3db4ceba2e8c8c`        | MIT（`LICENSE`） | `packages/mui-material/src/MenuItem/MenuItem.js`、`packages/mui-material/src/ListItemIcon/ListItemIcon.js`、`packages/mui-material/src/ListItemText/ListItemText.js`、`packages/mui-material/src/ButtonBase/ButtonBase.js`                             |
| MUI MenuList      | https://github.com/mui/material-ui.git         | `@mui/material@9.5.0`，commit `1c3f8b4903f21cfad12c102edb3db4ceba2e8c8c`        | MIT（`LICENSE`） | `packages/mui-material/src/MenuList/MenuList.js`、`packages/mui-material/src/Menu/Menu.js`、`packages/mui-material/src/MenuItem/MenuItem.js`、`packages/mui-utils/src/useRovingTabIndex/useRovingTabIndex.ts`                                          |
| Floating UI React | https://github.com/floating-ui/floating-ui.git | `@floating-ui/react@0.27.20`，commit `12d94738472e922e1b3fa31b02b2b61b9ed77e6a` | MIT（`LICENSE`） | `packages/react/src/components/FloatingList.tsx`、`packages/react/src/components/Composite.tsx`、`packages/react/src/hooks/useListNavigation.ts`、`packages/react/src/hooks/useTypeahead.ts`、`packages/react/src/components/FloatingFocusManager.tsx` |

上游源码只作为 MenuItem 的尺寸、状态和组合方式，以及 MenuList 焦点管理的架构参考。Atelier 不复制其 DOM 结构、class 命名、CSS-in-JS 实现、主题系统或完整交互实现。

## 提取的 MenuItem 行为

### 结构与语义

- MUI MenuItem 默认渲染 `li`，设置 `role="menuitem"` 和 `tabIndex=-1`。
- Atelier 选择原生 `button`，设置 `type="button"` 与 `role="menuitem"`，便于独立使用。
- 需要列表结构时，由调用方或 MenuList 在外层提供 `ul` / `li`。

### 状态

- `selected` 只负责视觉状态；MUI 在 `menuitemcheckbox` / `menuitemradio` 角色下还会同步 `aria-checked`。
- `disabled` 使用原生 disabled 语义；ButtonBase 额外设置 `pointer-events: none` 和 `cursor: default`。
- `dense` 的 API 语义是面向键盘和鼠标输入的紧凑垂直内边距，样式实现同时调整高度、字号和图标。
- `divider` 在菜单项底部增加 1px 边框。

### 尺寸

- 默认最小高度：48px。
- 默认上下内边距：6px。
- 默认左右内边距：16px。
- 默认字号：16px，行高 1.5。
- 桌面端非 dense 的 `min-height` 为 auto。
- dense 最小高度：32px。
- dense 上下内边距：4px。
- dense 字号：14px，行高 1.43。
- ListItemIcon 最小宽度：36px。
- dense 图标：1.25rem（20px）。

### 视觉

- hover 使用 action.hover。
- selected 使用 primary 透明度背景。
- selected hover 使用更高的 primary 透明度。
- focus-visible 使用 action.focus 或 inset focus ring。
- disabled 使用 `action.disabledOpacity`，默认 0.38。

## Atelier 的取舍

### 1. 使用 button 而不是 li

MUI MenuItem 默认是 `li`，依赖列表父元素。Atelier 的 MenuItem 需要独立使用，因此固定渲染 `button`。

### 2. 使用 children 组合

MUI 使用：

```tsx
<ListItemIcon />
<ListItemText />
```

Atelier 同样提供 `ListItemIcon` 与 `ListItemText`，但不引入 `ListItemSecondaryAction`。

### 3. 不使用 CSS-in-JS

MUI 使用 styled / emotion 和 theme token。Atelier 使用静态 SCSS、CSS 变量和语义颜色 token。

### 4. MenuItem 与 MenuList 分离

本次实现 MenuItem 与 MenuList，但不实现 Menu、Popover、SubMenu、ItemGroup 或 Divider。MenuItem 不承担列表导航；MenuList 通过 `useListNavigation` 与 `useTypeahead` 组合焦点和键盘行为。

### 5. 禁用颜色统一使用 token

MUI MenuItem 使用整体 opacity 组合禁用颜色。Atelier 改为直接使用现有 `--color-fg-disabled` token，使文本和图标颜色一致，且不新增禁用态颜色。

## MenuList 焦点管理分析

### 6. MUI 9.5 的实现方式

MUI 9.5 的 MenuList 已经从早期版本“扫描 children、克隆 active child、遍历 DOM 兄弟节点”的方式，重构为基于注册表的 roving tabindex 模型：

```text
MenuList
├─ useRovingTabIndexRoot
│  ├─ 维护 activeItemId
│  ├─ 处理方向键、Home、End
│  ├─ 跳过不可聚焦项
│  └─ 控制 wrap
│
├─ MenuListContext
│  ├─ disabledItemsFocusable
│  ├─ suppressInitialFocusVisible
│  └─ variant
│
└─ MenuItem
   └─ useRovingTabIndexItem
      ├─ useId 生成稳定 id
      ├─ 注册 element、disabled、selected
      └─ 输出 active ? tabIndex=0 : tabIndex=-1
```

关键行为：

- `MenuList` 的根节点固定 `role="menu"`，容器 `tabIndex=-1`；真实焦点由当前 active item 持有。
- `variant="selectedMenu"` 时，默认 active item 是第一个可选中的 `selected` 项；没有时回退到第一个可聚焦项。
- `variant="menu"` 时，默认 active item 是第一个可聚焦项。
- `disabledItemsFocusable` 决定禁用项是否参与 roving 导航。
- `MenuItem` 注册时把 DOM element、`disabled`、`selected` 等元数据写入注册表，注册表按 DOM 位置排序，不再依赖 children 索引。
- 键盘事件统一挂在 MenuList 容器上，通过当前 active item、DOM 顺序和注册元数据计算下一项。
- typeahead 仍在 MenuList 内实现，使用约 500ms 的输入窗口；连续相同字符时在首字母相同的项之间循环，不同字符时使用前缀匹配。
- `Menu` 负责 Popover 生命周期、Tab 关闭和初始焦点时机；Escape 由 Popover/Modal 层处理。MenuList 不负责弹层定位、焦点陷阱或点击外部关闭。
- `Menu` 在过渡进入阶段调用 `focusInitialTarget`，并同时处理滚动条宽度修正；初始焦点与弹层焦点管理明确分层，避免多个层争抢焦点。

### 7. Floating UI 的参考模型

Floating UI 0.27.20 把这部分拆得更细，适合作为 Atelier 的架构参考，而不是直接复制其完整实现。

#### 7.1 FloatingList：注册与排序

`FloatingList` 维护 item 注册表和 `elementsRef` / `labelsRef`，`useListItem` 返回 `ref` 与 `index`。注册表按真实 DOM 位置排序，因此支持条件渲染、Fragment、wrapper 和动态增删项。

#### 7.2 Composite：纯 roving tabindex

`Composite` 是“单个 Tab 停靠点 + 方向键内部移动”的通用实现：

- `activeIndex` 控制当前项。
- `CompositeItem` 输出 `tabIndex={activeIndex === index ? 0 : -1}`。
- item 的 `onFocus` 会同步 `activeIndex`。
- 容器统一处理方向键、循环、禁用项和 `Home` / `End`。

这部分与 MUI 9.5 的 `useRovingTabIndexRoot` / `useRovingTabIndexItem` 在职责上最接近。

#### 7.3 useListNavigation：浮层场景导航

`useListNavigation` 增加了浮层特有的职责：

- 维护 `activeIndex`、`selectedIndex` 和内部 `indexRef`，解决 React state 异步更新与连续键盘事件之间的竞态。
- 在打开时根据 `selectedIndex` 或方向键决定初始 active item。
- 支持 `loop`、`orientation`、`disabledIndices`、`focusItemOnOpen`、`focusItemOnHover`、滚动到可视区域、嵌套菜单和网格导航。
- 默认使用 real DOM focus；设置 `virtual` 后改用 `aria-activedescendant`，焦点留在触发元素或输入框上。
- item 通过 `onFocus`、`onMouseMove`、`onPointerLeave` 等事件同步 activeIndex，区分键盘与指针交互模式。

#### 7.4 useTypeahead：独立状态机

`useTypeahead` 使用独立的字符串缓冲、重置计时器、上一次匹配项和匹配回调。默认约 750ms 重置，支持从当前项之后开始轮转搜索，也支持同一首字母的快速循环。Atelier 版本使用可选的 `labelsRef` 与 `listRef` 索引对齐，避免逐次读取 DOM 文本；保留 `onKeyUp` 与 `onTypingChange` 作为输入状态出口。

#### 7.5 FloatingFocusManager：本次不迁移

`FloatingFocusManager` 负责打开/关闭时的初始焦点、Tab 焦点陷阱、焦点移出关闭、焦点返回、外部元素 `inert` / `aria-hidden`、visually hidden dismiss 和可输入 Combobox 的特殊焦点语义。它不等同于 `useListNavigation`，也不应该被塞进 MenuList。

本变更明确决定**不迁移**该组件，理由如下：

- **签名依赖浮层上下文**：`FloatingFocusManager({ context })` 的 `context` 是 `FloatingContext`，需要 `open`、`onOpenChange`、`events`、`dataRef`、`elements.domReference` 和 `elements.floating`；内部还使用 `useFloatingTree()`、`usePortalContext()` 与 `getNodeChildren()`。MenuList 是内联列表，没有浮层元素、触发器或 Portal，无法提供这些输入。
- **引入运行时依赖链**：0.27.20 的实现约 408 行，依赖 `tabbable`、`@floating-ui/react/utils`、`@floating-ui/utils/dom` 和 `@floating-ui/react-dom`。这与 `dependency-footprint` 规范以及本变更“不新增运行时依赖”的约束冲突。
- **职责层级错位**：initial focus、Tab 焦点陷阱、focus guard、outside inert、close-on-focus-out 和 return focus 属于未来的 Menu/Popover 浮层；现在搬入会在后续浮层实现时产生两个焦点管理器竞争。
- **默认语义不适用于内联列表**：`modal=true`、`guards=true`、`closeOnFocusOut=true`、`returnFocus=true` 均假设存在 floating element 与 `domReference`；内联菜单的 Tab 应自然离开列表，不需要焦点陷阱。

只把以下行为作为未来浮层变更的设计输入，不复制实现：initialFocus 的取值语义（index / ref / function）、`focus({ preventScroll: true })`、StrictMode 下 return focus 的双调用防护、focus guard 的边界情况。

未来如需要上述能力，单独开 `atelier-overlay-focus` 变更，实现或引入最小 FocusScope；本变更的 MenuList MUST NOT 复制 `FloatingFocusManager`。

### 8. 对 Atelier 的设计结论

Atelier 本次实现 MenuList 时采用以下原则：

- **使用 real DOM focus**：MenuList 是菜单而不是 Combobox，采用真实焦点与 roving tabindex，不引入 virtual focus 或 `aria-activedescendant`。
- **保留 Floating UI 同名 hooks**：实现 `useListNavigation` 与 `useTypeahead`，由 MenuList 引用并组合，组件内不重复堆叠导航算法。
- **使用注册表而不是 children 索引**：`MenuItem` 通过 ref 注册 DOM element；`disabled` / `selected` 从 DOM 属性读取，typeahead 标签来自 `textContent`；MenuList 按 DOM 位置排序并按需缓存。
- **容器统一处理键盘**：只在 MenuList 根节点挂一个 `onKeyDown`，不为每个 MenuItem 重复挂 keydown。
- **active 状态与 DOM 同步分离**：逻辑 active item 用于导航，真实 DOM focus 用于浏览器行为和可访问性；item 的 `onFocus` 同步 active 状态。
- **不引入 Floating UI 运行时依赖**：只参考其分层和算法，使用 Atelier 内部小型 hook 实现；若未来需要浮层定位，再单独评估现有 overlay 能力或按需引入定位库。
- **弹层焦点与列表导航分层**：MenuList 只管理列表内导航；打开焦点、焦点陷阱、Escape 和关闭后焦点返回由上层 Menu/Popover 负责。
- **不迁移 FloatingFocusManager**：本次不复制其 `FloatingContext`、focus guard、Tab 陷阱、outside inert、close-on-focus-out 或 returnFocus 实现；这些能力留给未来的 Menu/Popover 变更。
- **性能约束**：键盘处理保持 O(n) 级，其中 n 为当前菜单项数量；不在渲染阶段读取布局，不在每次导航时全量重建注册表，不在 item 上重复绑定键盘监听。

更具体的性能实现约束见 `design.md` 的 MenuList 设计输入部分。

## 与 MUI 的预期差异

- Atelier MenuItem 固定是 button，不是 li。
- Atelier 不提供 `component` / `as` 多态。
- Atelier 不提供 `classes`、`sx`、`disableGutters`、`disableRipple` 或 `ListItemSecondaryAction`。
- Atelier 的 `selected` 使用 `aria-current="page"`，而不是 `aria-selected`。
- 本次引入 MenuList 的焦点和键盘导航；具体 hook 契约、组合方式和性能边界见 `design.md`。
