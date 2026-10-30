---
'@omnific/atelier': minor
---

BREAKING: Refactor the Atelier color theme runtime to use nested primitive and semantic token configuration. The public theme entry point is now `createTheme`, which resolves the provided theme config and returns the `cssVars` declared by that config; `createSystem` and `extendTheme` are no longer exported. The public color merging helpers are removed, existing default color keys remain unchanged, `styles.css` includes the default theme colors as a zero-specificity `:where(:root)` fallback, and every theme system is represented by its name plus the CSS variables declared in its config.
