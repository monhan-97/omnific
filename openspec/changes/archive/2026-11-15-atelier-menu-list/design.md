# 设计：MenuItem、List 文本/图标与 Ant Design 皮肤

## 上下文

Atelier 需要一个可独立使用的菜单项组件。API、状态和 children 组合方式参考 MUI 9.5 的 MenuItem、ListItemIcon 与 ListItemText；最终视觉、几何和 light/dark 皮肤对齐 Ant Design 6 MenuItem。

本次不实现 Menu、Popover、SubMenu、ItemGroup 或 Divider，也不实现 Menu 级多选或复杂选中模型。MenuItem 固定渲染原生 button；MenuList 作为组合容器负责列表内焦点导航、键盘交互和受控/非受控单选。

## 目标

- 提供可独立使用的 MenuItem。
- 提供可独立组合的 MenuList，以及 `useListNavigation` 与 `useTypeahead` hooks。
- 使用原生 button 语义，避免 `li` 脱离列表后成为无效结构。
- API 与状态参考 MUI，几何与颜色对齐 Ant Design 6。
- 提供 `antdLightSystem` 与 `antdDarkSystem` 两套可直接使用的主题。
- 通过 children 组合 ListItemIcon 与 ListItemText。
- 只使用静态 SCSS、CSS 变量和 Atelier 语义颜色 token。
- 保持组件职责单一，独立 MenuItem 不引入 Context、store 或全局 DOM 查询。

> 该 Context / store 约束只适用于当前独立 MenuItem。后续 MenuList 作为组合容器可以引入内部 Context 和注册表，但 MenuItem 必须继续支持在没有 MenuList 的情况下独立使用。

## 非目标

- 不实现 Menu、Popover、SubMenu、ItemGroup 或 Divider 组件。
- 不实现多选、`selectedKeys`、`onDeselect` 或 `MenuRef`。
- 不提供 `component` / `as` 多态 API。
- 不提供 `icon` / `extra` / `theme` props。
- 不提供 MUI 的 `classes`、`sx`、`disableGutters`、`disableRipple` 或 `ListItemSecondaryAction`。
- 不使用 `color-mix` 等高级 CSS 语法。

## 关键决策

### 1. MenuItem 使用原生 button

MenuItem 固定渲染：

```tsx
<button type='button' role='menuitem'>
  {children}
</button>
```

原因：

- button 可以独立使用，不依赖 `ul` / `li`。
- 原生 `disabled`、focus 和键盘语义更直接。
- MenuList 可采用直接承载 button 的 `role="menu"` 容器；若采用 `ul` / `li` 结构，则由 MenuList 提供显式 wrapper，而不是要求 MenuItem 改变渲染节点。

不设置 `component` 或 `as`，避免多态类型和调用方结构复杂度。

### 2. 内容通过 children 组合

不提供 `icon` 与 `extra` props，改用：

```tsx
<MenuItem selected>
  <ListItemIcon>
    <HomeIcon />
  </ListItemIcon>
  <ListItemText>首页</ListItemText>
</MenuItem>
```

职责：

- `ListItemIcon`：inline-flex、14px 图标尺寸、10px 右间距。
- `ListItemText`：flex 1、min-width 0、可截断文本容器。
- `MenuItem`：只负责 button 外壳、状态 class / data 和布局。

### 3. 状态由 props 输出 class 与 data 属性

MenuItem 不维护内部选中状态：

```text
selected → atelier-menu-item-selected + data-selected
disabled → 原生 disabled + aria-disabled + disabled class
size → atelier-menu-item-size-{small|default|large} + data-size
divider → atelier-menu-item-divider + data-divider
```

在 MenuList 中且提供 `value` 时，MenuItem 从 `ListState` store 读取当前选中 key，并由列表选中状态覆盖自身的 `selected` prop。

CSS 只消费 class、data 属性和语义颜色 token，不使用 CSS 变量反推选中状态。

