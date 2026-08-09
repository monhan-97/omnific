# Store Bundle Baseline Report

Generated: 2026-08-02T17:28:15.083Z

## Environment

- Node.js: v24.13.1
- pnpm: 11.1.2
- Platform: darwin arm64 25.5.0
- Package: @omnific/store@0.2.1
- Bundler: rolldown v1.2.1

## Production Bundle Sizes

| Scenario | Mode | Raw | gzip | brotli |
| --- | --- | ---: | ---: | ---: |
| createAtom only | tree-shaken | 24 KB (25078 bytes) | 7.3 KB (7513 bytes) | 6.5 KB (6610 bytes) |
| createAtom only | tree-shaken + minified | 9.5 KB (9725 bytes) | 3.9 KB (3960 bytes) | 3.6 KB (3653 bytes) |
| public API | tree-shaken | 68 KB (69591 bytes) | 16 KB (16821 bytes) | 14 KB (14737 bytes) |
| public API | tree-shaken + minified | 22 KB (22458 bytes) | 8.4 KB (8636 bytes) | 7.7 KB (7877 bytes) |

## Inputs

- `createAtom only` imports only `createAtom` from `packages/store/dist/main.js` and exports one created atom, exercising consumer tree-shaking for the draft engine path.
- `public API` re-exports the full current public API from `packages/store/dist/main.js`, preserving all store helper paths.
- `react` is externalized to model a production app bundle that already owns React.

## Limitations

- This is the pre-optimization baseline for task 1.3. Rebuild `packages/store/dist` before comparing after source changes.
- Bundle artifacts are generated in a temporary directory and removed after measurement; package install/store footprint remains covered by task 1.1 and final task 5.1.
