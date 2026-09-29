# @omnific/atelier

A refined React component library for Omnific.

```tsx
import { Button } from '@omnific/atelier';
import { createSystem, defaultConfig, useTheme } from '@omnific/atelier/system';
import '@omnific/atelier/styles.css';

const system = createSystem('app', defaultConfig);

function App() {
  useTheme(system); // injects CSS variables onto :root
  return <Button variant='primary'>Continue</Button>;
}
```

Token values come from `createSystem` and are injected at runtime by `useTheme`.
Component layout/theme CSS still ships via `@omnific/atelier/styles.css`.

## Storybook

Curated component examples live under `packages/atelier/__stories__` and
`packages/*/examples`. Run Storybook from the repository root:

- Local dev: `pnpm storybook`
- Production build: `pnpm build:storybook`
- Static output: `packages/atelier/storybook-static`
- Online preview: https://monhan-97.github.io/omnific/atelier/