### 4. 几何与 Ant Design 6 对齐

MenuItem 默认几何：

- 默认 default 尺寸，使用 `--control-height-md`（32px）
- 8px 圆角
- 4px 上下外边距
- 16px 左右内边距
- `width: 100%`，配合 4px 上下 margin
- 14px 字号
- 行高使用 `--line-height-md`，垂直居中由 flex 负责
- 120ms 背景色过渡，200ms 边框色与文字色过渡

ListItemIcon：

- 最小宽度 14px
- 图标尺寸 14px
- 右间距 10px
- 在 MenuItem 内继承文字颜色

ListItemText：

- flex: 1 1 auto
- min-width: 0
- MenuItem 内 margin 0

size 使用静态 class：

- `small`：`--control-height-sm`（24px）、12px 左右内边距
- `default`：`--control-height-md`（32px）、16px 左右内边距，作为默认尺寸
- `large`：`--control-height-lg`（40px）、20px 左右内边距、`--font-size-lg`（16px）

MenuItem 通过共享 `ComponentSize`（`small | default | large`）选择尺寸，默认 `default`。尺寸由静态 class 实现：`atelier-menu-item-size-small`、`atelier-menu-item-size-default` 与 `atelier-menu-item-size-large`。圆角、margin、padding、字号、高度和图标尺寸全部由静态 SCSS 提供，不进入 theme system。

### 5. 交互状态对齐 Ant Design 6

MenuItem 使用以下语义 token：

```text
默认文字 → --color-fg
非选中 hover → --color-bg-muted
非选中 active → --color-accent-subtle
selected 文字 → --color-accent-fg
selected 背景 → --color-accent-subtle
focus-visible → 3px --color-accent-border 轮廓，offset 1px
disabled 文字 → --color-fg-disabled
disabled 背景 → transparent
divider → --color-border-muted
```

selected 项 hover 时保持 selected 背景与文字颜色。禁用态不使用整体 opacity，并覆盖为透明背景。

### 6. Ant Design light/dark 作为 system preset

在 `packages/atelier/system/themes/antd.ts` 提供：

```text
antdLightTheme / antdLightSystem
antdDarkTheme / antdDarkSystem
```

两套配置只声明 MenuItem 直接消费、且与 Atelier 默认主题不同的颜色键。未声明的键由 `dist/styles.css` 的 `:root` 默认主题继承，避免重复写入相同值。

MenuItem 只消费以下颜色变量：

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

light theme 只覆盖 5 个与默认主题不同的值：

```text
--color-fg
--color-bg-muted
--color-accent-border
--color-fg-disabled
--color-border-muted
```

`--color-accent-fg` 与 `--color-accent-subtle` 在默认主题中已经等于 Ant Design light，直接继承。

dark theme 使用 Ant Design Menu 组件的 `theme="dark"` 皮肤，不采用 ConfigProvider `darkAlgorithm`，只覆盖 8 个 MenuItem 变量：

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

不声明完整 `bg`、`fg`、`border` palette，也不声明 danger、warning、success、info 等与 MenuItem 无关的主题颜色。关键值来自 Ant Design 6 Menu：

```text
light:
  itemColor             rgba(0, 0, 0, 0.88)
  itemDisabledColor     rgba(0, 0, 0, 0.25)
  itemHoverBg           rgba(0, 0, 0, 0.06)
  itemSelectedColor     #1677ff
  itemSelectedBg        #e6f4ff
  itemActiveBg          #e6f4ff
  colorSplit            rgba(5, 5, 5, 0.06)

dark (Menu theme="dark"):
  itemBg                #001529
  itemColor             rgba(255, 255, 255, 0.65)
  itemSelectedColor     #ffffff
  itemSelectedBg        #1677ff
  itemDisabledColor     rgba(255, 255, 255, 0.25)
```

