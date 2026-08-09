import { getDefaultStore } from 'jotai';

import type { AtomDraftUpdater, AtomSetterArguments, DraftAtom } from './createAtom';

/**
 * 在 Jotai 默认 store 中设置 atom 值。
 */
export function setStoreValue<T>(targetAtom: DraftAtom<T>, ...arguments_: [T]): void;
/**
 * 在 Jotai 默认 store 中使用 draft updater 更新 atom 值。
 */
export function setStoreValue<T>(targetAtom: DraftAtom<T>, ...arguments_: [AtomDraftUpdater<T>]): void;
/**
 * 在 Jotai 默认 store 中对 atom 应用值或 draft updater。
 */
export function setStoreValue<T>(targetAtom: DraftAtom<T>, ...arguments_: AtomSetterArguments<T>) {
  getDefaultStore().set(targetAtom, ...arguments_);
}
