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

## Storybook

Curated component examples live under `packages/atelier/__stories__` and
`packages/*/examples`. Run Storybook from the repository root:

- Local dev: `pnpm storybook`
- Production build: `pnpm build:storybook`
- Static output: `packages/atelier/storybook-static`
- Online preview: https://monhan-97.github.io/omnific/atelier/