MenuItem 不新增 `theme` prop。应用通过 `useTheme` 把 system 挂到局部容器或 `documentElement`：

```tsx
const themeRef = useTheme<HTMLDivElement>(antdDarkSystem);

<div ref={themeRef}>
  <MenuItem selected>首页</MenuItem>
</div>;
```

### 7. 主题与几何职责分离

`ThemeConfig` / `SystemContext` 只负责颜色。MenuItem 的高度和其他几何值由 `size` variant 与静态 SCSS 提供。这样主题系统保持颜色职责，尺寸通过组件 prop 选择，不新增组件级主题 token。

### 8. MenuList 与 Floating UI 同名 hooks

MenuList 本次实现。设计目标是：hook 负责纯导航算法，MenuList 只负责引用、注册表和组合，MenuItem 负责自身语义与焦点注册。

#### 8.1 分层职责

```text
Menu / Popover     → 打开关闭、定位、焦点陷阱、Escape、关闭后焦点返回
ListCollection     → 可独立使用的 item 注册上下文（MenuItem 注册、DOM 顺序、refs）
ListState          → active index 与受控/非受控单选状态
MenuList           → 内联注册模型，组合 hooks、选中状态、渲染容器和初始焦点
useListNavigation  → 方向键、Home/End、loop、disabled、activeIndex、DOM focus
useTypeahead       → 字符缓冲、查找、匹配回调和重置计时
MenuItem           → role、视觉状态、DOM ref、focus 事件、注册
```

MenuList MUST NOT 负责浮层定位、Portal、焦点陷阱或点击外部关闭。上层浮层 MUST NOT 通过 children 索引直接控制 MenuItem 的 active 状态。

`@omnific/atelier/menu` 同时 re-export `useListNavigation`、`useTypeahead` 及其 options 类型，方便菜单场景从同一入口导入；`@omnific/atelier/navigation` 继续提供完整导航组合能力。

#### 8.2 useListNavigation

`useListNavigation` MUST 与 Floating UI 对应 hook 同名，并以 getter 形式保留其核心能力：

```ts
type UseListNavigationOptions = {
  getActiveIndex: () => number | null;
  getElement: (index: number) => HTMLElement | undefined;
  getSize: () => number;
  onNavigate?: (index: number | null) => void;
  orientation?: 'vertical' | 'horizontal' | 'both';
  loop?: boolean;
  disabledIndices?: number[] | ((index: number) => boolean);
  enabled?: boolean;
};

type UseListNavigationReturn = {
  onFocus: React.FocusEventHandler<HTMLElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  getItemProps: (index: number) => {
    onFocus: React.FocusEventHandler<HTMLElement>;
    onClick: React.MouseEventHandler<HTMLElement>;
  };
  focusIndex: (index: number) => boolean;
};
```

行为要求：

- 支持方向键、`Home`、`End`。
- 支持 `loop`、`orientation` 和 `disabledIndices`。
- 通过 `getElement` 按索引读取有序 DOM 元素，调用 `element.focus({ preventScroll: true })`。
- 通过 `getActiveIndex` / `onNavigate` 与调用方同步逻辑焦点。
- 容器事件通过返回的 `onFocus` / `onKeyDown` 注入，item 事件通过 `getItemProps` 注入，不要求在 MenuItem 内复制方向键算法。
- `activeIndex` 超出范围或指向不可用项时，安全回退到第一个可用项。

#### 8.3 useTypeahead

`useTypeahead` MUST 与 Floating UI 对应 hook 同名，并以 getter 形式保留其核心能力：

```ts
type UseTypeaheadOptions = {
  getActiveIndex: () => number | null;
  getSelectedIndex?: () => number | null;
  getLabels: () => Array<string | null>;
  onMatch: (index: number) => void;
  resetMs?: number;
  findMatch?: (labels: Array<string | null>, search: string) => string | null;
  ignoreKeys?: string[];
  enabled?: boolean;
  onTypingChange?: (typing: boolean) => void;
};

type UseTypeaheadReturn = {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  onKeyUp: React.KeyboardEventHandler<HTMLElement>;
};
```

