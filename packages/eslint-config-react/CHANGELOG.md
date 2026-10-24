# @omnific/eslint-config-react

## Unreleased

### Major Changes

- Replace `eslint-plugin-jsx-a11y-x` with `@omnific/eslint-plugin-jsx-a11y`.

  Migration: rename custom rule overrides and settings from `jsx-a11y-x/*` / `jsx-a11y-x` to `jsx-a11y/*` / `jsx-a11y`.

## 3.0.0

### Major Changes

- 787fc26: Add `@omnific/eslint-plugin-jsx-a11y` (TypeScript rewrite of `eslint-plugin-jsx-a11y-x@0.2.0`) and switch `@omnific/eslint-config-react` to it.

  **BREAKING** (`@omnific/eslint-config-react`): rename rule overrides and settings from `jsx-a11y-x/*` / `jsx-a11y-x` to `jsx-a11y/*` / `jsx-a11y`. No compatibility aliases.

  Runtime footprint drops axe-core and minimatch in favor of a local WHATWG autocomplete check and picomatch.

### Patch Changes

- Updated dependencies [787fc26]
  - @omnific/eslint-plugin-jsx-a11y@0.2.0

## 2.0.0

### Major Changes

- Replace `eslint-plugin-jsx-a11y` with `eslint-plugin-jsx-a11y-x` and raise `@eslint-react/eslint-plugin`.

  Migration: rename custom rule overrides and settings from `jsx-a11y/*` / `jsx-a11y` to `jsx-a11y-x/*` / `jsx-a11y-x`.

## 1.0.6

### Patch Changes

- Update `@eslint-react/eslint-plugin` to v5.20.

## 1.0.5

### Patch Changes

- Add shared empty-value predicates and ref composition hooks, migrate React scripts to native Rspack utilities, and refresh lint and build dependencies.

  Remove the deprecated `isURLSearchParams` and `getEnv` aliases in favor of `isURLSearchParameters` and `getEnvironment`.

## 1.0.4

### Patch Changes

- Add request-level default `withCredentials` support, expose normalized utility names, and refresh package documentation.

  - `@omnific/request` now supports `createRequest({ withCredentials })` defaults that can be overridden per request.
  - `@omnific/store` exposes the clearer `AtomSetterArguments` type name for atom setter arguments.
  - `@omnific/utils` exposes `isURLSearchParameters` while keeping the root `isURLSearchParams` alias.
  - `@omnific/react-scripts` documents client environment helpers and keeps generated exports aligned with the linted source names.
  - `@omnific/types` updates its package file list for the renamed `utilities.ts` source.
  - `@omnific/eslint-config` and `@omnific/eslint-config-react` update lint plugin dependencies.

## 1.0.3

### Patch Changes

- Update the React ESLint plugin dependency.

## 1.0.2

### Patch Changes

- Update the React ESLint plugin dependency.
