import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import jsxA11yXESLintPlugin from 'eslint-plugin-jsx-a11y-x';

const reactESLintConfig = defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y-x': jsxA11yXESLintPlugin,
    },
    extends: [eslintReact.configs['recommended-typescript']],
    rules: {
      // jsx-a11y-x
      'jsx-a11y-x/alt-text': 'error',
      'jsx-a11y-x/anchor-has-content': 'error',
      'jsx-a11y-x/anchor-is-valid': [
        'error',
        {
          aspects: ['noHref', 'invalidHref'],
        },
      ],
      'jsx-a11y-x/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y-x/aria-props': 'error',
      'jsx-a11y-x/aria-proptypes': 'error',
      'jsx-a11y-x/aria-role': ['error', { ignoreNonDOM: true }],
      'jsx-a11y-x/aria-unsupported-elements': 'error',
      'jsx-a11y-x/heading-has-content': 'error',
      'jsx-a11y-x/iframe-has-title': 'error',
      'jsx-a11y-x/img-redundant-alt': 'error',
      'jsx-a11y-x/no-access-key': 'error',
      'jsx-a11y-x/no-distracting-elements': 'error',
      'jsx-a11y-x/no-redundant-roles': 'error',
      'jsx-a11y-x/role-has-required-aria-props': 'error',
      'jsx-a11y-x/role-supports-aria-props': 'error',
      'jsx-a11y-x/scope': 'error',
    },
  },
]);

export default reactESLintConfig;
