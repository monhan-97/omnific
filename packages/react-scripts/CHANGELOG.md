# @omnific/react-scripts

## 0.2.1

### Patch Changes

- Add request-level default `withCredentials` support, expose normalized utility names, and refresh package documentation.

  - `@omnific/request` now supports `createRequest({ withCredentials })` defaults that can be overridden per request.
  - `@omnific/store` exposes the clearer `AtomSetterArguments` type name for atom setter arguments.
  - `@omnific/utils` exposes `isURLSearchParameters` while keeping the root `isURLSearchParams` alias.
  - `@omnific/react-scripts` documents client environment helpers and keeps generated exports aligned with the linted source names.
  - `@omnific/types` updates its package file list for the renamed `utilities.ts` source.
  - `@omnific/eslint-config` and `@omnific/eslint-config-react` update lint plugin dependencies.

- Updated dependencies
  - @omnific/types@0.0.8

## 0.2.0

### Minor Changes

- Remove Less stylesheet support from the Rspack style pipeline. SCSS/Sass remains supported for style preprocessing.

  Update Rspack, Tailwind PostCSS, type checker, and ESLint-related dependencies.

## 0.1.8

### Patch Changes

- Update Rspack, Tailwind PostCSS, Less, and type checker dependencies.
