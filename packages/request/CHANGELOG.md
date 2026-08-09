# @omnific/request

## 0.2.2

### Patch Changes

- Prioritize explicit content type detection when transforming request bodies.

## 0.2.1

### Patch Changes

- Add shared empty-value predicates and ref composition hooks, migrate React scripts to native Rspack utilities, and refresh lint and build dependencies.

  Remove the deprecated `isURLSearchParams` and `getEnv` aliases in favor of `isURLSearchParameters` and `getEnvironment`.

- Updated dependencies
  - @omnific/utils@0.3.0

## 0.2.0

### Minor Changes

- Add request-level default `withCredentials` support, expose normalized utility names, and refresh package documentation.

  - `@omnific/request` now supports `createRequest({ withCredentials })` defaults that can be overridden per request.
  - `@omnific/store` exposes the clearer `AtomSetterArguments` type name for atom setter arguments.
  - `@omnific/utils` exposes `isURLSearchParameters` while keeping the root `isURLSearchParams` alias.
  - `@omnific/react-scripts` documents client environment helpers and keeps generated exports aligned with the linted source names.
  - `@omnific/types` updates its package file list for the renamed `utilities.ts` source.
  - `@omnific/eslint-config` and `@omnific/eslint-config-react` update lint plugin dependencies.

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.2.0
  - @omnific/types@0.0.8

## 0.1.2

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.1.1

## 0.1.1

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.1.0

## 0.1.0

### Minor Changes

- Breaking change: `FetchResponseType` is no longer exported. Use the shared `ResponseType` export instead.

  Fetch `responseType` values now use the shared lowercase names: `arraybuffer` and `formdata` replace the previous `arrayBuffer` and `formData` names.

  Fetch network failures and timeout aborts now reject with `FetchError` consistently. XHR config types now exclude the unsupported `formdata` response type.
