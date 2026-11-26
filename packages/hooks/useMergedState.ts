import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { isUndefined, resolveValue } from '@omnific/utils';

import { useEventCallback } from './useEventCallback';

/**
 * `useMergedState` 的配置项。
 */
export interface UseMergedStateOptions<S> {
  /**
   * 非受控模式下的默认值。
   */
  defaultValue?: S | (() => S);
  /**
   * 受控模式下的当前值。
   */
  value?: S;
}

/**
 * 合并受控模式下的 `value` 与非受控模式下的内部 state。
 *
 * `value` 不为 `undefined` 时视为受控模式，直接返回 `value`，setter 不会修改内部 state；
 * `value` 为 `undefined` 时视为非受控模式，返回内部 state，setter 正常更新。
 *
 * 注意：不要在组件生命周期内动态切换受控与非受控模式。
 *
 * @param options 默认值与受控值配置
 * @returns `[mergedValue, setMergedValue]`
 *
 * @example
 * const [value, setValue] = useMergedState({
 *   defaultValue: 'default',
 *   value: controlledValue,
 * });
 */
export const useMergedState = <S>(
  options: UseMergedStateOptions<S> = {},
): [S, Dispatch<SetStateAction<S>>] => {
  const { defaultValue, value } = options;

  const [innerValue, setInnerValue] = useState<S>(() => {
    if (!isUndefined(value)) {
      return value;
    }

    if (isUndefined(defaultValue)) {
      return defaultValue as S;
    }

    return resolveValue(defaultValue);
  });

  const mergedValue = isUndefined(value) ? innerValue : value;

  const setMergedValue: typeof setInnerValue = useEventCallback(updater => {
    if (isUndefined(value)) {
      setInnerValue(updater);
    }
  });

  return [mergedValue, setMergedValue];
};
