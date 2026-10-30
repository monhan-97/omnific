# @omnific/atelier

## 0.5.0

### Minor Changes

- 23e9970: BREAKING: Refactor the Atelier color theme runtime to use nested primitive and semantic token configuration. The public theme entry point is now `createTheme`, which resolves the provided theme config and returns the `cssVars` declared by that config; `createSystem` and `extendTheme` are no longer exported. The public color merging helpers are removed, existing default color keys remain unchanged, `styles.css` includes the default theme colors as a zero-specificity `:where(:root)` fallback, and every theme system is represented by its name plus the CSS variables declared in its config.

## 0.4.0

## 0.4.1

### Patch Changes

- Republish with resolved workspace dependency versions (fix accidental `workspace:*` on npm).

### Minor Changes

- 56fdacc: Ship default body typography and colors with open-source Chinese and English font defaults, plus border-box sizing from `styles.css`.
- 56fdacc: Split Button styling into independent `color` and `variant` props, replacing the previous single `variant` union with Ant Design-inspired values.

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
