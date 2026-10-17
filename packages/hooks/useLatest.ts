import { useRef } from 'react';

/**
 * 在稳定的 ref 中保存最新值。
 */
export const useLatest = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
