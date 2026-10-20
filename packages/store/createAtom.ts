import { atom } from 'jotai';
import { makeCreator } from 'mutative';
import { isFunction } from '@omnific/utils';
import type { WritableAtom } from 'jotai';
import type { Draft } from 'mutative';

/**
 * Mutative creator：开发环境开启 strict，尽早发现未正确 draft 的读取；
 * 作为库默认关闭 autoFreeze，避免 `Immutable<T>` 回灌 jotai 状态类型，并保留生产性能。
 */
const create = makeCreator({
  strict: process.env.NODE_ENV !== 'production',
});

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
