# @omnific/atelier

A refined React component library for Omnific.

```tsx
import { Button } from '@omnific/atelier';
import { createTheme, useTheme } from '@omnific/atelier/system';
import '@omnific/atelier/styles.css';

const system = createTheme('app');

function App() {
  useTheme(system); // injects CSS variables onto :root
  return (
    <Button color='primary' variant='solid'>
      Continue
    </Button>
  );
}
```

Color values come from `createTheme`, which turns the provided `ThemeConfig`
into the variables that differ from `defaultSystem`. `@omnific/atelier/styles.css`
includes the default theme colors as a zero-specificity `:where(:root)` fallback,
so omitted variables continue to use the default theme.

Each `ThemeConfig` describes one theme. Define separate systems for light, dark,
or brand themes and switch by selecting a different system:

```tsx
const darkTheme = {
  tokens: {
    colors: {
      gray: {
        50: '#fafafa',
        900: '#18181b',
      },
    },
  },
  semanticTokens: {
    colors: {
      bg: { base: '{colors.gray.900}' },
      fg: { base: '{colors.gray.50}' },
      accent: {
        solid: '#60a5fa',
        hover: '#3b82f6',
        active: '#2563eb',
      },
    },
  },
};

const lightSystem = createTheme('light');
const darkSystem = createTheme('dark', darkTheme);

const themeRegistry = {
  light: lightSystem,
  dark: darkSystem,
} as const;

function App(props: { themeName: keyof typeof themeRegistry }) {
  // Every theme system contains only the variables declared by its theme config.
  useTheme(themeRegistry[props.themeName]);
  return <Button color='primary'>Continue</Button>;
}
```

`ThemeConfig` is intentionally limited to `tokens` and `semanticTokens`; theme
selection state such as `mode`, `themes`, or `setTheme` belongs to the application.

Theme systems contain only the colors declared by their config, so the default
colors shipped by `@omnific/atelier/styles.css` remain the base layer. Local
themed elements follow the same override model: they override only the variables
they declare, while undeclared variables inherit from the nearest ancestor
scope.

Spacing, radii, fonts, control heights, shadows, body defaults, border-box sizing
and component styles ship via `@omnific/atelier/styles.css`.

## Menus

### Menu items

`MenuItem` renders a standalone native button with menu semantics. Compose its
content with `ListItemIcon` and `ListItemText` from `@omnific/atelier/list`.

```tsx
import { MenuItem } from '@omnific/atelier';
import { ListItemIcon, ListItemText } from '@omnific/atelier/list';

<MenuItem aria-current='page' selected>
  <ListItemIcon aria-hidden='true'>H</ListItemIcon>
  <ListItemText>Home</ListItemText>
</MenuItem>;
```

`selected`, `disabled`, `size`, and `divider` map to menu item state, data
attributes, and accessible attributes. A `MenuItem` works without `MenuList`;
inside a list it registers itself for navigation. Use `label` to provide an
explicit typeahead label when the children contain icons or the displayed text
should not be used for search.

### MenuList

`MenuList` composes `useListNavigation` and `useTypeahead` to provide roving
tabindex navigation and typeahead for a collection of `MenuItem` components.

```tsx
import { MenuItem, MenuList } from '@omnific/atelier';
import { ListItemText } from '@omnific/atelier/list';
import '@omnific/atelier/styles.css';

function NavigationMenu() {
  return (
    <MenuList aria-label='Main navigation' tabIndex={0}>
      <MenuItem selected>
        <ListItemText>Home</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>Projects</ListItemText>
      </MenuItem>
      <MenuItem disabled>
        <ListItemText>Billing</ListItemText>
      </MenuItem>
    </MenuList>
  );
}
```

`MenuList` uses a roving tabindex. Add `tabIndex={0}` when the list itself is
the keyboard entry point; when it lives in a popup, the trigger layer should
focus it instead.

`selected` only controls the selected visual state and `data-selected`. For
navigation menus, pass `aria-current='page'` explicitly. For checkable menus,
use `role='menuitemradio'` or `role='menuitemcheckbox'`; `selected` then maps to
`aria-checked`. Keyboard navigation keeps its active item in `MenuList` state
and does not require a selected index.

For single selection, give each item a `value` and use `selectedKey` or
`defaultSelectedKey`. `onSelect` receives the next selected key.

```tsx
import { useState } from 'react';

function ProjectMenu() {
  const [selectedKey, setSelectedKey] = useState('overview');

  return (
    <MenuList selectedKey={selectedKey} onSelect={setSelectedKey}>
      <MenuItem value='overview' role='menuitemradio'>
        <ListItemText>Overview</ListItemText>
      </MenuItem>
      <MenuItem value='activity' role='menuitemradio'>
        <ListItemText>Activity</ListItemText>
      </MenuItem>
    </MenuList>
  );
}
```

