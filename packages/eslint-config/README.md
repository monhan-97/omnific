# @omnific/eslint-config

Base ESLint flat config for JavaScript and TypeScript projects.

## Install

```sh
npm install -D @omnific/eslint-config eslint
```

## Usage

Create `eslint.config.js`:

```js
import { defineConfig } from 'eslint/config';
import omnificEslintConfig from '@omnific/eslint-config';

export default defineConfig({
  extends: [omnificEslintConfig],
});
```

When `.gitignore` exists in `process.cwd()` and contains patterns, it is applied as ESLint global ignores; otherwise the built-in default ignore list is used.

## React projects

React rules are published separately in `@omnific/eslint-config-react`, so non-React projects do not install React-specific plugins.
