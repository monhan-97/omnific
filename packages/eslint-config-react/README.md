# @omnific/eslint-config-react

React ESLint flat config.

## Breaking (2.0.0)

Accessibility rules now come from `eslint-plugin-jsx-a11y-x`. Rename custom overrides and settings from `jsx-a11y/*` / `jsx-a11y` to `jsx-a11y-x/*` / `jsx-a11y-x`.

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
