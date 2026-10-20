/**
 * Map `jsx-ast-utils-x` to `@types/jsx-ast-utils`.
 *
 * Re-export from the `@types/*` package path (not `jsx-ast-utils`) so module
 * resolvers can find a real installed package. `@types/jsx-ast-utils` already
 * imports `estree-jsx`, which loads the JSX `NodeMap` augmentation.
 *
 * The package is CommonJS. Node ESM cannot named-import its members, so we also
 * declare a default export (matching `module.exports`) for
 * `import jsxAstUtils from 'jsx-ast-utils-x'`.
 */
declare module 'jsx-ast-utils-x' {
  export * from '@types/jsx-ast-utils';

  import type * as JsxAstUtils from '@types/jsx-ast-utils';

  /** CJS `module.exports` surface used via default import under Node ESM. */
  const jsxAstUtils: typeof JsxAstUtils;
  export default jsxAstUtils;
}
