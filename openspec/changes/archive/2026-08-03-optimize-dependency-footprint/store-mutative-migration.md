# Store Mutative Migration

## Scope

`@omnific/store` now prioritizes draft update throughput for the Store draft engine decision. The replacement uses `mutative@1.3.0` directly inside `createAtom` and removes the `jotai-immer` adapter.

## Breaking changes

- `ImmerAtom` is removed from the public exports.
- Use `DraftAtom` for atoms returned by `createAtom`.
- `AtomDraftUpdater` now receives `mutative`'s `Draft<T>` type instead of `immer`'s `Draft<T>`.
- Consumers do not need `immer` or `jotai-immer` for `@omnific/store` unless they use those packages elsewhere.

## Runtime behavior

The replacement keeps the supported `createAtom` update behavior:

- direct value replacement keeps the replacement reference;
- nested object mutation creates a new state without mutating the previous state;
- array mutation is supported for nested arrays and array root atoms;
- thrown updater errors propagate and do not commit partial state;
- no-op draft updaters keep the previous state reference.

## Performance decision

The candidate report records `mutative@1.3.0` as behavior-compatible and materially faster for the benchmarked Store draft update path. The raw createAtom-only bundle grows versus `immer` + `jotai-immer`, but this change now explicitly prioritizes Store update throughput over that bundle tradeoff.
