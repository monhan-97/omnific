# @omnific/atelier

## 0.3.0

### Minor Changes

- Refactor `Box` to use extracted utility props with static layout and appearance classes, and move runtime theming to colors only through `defaultColors`, `defineColors`, and `mergeColors`. The previous token-category APIs, `styleFromTokens`, `defineTokens`, and `mergeTokens` are no longer exported.

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.4.0
  - @omnific/hooks@0.2.2
  - @omnific/icons@0.1.0

## 0.2.0

### Minor Changes

- Add a runtime theme system with token merging, CSS variable injection, theme hooks, and the `Box` component.

## 0.1.0

### Minor Changes

- Add the initial Atelier React component library with Button, transition helpers, semantic style tokens, and compiled CSS.

### Patch Changes

- Updated dependencies
  - @omnific/utils@0.3.1
  - @omnific/icons@0.1.0
  - @omnific/hooks@0.2.1
