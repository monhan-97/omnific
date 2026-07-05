# @omnific/types

## 0.0.8

### Patch Changes

- Add request-level default `withCredentials` support, expose normalized utility names, and refresh package documentation.

  - `@omnific/request` now supports `createRequest({ withCredentials })` defaults that can be overridden per request.
  - `@omnific/store` exposes the clearer `AtomSetterArguments` type name for atom setter arguments.
  - `@omnific/utils` exposes `isURLSearchParameters` while keeping the root `isURLSearchParams` alias.
  - `@omnific/react-scripts` documents client environment helpers and keeps generated exports aligned with the linted source names.
  - `@omnific/types` updates its package file list for the renamed `utilities.ts` source.
  - `@omnific/eslint-config` and `@omnific/eslint-config-react` update lint plugin dependencies.
