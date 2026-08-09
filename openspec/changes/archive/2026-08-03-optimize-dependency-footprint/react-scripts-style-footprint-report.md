# React Scripts Style Dependency Footprint

Generated: 2026-08-02T17:13:23.291Z

## Environment

- Node.js: v24.13.1
- Platform: darwin arm64
- Package: @omnific/react-scripts@0.3.0

## Direct Dependency Metadata

- Runtime dependencies: 11
- Dev dependencies: 5
- Peer dependencies: 4
- Optional peer dependencies: 4
- Former Tailwind/Sass hard dependencies still in dependencies: 0

| Package | dependencies | peerDependencies | peerDependenciesMeta.optional | devDependencies |
| --- | --- | --- | --- | --- |
| `@tailwindcss/postcss` | no | yes | yes | yes |
| `sass-embedded` | no | yes | yes | yes |
| `sass-loader` | no | yes | yes | yes |
| `tailwindcss` | no | yes | yes | yes |

## Style Capability Closure In This Workspace

These packages remain installed in this repository as dev dependencies so fixtures can verify Tailwind and Sass. A plain CSS consumer does not need this closure.

- Tailwind/Sass capability packages requested: 4
- Unique package directories in runtime closure: 35
- Current workspace closure size: 31 MB (32720776 bytes)
- Former hard dependency closure size: 31 MB (32720776 bytes)

| Package | Version | Directory size |
| --- | --- | ---: |
| `@alloc/quick-lru` | 5.2.0 | 14 KB |
| `@bufbuild/protobuf` | 2.13.0 | 1.7 MB |
| `@jridgewell/gen-mapping` | 0.3.13 | 92 KB |
| `@jridgewell/remapping` | 2.3.5 | 58 KB |
| `@jridgewell/resolve-uri` | 3.1.2 | 52 KB |
| `@jridgewell/sourcemap-codec` | 1.5.5 | 85 KB |
| `@jridgewell/trace-mapping` | 0.3.31 | 143 KB |
| `@tailwindcss/node` | 4.3.3 | 129 KB |
| `@tailwindcss/oxide` | 4.3.3 | 29 KB |
| `@tailwindcss/oxide-darwin-arm64` | 4.3.3 | 2.8 MB |
| `@tailwindcss/postcss` | 4.3.3 | 98 KB |
| `colorjs.io` | 0.5.2 | 7.5 MB |
| `detect-libc` | 2.1.2 | 26 KB |
| `enhanced-resolve` | 5.24.5 | 410 KB |
| `graceful-fs` | 4.2.11 | 32 KB |
| `has-flag` | 4.0.0 | 4.3 KB |
| `immutable` | 5.1.9 | 709 KB |
| `jiti` | 2.7.0 | 1.7 MB |
| `lightningcss` | 1.32.0 | 499 KB |
| `lightningcss-darwin-arm64` | 1.32.0 | 8.1 MB |
| `magic-string` | 0.30.21 | 449 KB |
| `nanoid` | 3.3.16 | 24 KB |
| `picocolors` | 1.1.1 | 6.2 KB |
| `postcss` | 8.5.25 | 213 KB |
| `rxjs` | 7.8.2 | 4.3 MB |
| `sass-embedded` | 1.100.0 | 839 KB |
| `sass-loader` | 17.0.0 | 97 KB |
| `source-map-js` | 1.2.1 | 137 KB |
| `supports-color` | 8.1.1 | 8.3 KB |
| `sync-child-process` | 1.0.2 | 57 KB |
| `sync-message-port` | 1.2.0 | 105 KB |
| `tailwindcss` | 4.3.3 | 755 KB |
| `tapable` | 2.3.3 | 72 KB |
| `tslib` | 2.8.1 | 88 KB |
| `varint` | 6.0.0 | 9.4 KB |

## Result

- Plain CSS consumers no longer install Tailwind/Sass style capability packages through `@omnific/react-scripts` runtime dependencies.
- Tailwind consumers install `tailwindcss` and `@tailwindcss/postcss` explicitly in the app.
- Sass consumers install `sass-loader` and `sass-embedded` explicitly in the app.
- The repository keeps the optional packages in `devDependencies` only to run fixture builds.

## Verification

- `./node_modules/.bin/vitest run packages/react-scripts`
- `../../node_modules/.bin/tsc -p tsconfig.json --noEmit` from `packages/react-scripts`
- `./node_modules/.bin/eslint ... --fix` for touched `react-scripts` files
- `../../node_modules/.bin/tsdown -c tsdown.config.mjs` from `packages/react-scripts`

## Limitations

- The root `pnpm` wrapper currently stops on `ERR_PNPM_IGNORED_BUILDS` for `esbuild@0.21.5`; local `node_modules/.bin` commands were used for verification.
- This report covers the `react-scripts` style-tooling slice only. Store baseline work remains separate.
