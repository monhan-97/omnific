# Runtime Post-optimization Report

Generated: 2026-08-03T13:57:13.956Z

## Environment

- Node.js: v24.13.1
- pnpm: 11.1.2
- Platform: darwin arm64 25.5.0
- CPU: Apple M1
- Samples per benchmark: 7

## Summary

| Benchmark | Samples | Cold | Warm median | Median | Std dev | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| react-scripts config creation | 7 | 157.30 ms | 0.93 ms | 0.96 ms | 54.66 ms | 0.86 ms | 157.30 ms |
| Store draft update (5,000 updates) | 7 | 57.44 ms | 47.89 ms | 51.48 ms | 5.67 ms | 42.82 ms | 57.44 ms |

- Store draft update median throughput: 97,129.74 updates/sec

## Raw Samples

- react-scripts config creation: 157.30 ms, 1.90 ms, 1.00 ms, 0.96 ms, 0.90 ms, 0.88 ms, 0.86 ms
- Store draft update: 57.44 ms, 55.65 ms, 53.43 ms, 51.48 ms, 44.30 ms, 42.82 ms, 43.65 ms

## Commands And Inputs

- react-scripts config creation: temporary fixture app + derived benchmark module from `packages/react-scripts/dist/index.js`; imports and calls internal `createRspackConfig()` once per sample.
- Store draft update: imports current `packages/store/dist/createAtom.js`, then runs 5,000 nested object/array draft updates through a Jotai vanilla store per sample.

## Limitations

- This is the post-optimization measurement for task 4.1. It records stable local samples, not cross-machine claims.
- Store benchmark uses the current built output in `packages/store/dist`; rerun `pnpm --dir packages/store build` before comparing after implementation changes.
