# @omnific/hooks

## 0.3.0

### Minor Changes

- 3dc86d5: Extract and slim WAAPI `useAnimate` into `@omnific/animate`. Add an ahooks-style `useUnmount` to `@omnific/hooks`, and switch atelier transitions off `motion`.
- 3dc86d5: Add `useMergedState` for combining a controlled `value` with uncontrolled internal state, and `useUpdateEffect` for effects that skip the initial render.

### Patch Changes

- Updated dependencies [3dc86d5]
  - @omnific/utils@0.6.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.5.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.3.1

## 0.2.0

### Minor Changes

- Add shared empty-value predicates and ref composition hooks, migrate React scripts to native Rspack utilities, and refresh lint and build dependencies.

  Remove the deprecated `isURLSearchParams` and `getEnv` aliases in favor of `isURLSearchParameters` and `getEnvironment`.

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.3.0

## 0.1.0

### Minor Changes

- Add shared React hooks with `useLatest` and `useEventCallback`.