行为要求：

- 使用 ref 维护输入字符串、计时器和上一次匹配项。
- 默认重置时间与 Floating UI 保持一致，为 `750ms`。
- 从 `getSelectedIndex` 或当前 active item 之后开始轮转查找。
- 支持前缀匹配、连续相同字符循环和未匹配时的安全回退。
- 支持 `findMatch`、`ignoreKeys`、`getLabels`、修饰键过滤和输入法组合状态保护。
- 返回 `onKeyDown` / `onKeyUp`；`onTypingChange` 在输入开始、重置和空格释放时通知调用方。
- 不直接修改 activeIndex，只通过 `onMatch` 通知 MenuList。

#### 8.4 MenuList 组合契约

MenuList MUST 负责引用和组合，而不是把导航算法堆在组件内：

```tsx
const [activeIndex, setActiveIndex] = useState<number | null>(null);
const collection = useListCollection();

const listNavigation = useListNavigation({
  getActiveIndex: () => activeIndex,
  getElement: collection.getElement,
  getSize: collection.getSize,
  onNavigate: setActiveIndex,
  orientation: 'vertical',
  loop: true,
});

const typeahead = useTypeahead({
  getActiveIndex: () => activeIndex,
  getLabels: collection.getLabels,
  onMatch: index => {
    setActiveIndex(index);
    listNavigation.focusIndex(index);
  },
});

const interactions = useInteractions([listNavigation, typeahead]);
```

MenuList 自身职责：

- 渲染 `role="menu"`、`aria-orientation="vertical"`、`tabIndex=-1` 的根节点。
- 维护 `ListCollection` store、`ListState` store 和 MenuItem 注册上下文。
- 使用 `useInteractions` 合并 `useListNavigation` 与 `useTypeahead` 的容器事件，合并后仍调用用户传入的事件处理器。
- 不暴露初始 active item 配置；内部 activeIndex 初始为 `null`，容器获得焦点或导航时再设置。
- 在内部维护 activeIndex 变化，不向调用方暴露导航回调，且不在挂载时主动抢占焦点。
- 给 MenuItem 提供 active 状态、选中状态和 `tabIndex` 计算所需信息。
- 通过 `getItemProps(index, userProps)` 合并 store 与 MenuItem 的用户事件，避免在组件层重复包装。
- 在根节点输出 `data-size`，通过 CSS 自定义属性向 MenuItem 传播列表尺寸。
- 通过 `selectedKey`、`defaultSelectedKey` 与 `onSelect` 管理受控/非受控单选；不支持多选。

#### 8.4.1 MenuList 尺寸传播

MenuList 的 `size` 不通过 context 或逐项 props 下传，而是在根节点设置 `data-size` 和以下 CSS 自定义属性：

- `--menu-item-height`
- `--menu-item-padding-inline`
- `--menu-item-font-size`

MenuItem 使用 `var(--menu-item-*, fallback)` 消费这些变量。MenuItem 的 `-size-small` / `-size-large` class 在自身元素上声明同名变量，因此单项设置会覆盖 MenuList 的继承值；`-size-default` 不声明变量，保持继承。

该方案的优势：

- 不增加 context、不触发额外渲染，MenuItem 仍可独立使用。
- 列表级尺寸只映射一次 token，MenuItem 不需要复制 small/default/large 规则。
- 消费方可以在 MenuList 或外层容器上覆盖 CSS 变量，便于局部定制。

#### 8.4.2 MenuList 单选状态

MenuList 通过 `useListState` 管理 `ListState` store：

