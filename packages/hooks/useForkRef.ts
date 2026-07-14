import { useMemo } from 'react';
import { hasValue, isFunction, isNil } from '@omnific/utils';

/**
 * 将值写入回调 ref 或对象 ref。
 */
export const setRef = <T>(reference: React.Ref<T> | undefined, value: T | null): void => {
  if (isFunction(reference)) {
    reference(value);
  } else if (hasValue(reference)) {
    reference.current = value;
  }
};

/**
 * 将多个 ref 合并为一个稳定的回调 ref；所有 ref 都缺失时返回 `undefined`。
 */
export const useForkRef = <T>(
  ...references: (React.Ref<T> | undefined)[]
): React.RefCallback<T> | undefined => {
  return useMemo(() => {
    if (references.every(isNil)) {
      return;
    }

    return (instance: T | null) => {
      for (const reference of references) {
        setRef(reference, instance);
      }
    };
  }, references);
};
