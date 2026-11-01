# @omnific/eslint-plugin-jsx-a11y

## 0.2.2

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.5.0

## 0.2.0

## 0.2.1

### Patch Changes

- Republish with resolved workspace dependency versions (fix accidental `workspace:*` on npm).

### Minor Changes

- 787fc26: Add `@omnific/eslint-plugin-jsx-a11y` (TypeScript rewrite of `eslint-plugin-jsx-a11y-x@0.2.0`) and switch `@omnific/eslint-config-react` to it.

  **BREAKING** (`@omnific/eslint-config-react`): rename rule overrides and settings from `jsx-a11y-x/*` / `jsx-a11y-x` to `jsx-a11y/*` / `jsx-a11y`. No compatibility aliases.

  Runtime footprint drops axe-core and minimatch in favor of a local WHATWG autocomplete check and picomatch.
