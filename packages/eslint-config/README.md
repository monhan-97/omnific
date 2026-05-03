# eslint-config


Usage

```sh
npm install @omnific/eslint-config -D
```

Create `eslint.config.js`:

```js
import { defineConfig } from 'eslint/config';
import omnificEslintConfig from '@omnific/eslint-config';

export default defineConfig({
  extends: [omnificEslintConfig],
});
```

If you're using `React`,like this

```js
import { defineConfig } from 'eslint/config';
import omnificEslintConfig, { react } from '@omnific/eslint-config';

export default defineConfig({
  extends: [omnificEslintConfig, react],
});
```
