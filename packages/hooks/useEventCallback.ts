import { useCallback } from 'react';

import { useLatest } from './useLatest';

export const useEventCallback = <T extends (...args: any[]) => any>(fn: T): T => {
  const latestFn = useLatest(fn);

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return latestFn.current(...args);
  }, []) as T;
};
