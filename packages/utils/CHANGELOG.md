# @omnific/utils

## 0.3.0

### Minor Changes

- Add shared empty-value predicates and ref composition hooks, migrate React scripts to native Rspack utilities, and refresh lint and build dependencies.

  Remove the deprecated `isURLSearchParams` and `getEnv` aliases in favor of `isURLSearchParameters` and `getEnvironment`.

## 0.2.0

### Minor Changes

- Add request-level default `withCredentials` support, expose normalized utility names, and refresh package documentation.

  - `@omnific/request` now supports `createRequest({ withCredentials })` defaults that can be overridden per request.
  - `@omnific/store` exposes the clearer `AtomSetterArguments` type name for atom setter arguments.
  - `@omnific/utils` exposes `isURLSearchParameters` while keeping the root `isURLSearchParams` alias.
  - `@omnific/react-scripts` documents client environment helpers and keeps generated exports aligned with the linted source names.
  - `@omnific/types` updates its package file list for the renamed `utilities.ts` source.
  - `@omnific/eslint-config` and `@omnific/eslint-config-react` update lint plugin dependencies.

## 0.1.1

### Patch Changes

- Make `hasValue` perform direct nullish checks and avoid reverse `hasValue` conditions in utilities.

## 0.1.0

### Minor Changes

- Add `uniqueId` for generating incrementing string identifiers.
