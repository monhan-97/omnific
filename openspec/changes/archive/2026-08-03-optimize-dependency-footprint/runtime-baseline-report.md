# Runtime Baseline Report

Generated: 2026-08-02T17:23:25.740Z

## Environment

- Node.js: v24.13.1
- pnpm: 11.1.2
- Platform: darwin arm64 25.5.0
- CPU: Apple M1
- Samples per benchmark: 7

## Summary

| Benchmark | Samples | Cold | Warm median | Median | Std dev | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| react-scripts config creation | 7 | 122.57 ms | 1.26 ms | 1.26 ms | 42.44 ms | 0.92 ms | 122.57 ms |
| Store draft update (5,000 updates) | 7 | 75.77 ms | 65.21 ms | 65.31 ms | 4.64 ms | 61.00 ms | 75.77 ms |

- Store draft update median throughput: 76,563.08 updates/sec

## Raw Samples

- react-scripts config creation: 122.57 ms, 1.31 ms, 0.99 ms, 1.26 ms, 2.07 ms, 1.26 ms, 0.92 ms
- Store draft update: 75.77 ms, 68.75 ms, 66.23 ms, 65.11 ms, 65.31 ms, 61.00 ms, 61.34 ms

## Commands And Inputs

- react-scripts config creation: temporary fixture app + derived benchmark module from `packages/react-scripts/dist/index.js`; imports and calls internal `createRspackConfig()` once per sample.
- Store draft update: imports current `packages/store/dist/createAtom.js`, then runs 5,000 nested object/array draft updates through a Jotai vanilla store per sample.

## Limitations

- This is the pre-optimization baseline for task 1.2. It records stable local samples, not cross-machine claims.
- Store benchmark uses the current built output in `packages/store/dist`; rerun `pnpm --dir packages/store build` before comparing after implementation changes.