- `selectedKey` 不为 `undefined` 时为受控模式；点击带 `value` 的 MenuItem 只调用 `onSelect`，由调用方决定是否更新 `selectedKey`。
- `selectedKey` 为 `undefined` 时为非受控模式，`defaultSelectedKey` 只作为初始值；点击后更新内部选中 key。
- 未提供 `value` 的 MenuItem 不参与列表选中，继续由自身 `selected` prop 控制视觉状态。
- 提供 `value` 的 MenuItem 以 `selectedKey` 为准，列表选中覆盖自身 `selected`。
- 点击已选中的 key 不重复调用 `onSelect`。
- 选中状态由 `ListState` store 通知 MenuItem，避免 MenuList 逐项传 props。
- 单选是当前唯一支持的模式；多选、`selectedKeys` 和 `onDeselect` 留给后续变更。

#### 8.5 MenuItem 注册契约

MenuItem MUST 继续支持无 MenuList 的独立使用：

- 独立使用时保持当前原生 button、`role="menuitem"` 和 `tabIndex` 行为。
- 在 MenuList 中时，通过 `useListItem` 注册自身 DOM element；typeahead 标签来自 `node.textContent`。
- `disabled` / `selected` 由 MenuItem 自身输出到 `disabled`、`aria-disabled` 与 `data-selected` 属性。
- 使用合并后的 ref，既保留用户 ref，也保留 MenuList 注册 ref。
- `disabled` 的 MenuItem 第一版不参与 roving 导航，不提供 `disabledItemsFocusable`。

#### 8.6 键盘与焦点行为

MenuList MUST：

- 在根节点统一处理方向键、`Home`、`End`，不在每个 MenuItem 上重复绑定 keydown。
- `aria-orientation="vertical"` 时使用 `ArrowUp` / `ArrowDown`；`aria-orientation="horizontal"` 时使用 `ArrowLeft` / `ArrowRight`。
- 忽略 `ctrlKey`、`metaKey`、`altKey` 组合键。
- 使用 `event.nativeEvent.isComposing` 识别输入法组合状态，不依赖已废弃的 `keyCode`。
- active item 使用 `tabIndex=0`，其他 item 使用 `tabIndex=-1`。
- 使用 real DOM focus，不使用 virtual focus 或 `aria-activedescendant`。
- 焦点移动使用 `focus({ preventScroll: true })`；仅在键盘导航或打开时执行 `scrollIntoView({ block: 'nearest' })`。
- 所有可聚焦项不可用时，将焦点放到 MenuList 容器。

#### 8.7 性能与依赖边界

- hook 内部只在事件发生或 getter 被调用时读取元素，不在渲染阶段执行全局 DOM 查询或布局测量。
- 键盘导航单次为 O(n)，n 为菜单项数量；不在每次按键时重建 MenuItem 或重新挂载 DOM。
- MenuList 通过稳定回调合并容器事件，避免每次渲染产生重复监听器。
- 不为每个 MenuItem 注册独立 keydown 监听器。
- 不引入 `@floating-ui/react`、MUI、Emotion、`tabbable` 或其他运行时焦点管理依赖。
- 只参考 Floating UI 的分层、选项命名和核心算法，使用 Atelier 内部实现。
- 不迁移 `FloatingFocusManager`；initial focus 策略、Tab 焦点陷阱、focus guard、outside inert、close-on-focus-out 和 returnFocus 由未来的 Menu/Popover 变更负责。

#### 8.8 测试与验证

- hook 单测：方向键、Home/End、loop、disabledIndices、activeIndex 同步和 focus 调用。
- typeahead 单测：前缀匹配、重复字符、750ms 重置、findMatch、ignoreKeys 和输入法保护。
- MenuList 集成测试：初始无 active item、容器焦点激活首项、roving tabindex、动态注册、用户事件合并与受控/非受控单选。
- MenuItem 集成测试：独立使用、MenuList 注册、ref 合并、tabIndex、disabled 跳过和选中状态映射。
- 动态测试：条件渲染、wrapper、Fragment、重新排序和卸载清理。
- 性能验证：React Profiler 或等效测试确认键盘导航不会重建整个 item 集。
- 事件测试：用户 `onKeyDown` / `onFocus` 与 hooks 的组合顺序和 `preventDefault` 行为。

