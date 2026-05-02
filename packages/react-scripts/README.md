# @omnific/react-scripts

Usage:

```sh
npm i -D  @omnific/react-scripts @swc/helpers tailwindcss
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
