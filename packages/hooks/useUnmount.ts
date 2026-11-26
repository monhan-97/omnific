import { useEffect } from 'react';

import { useLatest } from './useLatest';

/**
 * 在组件卸载时执行回调，并始终调用最新的函数实例。
 *
 * @param fn 卸载时执行的函数
 */
export const useUnmount = (fn: () => void): void => {
  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    // 仅在卸载时执行；通过 useLatest 读取最新 fn。
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [],
  );
};
