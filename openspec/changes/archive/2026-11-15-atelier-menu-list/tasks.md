# 任务

> 变更范围包含 MenuItem、MenuList、`useListNavigation`、`useTypeahead`、List 文本/图标组件与 Ant Design light/dark 皮肤。Menu、Popover、SubMenu、ItemGroup 和 Divider 不在本次范围内。

## 1. 基础结构与类型

- [x] 1.1 新建 `packages/atelier/menu/`，添加 `MenuItem.tsx`、`types.ts`、`constants.ts` 和 `index.ts`。
- [x] 1.2 新建 `packages/atelier/list/`，添加 `ListItemIcon.tsx`、`ListItemText.tsx`、`constants.ts` 和 `index.ts`。
- [x] 1.3 使用 `getPrefixCls('menu-item')`、`getPrefixCls('list-item-icon')` 与 `getPrefixCls('list-item-text')`，禁止手写 `atelier-` 前缀。
- [x] 1.4 定义 `MenuItemProps` 与 TSDoc；`MenuItemProps` 不强制要求 React `key`，`size` 复用 `ComponentSize`。
- [x] 1.5 确认 MenuItem 自身不包含 Menu、Popover、`component`、`as`、`icon`、`extra` 或 `theme`；MenuList 通过独立组件和 `atelier-menu-list` 规格提供。

## 2. MenuItem 状态与交互

- [x] 2.1 实现原生 `button` 渲染，默认 `type="button"`、`role="menuitem"`。
- [x] 2.2 实现 `selected`，输出 selected class、`data-selected` 与 `aria-current="page"`。
- [x] 2.3 实现 `disabled`，输出原生 disabled、`aria-disabled`、disabled class 与 `data-disabled`，并移除 tab 顺序。
- [x] 2.4 实现 `size` 与 `divider`，输出对应 class 与 data 属性。
- [x] 2.5 支持原生 button props、`className`、`style`、`tabIndex`、事件透传与 ref。
- [x] 2.6 使用 children 组合 `ListItemIcon` 与 `ListItemText`，不提供 `icon` / `extra` props。
- [x] 2.7 为 selected、disabled、size、divider、children 组合、ref 与原生属性透传添加测试。

## 3. List 文本/图标组件

- [x] 3.1 `ListItemIcon` 渲染原生 `span`，输出 `atelier-list-item-icon` class。
- [x] 3.2 `ListItemText` 渲染原生 `span`，输出 `atelier-list-item-text` class。
- [x] 3.3 两个组件支持 `className`、`style`、ref 与原生 span props 透传。
- [x] 3.4 使用 children 组合测试覆盖图标、文本和 MenuItem 结构。

## 4. 几何与状态样式

- [x] 4.1 在 `packages/atelier/styles/_variables.scss` 注册 `menu-item`、`list-item-icon` 与 `list-item-text` 组件前缀。
- [x] 4.2 新建 `list/styles/layout.scss`、`list/styles/theme.scss` 与 `list/styles/index.scss`。
- [x] 4.3 新建 `menu/styles/layout.scss`、`menu/styles/theme.scss` 与 `menu/styles/index.scss`。
- [x] 4.4 在 `packages/atelier/styles/index.scss` 聚合 list 与 menu 样式。
- [x] 4.5 对齐 Ant Design 6 的 8px 圆角 / 4px 外边距 / 16px 内边距 / 14px 字号，高度使用 control height scale。
- [x] 4.6 实现 size small 使用 `--control-height-sm` / 12px 内边距；MenuItem 内图标为 14px、右间距 10px。
- [x] 4.7 使用现有语义 token 实现 Ant Design hover、active、selected、focus-visible、disabled 与 divider。
- [x] 4.8 移除 `color-mix` 等高级 CSS 语法，移除硬编码 `atelier-` 选择器。
- [x] 4.9 使用 `--color-fg-disabled` 作为统一禁用颜色，禁用背景为透明。
- [x] 4.10 selected 文字使用 `--color-accent-fg`，selected hover 保持选中背景。
- [x] 4.11 focus-visible 使用 3px `--color-accent-border` 轮廓与 1px offset。
- [x] 4.12 divider 使用 `--color-border-muted`。
- [x] 4.13 MenuItem 复用 `ComponentSize`，使用 `--control-height-sm/md/lg` 实现 small/default/large 高度。

