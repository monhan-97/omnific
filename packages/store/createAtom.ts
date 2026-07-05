import { atom } from 'jotai';
import { withImmer } from 'jotai-immer';
import type { Draft } from 'immer';
import type { WritableAtom } from 'jotai';

/**
 * 用于更新 atom 值的 Immer draft。
 */
export type AtomDraftUpdater<T> = (draft: Draft<T>) => void;

/**
 * Immer atom setter 接受的参数。
 */
export type AtomSetterArguments<T> = [T] | [AtomDraftUpdater<T>];

/**
 * 支持 Immer draft 更新的可写 Jotai atom。
 */
export type ImmerAtom<T> = WritableAtom<T, AtomSetterArguments<T>, void>;

/**
 * 创建支持 Immer draft 更新的可写 Jotai atom。
 */
export const createAtom = <T>(initialState: T): ImmerAtom<T> => {
  const baseAtom = atom(initialState);
  return withImmer(baseAtom) as ImmerAtom<T>;
};
