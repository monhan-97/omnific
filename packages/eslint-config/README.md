# eslint-config


Usage

```sh
npm install @omnific/eslint-config -D
```

Create `eslint.config.js`:

```js
import { base } from '@omnific/eslint-config';

const eslintConfig = [...base];

export default eslintConfig;
```

If you're using `React`,like this

```js
import { base,react } from '@omnific/eslint-config';

const eslintConfig = [...base,...react];

export default eslintConfig;
```