## 5. 导出与 Storybook

- [x] 5.1 在 `packages/atelier/menu/index.ts` 导出 `MenuItem` 与 `MenuItemProps`。
- [x] 5.2 在 `packages/atelier/list/index.ts` 导出 `ListItemIcon` 与 `ListItemText`。
- [x] 5.3 在 `packages/atelier/main.ts` 导出 MenuItem、ListItemIcon、ListItemText 与 ComponentSize。
- [x] 5.4 在 `packages/atelier/package.json` 增加 `./menu` 与 `./list` 子路径导出。
- [x] 5.5 在 `packages/atelier/menu/examples/` 添加 basic、selected、size、disabled、divider、icon、状态总览与主题对比示例。
- [x] 5.6 在 `packages/atelier/__stories__/menu-item.stories.tsx` 注册 Storybook。
- [x] 5.7 Storybook 使用构建后的 `dist/styles.css` 自动加载默认主题，不手动注入 `useTheme`。
- [x] 5.8 Storybook 的 selected 与 disabled 示例响应 Controls。

## 6. Ant Design light / dark 皮肤

- [x] 6.1 新增 `packages/atelier/system/themes/antd.ts`。
- [x] 6.2 导出 `antdLightTheme`、`antdDarkTheme`、`antdLightSystem` 与 `antdDarkSystem`。
- [x] 6.3 light/dark system 只声明 MenuItem 消费且与默认主题不同的颜色。
- [x] 6.4 light system 使用 Ant Design 6 default algorithm 的 MenuItem 关键颜色。
- [x] 6.5 dark system 使用 Ant Design 6 Menu `theme="dark"` 的关键颜色，不使用 darkAlgorithm。
- [x] 6.6 主题只包含 MenuItem 颜色，不包含完整 palette、高度、圆角、间距或字体。
- [x] 6.7 新增 Ant Design light/dark 对比 Storybook 示例。
- [x] 6.8 为主题 preset 添加单元测试。
- [x] 6.9 保持主题系统只负责颜色，尺寸由 MenuItem `size` variant 提供。

## 7. 文档与发布

- [x] 7.1 在 `packages/atelier/README.md` 使用英文补充 MenuItem、ListItemIcon、ListItemText 与 Ant Design light/dark 用法。
- [x] 7.2 更新或归档本变更的 README、示例说明和变更记录。
- [x] 7.3 添加 Changesets 发布说明，只描述新增 MenuItem、ListItemIcon、ListItemText、Ant Design light/dark 皮肤及其样式能力。
- [x] 7.4 确认 package 版本与 npm 发布状态。

## 8. 验证

- [x] 8.1 运行 `pnpm typecheck`。
- [x] 8.2 运行 `pnpm lint:fix`。
- [x] 8.3 运行系统与 MenuItem 测试。
- [x] 8.4 运行 `pnpm --filter @omnific/atelier build`。
- [x] 8.5 运行 `graphify update .`。
- [x] 8.6 运行根目录 `pnpm test`。
- [x] 8.7 运行根目录 `pnpm build`。
- [x] 8.8 检查 `openspec/changes/2026-11-15-atelier-menu-list/**/*.md` 中 MenuItem 与 MenuList 的交付范围已明确划分。
- [x] 8.9 在 `upstream-analysis.md` 记录 MUI 9.5 与 Floating UI 0.27.20 的 MenuList 焦点管理机制、来源 commit 和许可证。
- [x] 8.10 在 `design.md` 记录 MenuList 的分层职责、同名 hook、roving tabindex、typeahead、性能约束和依赖边界。
- [x] 8.11 新增 `specs/atelier-menu-list/spec.md`，把 MenuList、`useListNavigation`、`useTypeahead` 和 MenuItem 注册约定转为正式 Requirement / Scenario。

## 9. 非目标

