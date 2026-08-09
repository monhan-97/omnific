# @omnific/react-scripts

Usage:

```sh
npm i -D @omnific/react-scripts @swc/helpers
```

In `package.json`:

```json
{
  "scripts": {
    "dev": "react-scripts dev",
    "build": "react-scripts build"
  }
}
```

Create `react-scripts.config.ts`, `react-scripts.config.mts`, `react-scripts.config.mjs`, or `react-scripts.config.cjs` if you need to customize Rspack.

Use `.mjs` or `.cjs` if your runtime Node.js version does not support native TypeScript imports.

## Optional Style Integrations

`@omnific/react-scripts` supports plain CSS by default. Tailwind CSS and Sass are optional
integrations and should be installed by the application only when they are used.

### Tailwind CSS

Install Tailwind and the PostCSS integration in your app:

```sh
pnpm add -D tailwindcss @tailwindcss/postcss
```

When `tailwindcss` is resolvable from the app root, `react-scripts` enables
`@tailwindcss/postcss` automatically.

### Sass

Install Sass support in your app:

```sh
pnpm add -D sass-loader sass-embedded
```

When both `sass-loader` and `sass-embedded` are resolvable from the app root,
`react-scripts` enables `.scss` and `.sass` handling automatically.

Client utilities:

```ts
import { isDevelopment, isProduction } from '@omnific/react-scripts';

if (isDevelopment()) {
  // Development-only logic
}

if (isProduction()) {
  // Production-only logic
}
```
