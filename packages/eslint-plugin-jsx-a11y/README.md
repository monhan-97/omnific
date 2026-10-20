# @omnific/eslint-plugin-jsx-a11y

JSX accessibility ESLint plugin for Omnific. TypeScript rewrite of [`eslint-plugin-jsx-a11y-x`](https://github.com/eslint-community/eslint-plugin-jsx-a11y-x) (commit `ec06126`), MIT-licensed with upstream copyright retained.

## Install

```bash
pnpm add -D @omnific/eslint-plugin-jsx-a11y eslint
```

## Usage (`eslint.config.js`)

Flat config only.

```js
import jsxA11y from '@omnific/eslint-plugin-jsx-a11y';

export default [
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },
];
```

Or extend a named config:

```js
import jsxA11y from '@omnific/eslint-plugin-jsx-a11y';

export default [
  jsxA11y.configs.recommended,
  // or: jsxA11y.configs.strict
];
```

Prefer consuming this plugin through [`@omnific/eslint-config-react`](../eslint-config-react), which wires the `jsx-a11y` plugin key and the shared React rule set.

### Configs

| Config | Purpose |
| --- | --- |
| `configs.recommended` | Default accessibility baseline (matches upstream recommended) |
| `configs.strict` | Stricter options on several interaction / role rules |

### Settings

Configure under `settings['jsx-a11y']` (not `jsx-a11y-x`):

```js
export default [
  {
    settings: {
      'jsx-a11y': {
        components: {
          Link: 'a',
          Image: 'img',
        },
        polymorphicPropName: 'as',
        polymorphicAllowList: ['Box'],
      },
    },
  },
];
```

| Setting | Description |
| --- | --- |
| `components` | Map custom component names to DOM element names |
| `polymorphicPropName` | Prop used to resolve polymorphic elements |
| `polymorphicAllowList` | Component names allowed to use the polymorphic prop |

## Migrating from `eslint-plugin-jsx-a11y-x`

1. Replace the dependency with `@omnific/eslint-plugin-jsx-a11y`.
2. Rename the plugin key and rule ids from `jsx-a11y-x` / `jsx-a11y-x/*` to `jsx-a11y` / `jsx-a11y/*`.
3. Rename settings from `settings['jsx-a11y-x']` to `settings['jsx-a11y']`.
4. Keep rule options; behavior is intended to match upstream `0.2.0` (`ec06126`).

## Rules

| Rule | Description | Config |
| --- | --- | --- |
| [`alt-text`](docs/rules/alt-text.md) | Enforce all elements that require alternative text have meaningful information to relay back to end user. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`anchor-ambiguous-text`](docs/rules/anchor-ambiguous-text.md) | Enforce `<a>` text to not exactly match "click here", "here", "link", or "a link". | 🚫 disabled in ☑️ recommended |
| [`anchor-has-content`](docs/rules/anchor-has-content.md) | Enforce all anchors to contain accessible content. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`anchor-is-valid`](docs/rules/anchor-is-valid.md) | Enforce all anchors are valid, navigable elements. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`aria-activedescendant-has-tabindex`](docs/rules/aria-activedescendant-has-tabindex.md) | Enforce elements with aria-activedescendant are tabbable. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`aria-props`](docs/rules/aria-props.md) | Enforce all `aria-*` props are valid. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`aria-proptypes`](docs/rules/aria-proptypes.md) | Enforce ARIA state and property values are valid. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`aria-role`](docs/rules/aria-role.md) | Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`aria-unsupported-elements`](docs/rules/aria-unsupported-elements.md) | Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`autocomplete-valid`](docs/rules/autocomplete-valid.md) | Enforce that autocomplete attributes are used correctly. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`click-events-have-key-events`](docs/rules/click-events-have-key-events.md) | Enforce a clickable non-interactive element has at least one keyboard event listener. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`control-has-associated-label`](docs/rules/control-has-associated-label.md) | Enforce that a control (an interactive element) has a text label. | 🚫 disabled in ☑️ recommended, 🔒 strict |
| [`heading-has-content`](docs/rules/heading-has-content.md) | Enforce heading (`h1`, `h2`, etc) elements contain accessible content. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`html-has-lang`](docs/rules/html-has-lang.md) | Enforce `<html>` element has `lang` prop. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`iframe-has-title`](docs/rules/iframe-has-title.md) | Enforce iframe elements have a title attribute. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`img-redundant-alt`](docs/rules/img-redundant-alt.md) | Enforce `<img>` alt prop does not contain the word "image", "picture", or "photo". | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`interactive-supports-focus`](docs/rules/interactive-supports-focus.md) | Enforce that elements with interactive handlers like `onClick` must be focusable. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`label-has-associated-control`](docs/rules/label-has-associated-control.md) | Enforce that a `label` tag has a text label and an associated control. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`lang`](docs/rules/lang.md) | Enforce lang attribute has a valid value. | — not in recommended / strict |
| [`media-has-caption`](docs/rules/media-has-caption.md) | Enforces that `<audio>` and `<video>` elements must have a `<track>` for captions. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`mouse-events-have-key-events`](docs/rules/mouse-events-have-key-events.md) | Enforce that `onMouseOver`/`onMouseOut` are accompanied by `onFocus`/`onBlur` for keyboard-only users. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-access-key`](docs/rules/no-access-key.md) | Enforce that the `accessKey` prop is not used on any element to avoid complications with keyboard commands used by a screen reader. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-aria-hidden-on-focusable`](docs/rules/no-aria-hidden-on-focusable.md) | Disallow `aria-hidden="true"` from being set on focusable elements. | — not in recommended / strict |
| [`no-autofocus`](docs/rules/no-autofocus.md) | Enforce autoFocus prop is not enabled. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-distracting-elements`](docs/rules/no-distracting-elements.md) | Enforce distracting elements are not used. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-interactive-element-to-noninteractive-role`](docs/rules/no-interactive-element-to-noninteractive-role.md) | Disallow interactive elements being assigned non-interactive roles. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-noninteractive-element-interactions`](docs/rules/no-noninteractive-element-interactions.md) | Disallow non-interactive elements being assigned mouse or keyboard event listeners. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-noninteractive-element-to-interactive-role`](docs/rules/no-noninteractive-element-to-interactive-role.md) | Disallow non-interactive elements being assigned interactive roles. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-noninteractive-tabindex`](docs/rules/no-noninteractive-tabindex.md) | Enforce `tabIndex` only be declared on interactive elements. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-redundant-roles`](docs/rules/no-redundant-roles.md) | Enforce explicit role property is not the same as implicit/default role property on element. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`no-static-element-interactions`](docs/rules/no-static-element-interactions.md) | Enforce that non-interactive, visible elements (such as `<div>`) that have click handlers use the role attribute. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`prefer-tag-over-role`](docs/rules/prefer-tag-over-role.md) | Enforces using semantic DOM elements over the ARIA `role` property. | — not in recommended / strict |
| [`role-has-required-aria-props`](docs/rules/role-has-required-aria-props.md) | Enforce that elements with ARIA roles must have all required attributes for that role. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`role-supports-aria-props`](docs/rules/role-supports-aria-props.md) | Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role`. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`scope`](docs/rules/scope.md) | Enforce `scope` prop is only used on `<th>` elements. | 💼 enabled in ☑️ recommended, 🔒 strict |
| [`tabindex-no-positive`](docs/rules/tabindex-no-positive.md) | Enforce `tabIndex` value is not greater than zero. | 💼 enabled in ☑️ recommended, 🔒 strict |

## Scripts

| Script | Description |
| --- | --- |
| `pnpm test` | Run vitest |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Build `dist/` with tsdown |

## License

MIT. See [`LICENSE`](./LICENSE) for upstream and Omnific copyright notices.