- 不实现 Menu、Popover、SubMenu、ItemGroup 或 Divider。
- 不实现多选、selectedKeys、onDeselect 或 MenuRef；列表键盘导航和受控/非受控单选由 MenuList 和导航 hooks 提供。
- 不提供 component / as 多态 API。
- 不提供 icon / extra / theme props。

## 10. MenuList 与 Floating UI 同名 hooks 实施任务

> 本节是本次必须完成的任务。hook 负责导航算法，MenuList 负责引用、注册表和组合；不得在 MenuList 中复制 hook 已实现的方向键或 typeahead 逻辑。

### 10.1 规格与 API

- [x] 10.1 新增 `atelier-menu-list` 正式规格，覆盖 hooks、MenuList、MenuItem 注册和浮层职责边界。
- [x] 10.2 定义 `UseListNavigationOptions` 与 `UseListNavigationReturn` 类型。
- [x] 10.3 定义 `UseTypeaheadOptions`、`UseTypeaheadReturn` 与匹配函数类型。
- [x] 10.4 定义 `MenuListProps`，复用原生 div props，并支持 `onKeyDown`、`onFocus`、`onKeyUp`、`onClick`、children 和 ref。
- [x] 10.5 补充 `MenuItemProps` 的 TSDoc；typeahead 标签使用 `textContent`，不新增 `textValue` 字段。

### 10.2 useListNavigation

- [x] 10.6 实现 `getActiveIndex`、`getElement`、`getSize`、`onNavigate`、`enabled`、`orientation`、`loop`、`disabledIndices` 的 option 解析。
- [x] 10.7 实现可用项查找、索引越界回退、循环和 disabled 跳过。
- [x] 10.8 实现 `ArrowUp`、`ArrowDown`、`Home`、`End` 以及水平方向键行为。
- [x] 10.9 实现 `focusIndex`，通过 `focus({ preventScroll: true })` 移动真实 DOM 焦点。
- [x] 10.10 实现 `onFocus` / `onKeyDown` 与 `getItemProps`，合并用户事件并保持稳定的事件行为。
- [x] 10.11 忽略修饰键和输入法组合状态，避免与 typeahead、浏览器默认行为冲突。
- [x] 10.12 为 `useListNavigation` 添加方向键、循环、禁用项、Home/End、越界回退和事件合并测试。

### 10.3 useTypeahead

- [x] 10.13 实现字符串缓冲、超时计时器、上一次匹配索引和默认 `750ms` 重置。
- [x] 10.14 实现前缀匹配、从当前项之后轮转、连续相同字符循环和未匹配回退。
- [x] 10.15 实现 `findMatch`、`ignoreKeys`、`getLabels`、`getSelectedIndex`、修饰键过滤和输入法组合状态保护。
- [x] 10.16 返回可合并的 `onKeyDown` / `onKeyUp`，并在空格释放时结束输入状态。
- [x] 10.17 保证 typeahead 只通过 `onMatch` 通知调用方，不直接修改 activeIndex。
- [x] 10.18 为 `useTypeahead` 添加前缀、重复字符、超时、findMatch、ignoreKeys 和输入法测试。

### 10.4 MenuList 组合

- [x] 10.19 在 MenuList 内维护 `ListCollection` store、`ListState` store、MenuItem 注册表和 activeIndex 状态。
- [x] 10.20 MenuItem 注册 DOM element 与 label；disabled / selected 由 MenuItem 自身输出到 DOM；卸载时清理注册。
- [x] 10.21 在 MenuList 中引用 `useListNavigation` 与 `useTypeahead`，并合并两者提供的容器事件。
- [x] 10.22 内部 activeIndex 初始为 `null`；容器获得焦点或导航时再设置。
- [x] 10.23 实现 active item 的 `tabIndex=0`、其他 item 的 `tabIndex=-1` 和 disabled 跳过。
- [x] 10.24 在内部维护 activeIndex 变化；不在挂载时主动抢占焦点。
- [x] 10.25 渲染 `role="menu"`、`aria-orientation="vertical"`、`tabIndex=-1`，并透传用户 ref 和原生 props。
- [x] 10.26 合并用户 `onKeyDown` / `onFocus`，并让 MenuItem 通过 `getItemProps(index, userProps)` 合并 item 用户事件，保证 hooks 处理后仍能调用用户处理器。
- [x] 10.27 为 MenuList 添加初始无 active item、容器焦点激活首项、方向键、动态注册、事件合并和焦点隔离测试。

