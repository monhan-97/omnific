import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import jsxA11yESLintPlugin from 'eslint-plugin-jsx-a11y';

const reactESLintConfig = defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11yESLintPlugin,
    },
    extends: [eslintReact.configs['recommended-typescript']],
    rules: {
      // jsx-a11y
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          aspects: ['noHref', 'invalidHref'],
        },
      ],
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
    },
  },
]);

export default reactESLintConfig;