#### 8.9 备选方案与风险

备选方案：

- **直接引入 Floating UI**：可以复用成熟实现，但会增加运行时依赖、扩大包体和 API 耦合；本次只参考其分层和算法，不采用。
- **在 MenuList 内直接实现所有键盘逻辑**：会降低 hook 可复用性，并使组件难以单独测试；不采用。
- **使用 children 索引驱动 active item**：动态 children、wrapper 和 Fragment 容易失配；不采用。

主要风险与处理：

- hook 与组件职责重叠：以“hook 计算导航，MenuList 拥有引用和组合”为边界，代码审查时禁止在 MenuList 内复制方向键算法。
- 动态 DOM 顺序变化：MenuItem 注册时维护稳定 id，`ListCollection` store 在提交后重建有序节点列表与标签集合。
- 浮层与 MenuList 同时抢焦点：由上层负责打开焦点和焦点陷阱，MenuList 只在提交后聚焦 active item 或自身容器。
- 原生 disabled 无法聚焦：第一版不支持 `disabledItemsFocusable`；未来需要时先为 MenuItem 设计 `aria-disabled` 模式并更新规格。

#### 8.10 FloatingFocusManager 不迁移

本变更明确不迁移 Floating UI 的 `FloatingFocusManager`。

理由：

- 它的签名要求 `FloatingContext`（`open`、`onOpenChange`、`events`、`dataRef`、`elements.domReference`、`elements.floating`），内部还依赖 `useFloatingTree()`、`usePortalContext()` 和 `getNodeChildren()`；MenuList 是内联列表，没有这些输入。
- 0.27.20 的实现约 408 行，并依赖 `tabbable`、`@floating-ui/react/utils`、`@floating-ui/utils/dom` 和 `@floating-ui/react-dom`，与“不新增运行时依赖”的约束冲突。
- 其默认行为（`modal=true`、`guards=true`、`closeOnFocusOut=true`、`returnFocus=true`）面向浮层，不适用于内联菜单；内联菜单的 Tab 应自然离开列表。
- 现在复制会在未来的 Menu/Popover 中形成两个焦点管理器，产生重复 initial focus、重复 focus-out 关闭和 `inert` 冲突。

MenuList 只保留列表内职责：roving tabindex、方向键、Home/End 和 typeahead。

未来如需要浮层焦点能力，单独开 `atelier-overlay-focus` 变更，实现或引入最小 FocusScope；本变更 MUST NOT 复制 `FloatingFocusManager` 或引入其依赖。

## 测试策略

- 单元测试：selected、disabled、size、divider、children 组合、ref、原生属性透传。
- hook 测试：`useListNavigation` 的方向键、Home/End、loop、disabledIndices、activeIndex 和 focus；`useTypeahead` 的前缀匹配、重复字符、750ms 重置和输入法保护。
- MenuList 集成测试：初始无 active item、容器焦点激活首项、roving tabindex、动态注册、用户事件合并、受控/非受控单选和上层浮层焦点隔离。
- 主题测试：light/dark system 不包含与默认主题相同的值、关键 Ant Design token 值正确、system 名称不同、主题不包含结构变量。
- Storybook：basic、selected、size、disabled、divider、icon、状态总览、Ant Design light/dark 对比，以及 MenuList 键盘和 typeahead 示例。
- 构建验证：SCSS 编译通过，`dist/styles.css` 包含默认主题、Ant Design 组件几何与组件样式。

## 迁移方式

本次为纯新增能力，无破坏性变更。MenuItem 的几何从早期 MUI 草案调整为 Ant Design 6；由于组件尚未发布，不需要迁移现有调用方。