### 10.5 MenuItem 集成

- [x] 10.28 MenuItem 可选读取 MenuList 注册 Context；无 Context 时保持当前独立 button 行为。
- [x] 10.29 合并用户 ref 与 MenuList 注册 ref，确保 ref 始终指向原生 button。
- [x] 10.30 MenuList 中 MenuItem 的 `onFocus` 同步 activeIndex，同时保留用户传入的 `onFocus`。
- [x] 10.31 为 MenuItem 添加独立使用、MenuList 注册、ref 合并和 tabIndex 测试。

### 10.6 导出、示例与文档

- [x] 10.32 从 `@omnific/atelier/menu` 导出 `MenuList`、`useListNavigation`、`useTypeahead` 及其类型，从 `@omnific/atelier/navigation` 导出 `ListCollection`、hooks 及其类型。
- [x] 10.33 从 `@omnific/atelier` 主入口导出新增组件、hooks 和类型。
- [x] 10.34 添加 MenuList 的 selected、disabled、键盘导航和 typeahead Storybook 示例。
- [x] 10.35 使用英文更新 `packages/atelier/README.md`，补充 MenuList、hooks、键盘行为和焦点边界。
- [x] 10.36 为 MenuList、hooks 和 MenuItem 新增 props / 注册约定补充 TSDoc。
- [x] 10.37 添加 Changesets 发布说明，只描述 MenuList、导航 hooks 和 MenuItem 注册能力。

### 10.7 性能、依赖与验证

- [x] 10.38 确认 MenuList 不在渲染阶段执行全局 DOM 查询、布局测量或重复 keydown 绑定。
- [x] 10.39 确认方向键导航不重新挂载 MenuItem、不重建整个列表，并使用 React Profiler 或等效测试验证。
- [x] 10.40 确认未新增 `@floating-ui/react`、MUI、Emotion 或其他运行时焦点管理依赖。
- [x] 10.41 确认未复制 Floating UI 或 MUI 源码；如后续引入任何第三方实现，补充对应许可证和版权声明。
- [x] 10.42 运行 `pnpm typecheck` 和 `pnpm lint:fix`。
- [x] 10.43 运行 `pnpm test` 和根目录 `pnpm build`。
- [x] 10.44 运行 `graphify update .`，确认 MenuList、hooks 和 MenuItem 关系已同步。
- [x] 10.45 确认未迁移或复制 `FloatingFocusManager`，未实现 initial focus 策略、Tab 焦点陷阱、focus guard、outside inert、close-on-focus-out 或 returnFocus。
- [x] 10.46 在 `upstream-analysis.md`、`design.md` 和 `specs/atelier-menu-list/spec.md` 中记录 `FloatingFocusManager` 不迁移的决策，并说明未来由独立浮层变更承接。

### 10.8 MenuList 尺寸

- [x] 10.47 为 MenuList 增加 `size`，通过根节点 `data-size` 与 CSS 自定义属性向 MenuItem 传播；MenuItem 的 `size` 保持覆盖优先。
- [x] 10.48 为 MenuList size 添加测试、Storybook 示例和 README 说明。

### 10.9 MenuList 单选

- [x] 10.49 为 MenuList 增加 `selectedKey`、`defaultSelectedKey` 和 `onSelect`。
- [x] 10.50 通过 MenuItem `value` 参与列表选中；列表选中覆盖 MenuItem 自身 `selected`。
- [x] 10.51 实现受控/非受控单选、已选中项不重复触发 `onSelect` 和 `aria-checked` 映射。
- [x] 10.52 添加受控、非受控、重复点击和 checkable role 测试、Storybook 示例与 README 说明。
