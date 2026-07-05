import { useRef } from 'react';

/**
 * 在稳定的 ref 中保存最新值。
 */
export const useLatest = <T>(value: T): { readonly current: T } => {
  const reference = useRef(value);
  reference.current = value;
  return reference;
};
