import { defineConfig, globalIgnores } from 'eslint/config';

import omnificEslintConfig from '@omnific/eslint-config';
import omnificReactEslintConfig from '@omnific/eslint-config-react';

export default defineConfig([
  globalIgnores(['**/build/', '**/dist/', '**/pages-artifact/', '**/storybook-static/']),
  {
    extends: [omnificEslintConfig, omnificReactEslintConfig],
  },
]);
