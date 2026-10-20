# @omnific/eslint-config-react

React ESLint flat config.

## Breaking

Accessibility rules come from `@omnific/eslint-plugin-jsx-a11y`.

- Rule ids use the `jsx-a11y/*` prefix (not `jsx-a11y-x/*`).
- Settings key is `jsx-a11y` (not `jsx-a11y-x`).

Rename any custom overrides accordingly.

## Install

```sh
npm install -D @omnific/eslint-config-react eslint
```

## Usage

Create `eslint.config.js`:

```js
import { defineConfig } from 'eslint/config';
import omnificReactEslintConfig from '@omnific/eslint-config-react';

export default defineConfig({
  extends: [omnificReactEslintConfig],
});
```

## Compose with the base config

If you also want the shared JS/TS base rules, compose them explicitly:

```js
import { defineConfig } from 'eslint/config';
import omnificEslintConfig from '@omnific/eslint-config';
import omnificReactEslintConfig from '@omnific/eslint-config-react';

export default defineConfig({
  extends: [omnificEslintConfig, omnificReactEslintConfig],
});
```
