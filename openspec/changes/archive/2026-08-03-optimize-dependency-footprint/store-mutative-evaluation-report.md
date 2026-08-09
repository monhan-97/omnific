# Store Mutative Evaluation Report

Generated: 2026-08-02T17:47:03.801Z

## Environment

- Node.js: v24.13.1
- pnpm: 11.1.2
- Platform: darwin arm64 25.5.0
- Package: @omnific/store@0.2.1
- Candidate: mutative@1.3.0
- Replacement priority: performance
- Samples per benchmark: 7
- Updates per sample: 5,000

## Behavior Matrix

| Engine | Passed checks |
| --- | ---: |
| current immer + jotai-immer | 5 |
| candidate mutative | 5 |

Checks: value replacement, nested mutation, array mutation, exception propagation, no-op reference stability.

## Throughput

| Engine | Median | Throughput | Samples |
| --- | ---: | ---: | --- |
| current immer + jotai-immer | 93.63 ms | 53,404.28 updates/sec | 93.63 ms, 82.67 ms, 74.48 ms, 95.73 ms, 114.75 ms, 105.42 ms, 73.15 ms |
| candidate mutative | 55.89 ms | 89,461.84 updates/sec | 90.43 ms, 55.89 ms, 65.18 ms, 68.92 ms, 49.35 ms, 47.54 ms, 49.38 ms |

Throughput delta vs current: 67.52%.

## Bundle Size

| Engine | Minified raw | gzip | brotli |
| --- | ---: | ---: | ---: |
| current immer + jotai-immer | 9.5 KB (9725 bytes) | 3.9 KB (3960 bytes) | 3.6 KB (3653 bytes) |
| candidate mutative | 18 KB (18837 bytes) | 6.1 KB (6224 bytes) | 5.5 KB (5669 bytes) |

Raw minified bundle improvement vs current: -93.70%.

## Performance Interpretation

- Performance-sensitive replacement case: passed; candidate throughput is 67.52% higher than current.
- Dependency-footprint replacement case: blocked; candidate raw minified bundle is 93.70% larger than current.
- Final priority: Store update performance is explicitly prioritized over the createAtom-only bundle increase.

## Decision

- Behavior: passed
- Performance threshold: passed
- Bundle threshold: blocked, accepted as performance-priority tradeoff
- Replacement decision: proceed to implementation
