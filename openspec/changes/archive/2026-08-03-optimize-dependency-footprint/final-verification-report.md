# Dependency Footprint Final Verification

Generated: 2026-08-03

## Environment

- Node.js: v24.13.1
- pnpm: 11.1.2
- Platform: macOS darwin arm64
- CPU: Apple M1

## Clean Install

The repository snapshots were installed into separate temporary directories with the same pnpm content-addressable store:

```sh
pnpm install --frozen-lockfile --ignore-scripts
```

| Snapshot | Workspace projects | Lockfile packages | Install time | `node_modules` |
| --- | ---: | ---: | ---: | ---: |
| `HEAD` baseline | 11 | 525 | 5.68 s | 297.1 MiB (304,228 KiB) |
| Current workspace | 13 | 1,567 | 7.37 s | 523.3 MiB (535,828 KiB) |

The whole-workspace increase is not attributable to this dependency optimization: the current snapshot also adds the `docs/icons` workspace and its Docusaurus dependency graph. Package production closures below isolate the affected packages from that shared workspace change.

## Package Dependency Closures

Measured with `pnpm --filter <package> deploy --prod --legacy <temporary-directory>` after each clean install.

| Package | Baseline entries | Current entries | Baseline size | Current size | Size delta |
| --- | ---: | ---: | ---: | ---: | ---: |
| `@omnific/react-scripts` | 115 | 168 | 137.1 MiB (140,380 KiB) | 123.8 MiB (126,808 KiB) | -9.67% |
| `@omnific/store` | 4 | 5 | 284 KiB | 1.22 MiB (1,248 KiB) | +339.44% |

`react-scripts` direct runtime dependencies decreased from 17 to 11. Tailwind and Sass moved to optional peers; plain CSS consumers avoid their 35-package, 31.2 MiB capability closure. The production closure entry count increased because pnpm records optional peer and peer-context snapshots separately, so only the measured byte reduction is treated as an improvement.

Store replaces the `immer` and `jotai-immer` peer requirements with one direct `mutative` dependency. Its production closure and bundle grow; this is the explicitly accepted cost of the performance-priority replacement.

## Runtime

Seven local samples were collected for each runtime benchmark. Cold samples include module initialization; warm medians compare stable execution.

| Benchmark | Baseline | Current | Delta |
| --- | ---: | ---: | ---: |
| `react-scripts` config warm median | 1.26 ms | 0.93 ms | -26.19% |
| Store update median | 65.31 ms | 51.48 ms | -21.18% |
| Store update median throughput | 76,563 updates/sec | 97,130 updates/sec | +26.87% |

The Store candidate-specific same-process comparison remains the primary engine decision evidence: `mutative` improved median throughput by 67.52% against `immer` + `jotai-immer` under the shared behavior matrix.

## Bundle

| Store createAtom-only bundle | Baseline | Current candidate | Delta |
| --- | ---: | ---: | ---: |
| Minified raw | 9,725 bytes | 18,837 bytes | +93.70% |
| gzip | 3,960 bytes | 6,224 bytes | +57.17% |
| brotli | 3,653 bytes | 5,669 bytes | +55.19% |

## Decision

- `react-scripts`: accepted. Optional style integrations remove a 31.2 MiB capability closure for plain CSS consumers and improve warm config creation. The isolated production closure improvement is 9.67%, just below the 10% target, so no broader size claim is made.
- Store: accepted under the documented performance-priority exception. Behavior passes, throughput improves beyond 10%, and bundle/install growth is explicitly recorded.
- Whole workspace: not used as optimization evidence because unrelated workspace additions dominate the aggregate clean-install result.

## Licenses

`pnpm licenses list --prod --json` completed against the clean-installed current snapshot. `mutative@1.3.0` reports MIT, includes its LICENSE file, and introduces no GPL-2.0, GPL-3.0, or AGPL license identifier into the production graph. Existing retained dependencies require no new attribution from this change.

## Repository Verification

- `CI=true pnpm typecheck`: passed
- `CI=true pnpm lint:fix`: passed
- `CI=true pnpm test`: passed, 32 files and 87 tests
- `CI=true pnpm build`: passed
