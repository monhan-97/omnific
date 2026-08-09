import { atom } from 'jotai';
import { create } from 'mutative';
import { isFunction } from '@omnific/utils';
import type { WritableAtom } from 'jotai';
import type { Draft } from 'mutative';

/**
 * 用于更新 atom 值的 draft。
 */
export type AtomDraftUpdater<T> = (draft: Draft<T>) => void;

/**
 * Draft atom setter 接受的参数。
 */
export type AtomSetterArguments<T> = [T] | [AtomDraftUpdater<T>];

/**
 * 支持 draft 更新的可写 Jotai atom。
 */
export type DraftAtom<T> = WritableAtom<T, AtomSetterArguments<T>, void>;

/**
 * 创建支持 draft 更新的可写 Jotai atom。
 */
export const createAtom = <T>(initialState: T): DraftAtom<T> => {
  const baseAtom = atom(initialState);

  return atom<T, AtomSetterArguments<T>, void>(
    get => get(baseAtom),
    (get, set, nextValue) => {
      if (isFunction(nextValue)) {
        set(baseAtom, create(get(baseAtom), nextValue));
        return;
      }

      set(baseAtom, nextValue);
    },
  );
};
