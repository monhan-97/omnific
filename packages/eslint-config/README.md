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

## React projects

React rules are published separately in `@omnific/eslint-config-react`, so non-React projects do not install React-specific plugins.
