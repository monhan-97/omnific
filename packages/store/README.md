# @omnific/store

Jotai store helpers for Omnific applications.

## Installation

```sh
pnpm add @omnific/store jotai react
```

`@omnific/store` includes its draft update engine internally. Applications no longer need to install
`immer` or `jotai-immer` for this package.

## Draft atoms

`createAtom` creates a writable Jotai atom that accepts either a replacement value or a draft updater.

```ts
import { createAtom, setStoreValue } from '@omnific/store';

const userAtom = createAtom({
  count: 0,
  user: {
    name: 'Ada',
  },
});

setStoreValue(userAtom, draft => {
  draft.count += 1;
  draft.user.name = 'Grace';
});

setStoreValue(userAtom, {
  count: 2,
  user: {
    name: 'Lin',
  },
});
```

## Migration from Immer-backed atoms

- `createAtom` keeps the same runtime update shape for replacement values and draft updater callbacks.
- The exported atom type is now `DraftAtom`; replace imports of `ImmerAtom` with `DraftAtom`.
- `AtomDraftUpdater` now uses the draft type from `mutative` instead of `immer`.
- Remove direct `immer` and `jotai-immer` dependencies if they were only installed for `@omnific/store`.
