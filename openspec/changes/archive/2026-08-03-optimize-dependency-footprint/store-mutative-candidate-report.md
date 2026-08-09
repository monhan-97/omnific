# Store Mutative Candidate Report

Generated: 2026-08-02T17:32:34Z

## Candidate

- Package: `mutative`
- Locked candidate version: `1.3.0`
- Version range to use if accepted: exact `1.3.0`
- npm tarball: `https://registry.npmjs.org/mutative/-/mutative-1.3.0.tgz`
- Official repository: `https://github.com/unadlib/mutative`
- Immutable source commit: `01945e3274e9730706799e4d432c22248a6bdeb1`
- Commit source URL: `https://github.com/unadlib/mutative/tree/01945e3274e9730706799e4d432c22248a6bdeb1`
- License: MIT
- Node engine from package metadata: `>=14.0`

## Verification Sources

- npm metadata command:
  `npm view mutative version repository.url license gitHead dist.tarball homepage --json`
- Verified registry result:
  - `version`: `1.3.0`
  - `repository.url`: `git+https://github.com/unadlib/mutative.git`
  - `license`: `MIT`
  - `gitHead`: `01945e3274e9730706799e4d432c22248a6bdeb1`
  - `homepage`: `https://mutative.js.org/`
- Commit metadata checked from:
  - `https://raw.githubusercontent.com/unadlib/mutative/01945e3274e9730706799e4d432c22248a6bdeb1/package.json`
  - `https://raw.githubusercontent.com/unadlib/mutative/01945e3274e9730706799e4d432c22248a6bdeb1/src/index.ts`
  - `https://raw.githubusercontent.com/unadlib/mutative/01945e3274e9730706799e4d432c22248a6bdeb1/README.md`

## API Surface Relevant To `@omnific/store`

The candidate exports the APIs needed for the Store replacement path:

- `create`: draft mutation API that can replace Immer `produce` for object and array updates.
- `Draft`: TypeScript draft type that can replace the current `immer` `Draft` import if behavior checks pass.
- `rawReturn`: explicit raw return wrapper, needed only if `@omnific/store` decides to support updater return replacement.
- `current`, `original`, `isDraft`, `isDraftable`: available for behavior tests and debugging, not required for the minimal Store implementation.

The current Store implementation uses `jotai`, `jotai-immer`, and `immer`:

- `packages/store/createAtom.ts` creates a base Jotai atom and wraps it with `withImmer`.
- `AtomDraftUpdater<T>` currently accepts `(draft: Draft<T>) => void`.
- Direct value replacement is represented by `AtomSetterArguments<T> = [T] | [AtomDraftUpdater<T>]`, not by returning a value from the updater.

## Known Semantic Differences To Test Before Replacement

1. Mutative uses `create()` rather than Immer `produce()`.
   Store implementation must call `create(previousValue, updater)` inside a Jotai writable atom.

2. Mutative disables auto-freezing by default, while Immer commonly enables auto-freezing by default.
   Store must decide whether frozen output is part of its public contract. Current tests do not assert frozen state, so the first implementation should keep Mutative defaults unless compatibility tests prove otherwise.

3. Explicitly returning `undefined` from a draft callback requires `rawReturn(undefined)`.
   Current `AtomDraftUpdater<T>` returns `void`, so this is not needed for the existing API. If return replacement is added, tests must cover `rawReturn`.

4. Mutative strict mode is opt-in.
   Strict mode restricts access to mutable, non-draftable values unless wrapped with `unsafe()`. The Store path should not enable strict mode for production by default; development-only strict mode can be evaluated after compatibility tests.

5. Patches use `create(..., { enablePatches: true })` and `apply()`, not Immer `produceWithPatches` / `applyPatches`.
   Store does not currently expose patches, so this should stay out of the first replacement.

6. Proxy support is required.
   This matches the modern environment already implied by the current package set, but should be noted for React Native or legacy JS engine consumers.

7. No-op updater reference stability must be verified.
   The OpenSpec requires unchanged drafts to keep the previous value reference. Candidate tests must assert this explicitly before implementation.

## Decision For Next Step

Proceed to task 3.2 with `mutative@1.3.0` as the only candidate. Do not add it to `packages/store/package.json` until the behavior matrix, throughput benchmark, and bundle benchmark pass the OpenSpec thresholds.
