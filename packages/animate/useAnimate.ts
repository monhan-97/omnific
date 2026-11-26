import { useUnmount } from '@omnific/hooks';
import { hasValue } from '@omnific/utils';
import { useRef } from 'react';

import { animateElement } from './animateElement';
import { stopActiveAnimation } from './helpers';
import type { AnimationScope } from './types';

/**
 * 返回作用域 ref 与基于 WAAPI 的 `animate`（仅支持单个元素）。
 */
export function useAnimate<T extends Element = Element>() {
  const scopeRef = useRef<T>(null!) as AnimationScope<T>;

  useUnmount(() => {
    if (hasValue(scopeRef.current)) stopActiveAnimation(scopeRef.current);
  });

  return [scopeRef, animateElement] as const;
}
