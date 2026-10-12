# @omnific/atelier

A refined React component library for Omnific.

```tsx
import { Button } from '@omnific/atelier';
import { createSystem, defaultColors, useTheme } from '@omnific/atelier/system';
import '@omnific/atelier/styles.css';

const system = createSystem('app', defaultColors);

function App() {
  useTheme(system); // injects CSS variables onto :root
  return (
    <Button color='primary' variant='solid'>
      Continue
    </Button>
  );
}
```

Color values come from `createSystem` and are injected at runtime by `useTheme`.
Spacing, radii, fonts, control heights, shadows, body defaults, border-box sizing and component styles ship via `@omnific/atelier/styles.css`.

## Storybook

Curated component examples live under `packages/atelier/__stories__` and
`packages/*/examples`. Run Storybook from the repository root:

- Local dev: `pnpm storybook`
- Production build: `pnpm build:storybook`
- Static output: `packages/atelier/storybook-static`
- Online preview: https://monhan-97.github.io/omnific/atelier/
