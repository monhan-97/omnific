import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

/**
 * 与 `useEffect` 相同，但跳过首次渲染，只在依赖更新后执行。
 *
 * @param effect 依赖变化后执行的 effect
 * @param dependencies effect 依赖
 */
export const useUpdateEffect = (effect: EffectCallback, dependencies?: DependencyList): void => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    return effect();
    // 依赖由调用方显式传入，与 useEffect 的透传语义保持一致。
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, dependencies);
};
