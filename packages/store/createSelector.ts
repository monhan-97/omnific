import { useEventCallback } from '@omnific/hooks';
import { get, hasValue, isArray, isFunction, isString } from '@omnific/utils';
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useMemo } from 'react';
import type { WritableAtom } from 'jotai';

import type { AtomSetterArguments } from './createAtom';

/**
 * 从 atom 状态中派生选中值的函数。
 */
export type Selector<T, U = unknown> = (state: T) => U;

/**
 * 可从 atom 状态中选择的字符串键。
 */
export type SelectorKey<T> = Extract<keyof T, string>;

/**
 * 从 atom 状态中选择的字符串键列表。
 */
export type SelectorKeys<T> = SelectorKey<T>[];

/**
 * 创建用于读取可写 atom 中选中值的 React hook。
 */
export const createSelector = <T>(targetAtom: WritableAtom<T, AtomSetterArguments<T>, void>) => {
  function useSelector<U>(selector: Selector<T, U>): U;
  function useSelector<K extends SelectorKeys<T>>(selector: K): Pick<T, K[number]>;
  function useSelector<K extends SelectorKey<T>, S extends SelectorKey<T[K]>>(
    selector: K,
    subSelector: S,
  ): T[K][S];
  function useSelector<K extends SelectorKey<T>>(selector: K): T[K];
  function useSelector(): T;
  function useSelector<U>(
    selector?: Selector<T, U> | SelectorKey<T> | SelectorKeys<T>,
    subSelector?: PropertyKey,
  ) {
    const selectorFunction = useEventCallback((state: T) => {
      if (isFunction(selector)) {
        return selector(state);
      }

      if (isString(selector)) {
        return hasValue(subSelector)
          ? get(state as Record<string, unknown>, [selector, subSelector as string])
          : state[selector];
      }

      if (isArray(selector)) {
        const selected = {} as Pick<T, (typeof selector)[number]>;
        for (const key of selector) {
          selected[key] = state[key];
        }
        return selected;
      }

      return state;
    });

    const selectedAtom = useMemo(() => selectAtom(targetAtom, selectorFunction), [selectorFunction]);

    return useAtomValue(selectedAtom);
  }

  return useSelector;
};