When `value` is provided inside `MenuList`, the list selection overrides the
individual `selected` prop. Clicking the currently selected item does not call
`onSelect`. Multi-selection is not supported yet; `selectedKey` and
`defaultSelectedKey` intentionally stay singular until that API is added.

### Ant Design menu themes

The system subpath exports `antdLightSystem` and `antdDarkSystem`. Both systems
only declare the menu colors that differ from the Atelier default theme, so
undeclared variables continue to inherit from `:root`.

```tsx
import { MenuItem } from '@omnific/atelier';
import { antdDarkSystem, useTheme } from '@omnific/atelier/system';

function DarkMenu() {
  const themeRef = useTheme(antdDarkSystem);

  return (
    <div ref={themeRef}>
      <MenuItem>Dark item</MenuItem>
    </div>
  );
}
```

### Sizes

`MenuList` accepts `size="small" | "default" | "large"`. The list size is
propagated through inherited CSS custom properties: `--menu-item-height`,
`--menu-item-padding-inline`, and `--menu-item-font-size`. An individual
`MenuItem` can override the list size with its own `size` prop.

```tsx
<MenuList size='small'>
  <MenuItem>Compact item</MenuItem>
  <MenuItem size='large'>Large override</MenuItem>
</MenuList>
```

### Keyboard behavior

- `ArrowUp` / `ArrowDown` move focus in vertical lists; `ArrowLeft` /
  `ArrowRight` move focus when `aria-orientation='horizontal'`. `MenuList`
  wraps around at the ends.
- `Home` / `End` move focus to the first or last enabled item.
- Printable characters start typeahead. The search buffer resets after 750ms,
  and repeating the same first letter cycles through matching items.
- Disabled items are skipped. Menus use a roving tabindex: the active item has
  `tabIndex=0` and every other item has `tabIndex=-1`.
- The initial render has no active item. Focusing the `MenuList` container
  activates the first enabled item; focusing or clicking an item synchronizes
  the active index.

### Focus boundary

`MenuList` only manages navigation inside the list. It does not open or close a
popup, position an overlay, trap Tab focus, close on Escape or outside focus, or
restore focus to a trigger. Those responsibilities belong to a future
Menu/Popover layer.

### Navigation hooks

The navigation subpath exports the building blocks used by `MenuList`:

```tsx
import {
  ListCollection,
  useInteractions,
  useListItem,
  useListNavigation,
  useTypeahead,
} from '@omnific/atelier/navigation';
```

For menu-focused imports, `@omnific/atelier/menu` also re-exports
`useListNavigation` and `useTypeahead` with their option types.

`useListNavigation` owns arrow-key navigation and imperative focus.
`useListNavigation` and `useTypeahead` read list data through getters so they can
work with the `ListCollection` store or custom refs:

- `useListNavigation` uses `getActiveIndex`, `getElement`, and `getSize`.
- `useTypeahead` uses `getActiveIndex`, `getLabels`, and optionally
  `getSelectedIndex`.

`useTypeahead` follows Floating UI's label-array contract: `getLabels` returns an
array of strings and `null` entries are skipped. It only reports the matched
index through `onMatch`; it does not change the active index or move focus. A
controlled composition must pass the match to both the active index state and
the navigation focus API:

```tsx
const elementsRef = useRef<Array<HTMLElement | null>>([]);
const labelsRef = useRef<Array<string | null>>([]);

const navigation = useListNavigation({
  getActiveIndex: () => activeIndex,
  getElement: index => elementsRef.current[index] ?? undefined,
  getSize: () => elementsRef.current.length,
  onNavigate: setActiveIndex,
});

const typeahead = useTypeahead({
  getActiveIndex: () => activeIndex,
  getLabels: () => labelsRef.current,
  onMatch: index => {
    setActiveIndex(index);
    navigation.focusIndex(index);
  },
});

const interactions = useInteractions([navigation, typeahead]);
```

Use `ListCollection` with `useListItem` to register item elements in DOM order,
or provide your own getters. Disabled `MenuItem` components write `null` to the
label array, so typeahead never matches them.

## Storybook

Curated component examples live under `packages/atelier/__stories__` and
`packages/*/examples`. Run Storybook from the repository root:

- Local dev: `pnpm storybook`
- Production build: `pnpm build:storybook`
- Static output: `packages/atelier/storybook-static`
- Online preview: https://monhan-97.github.io/omnific/atelier/
