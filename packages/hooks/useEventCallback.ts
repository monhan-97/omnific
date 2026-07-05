import { useCallback } from 'react';

import { useLatest } from './useLatest';

/**
 * 返回稳定的回调函数，并始终调用最新的函数实例。
 */
export const useEventCallback = <T extends (...arguments_: any[]) => any>(function_: T): T => {
  const latestFunction = useLatest(function_);

  return useCallback((...arguments_: Parameters<T>): ReturnType<T> => {
    return latestFunction.current(...arguments_);
  }, []) as T;
};
