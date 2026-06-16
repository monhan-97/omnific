import { useEventCallback } from '@omnific/hooks';
import { get, hasValue, isArray, isFunction, isString } from '@omnific/utils';
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useMemo } from 'react';
import type { WritableAtom } from 'jotai';

import type { AtomSetterArgs } from './createAtom';

export type Selector<T, U = unknown> = (state: T) => U;

export type SelectorKey<T> = Extract<keyof T, string>;

export type SelectorKeys<T> = SelectorKey<T>[];

export const createSelector = <T>(targetAtom: WritableAtom<T, AtomSetterArgs<T>, void>) => {
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
    const selectorFn = useEventCallback((state: T) => {
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

    const selectedAtom = useMemo(() => selectAtom(targetAtom, selectorFn), [selectorFn]);

    return useAtomValue(selectedAtom);
  }

  return useSelector;
};
