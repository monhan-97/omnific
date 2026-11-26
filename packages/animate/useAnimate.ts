import { useUnmount } from '@omnific/hooks';
import { useMemo, useRef } from 'react';

import { createScopedAnimate } from './animateElement';
import type { AnimationScope } from './types';

/**
 * 返回作用域 ref 与基于 WAAPI 的 `animate`（仅支持单个元素）。
 */
export function useAnimate<T extends Element = Element>() {
  const scope = useRef<AnimationScope<T>>({
    current: null,
    animations: [],
  }).current;

  const animate = useMemo(() => createScopedAnimate(scope), [scope]);

  useUnmount(() => {
    for (const animation of scope.animations) animation.stop();
    scope.animations.length = 0;
  });

  return [scope, animate] as const;
}
