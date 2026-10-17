import { defineConfig } from 'eslint/config';

import omnificEslintConfig from '@omnific/eslint-config';
import omnificReactEslintConfig from '@omnific/eslint-config-react';

const config = defineConfig([
  {
    extends: [omnificEslintConfig, omnificReactEslintConfig],
  },
]);

export default config;
