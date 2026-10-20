import type { Linter } from 'eslint';

/**
 * Shared flat-config language options enabling JSX parsing for a11y rules.
 */
const flatConfigBase: Linter.Config = {
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

export default flatConfigBase;
