import { getDefaultStore } from 'jotai';

import type { AtomDraftUpdater, AtomSetterArgs, ImmerAtom } from './createAtom';

export function setStoreValue<T>(targetAtom: ImmerAtom<T>, ...args: [T]): void;
export function setStoreValue<T>(targetAtom: ImmerAtom<T>, ...args: [AtomDraftUpdater<T>]): void;
export function setStoreValue<T>(targetAtom: ImmerAtom<T>, ...args: AtomSetterArgs<T>) {
  getDefaultStore().set(targetAtom, ...args);
}
