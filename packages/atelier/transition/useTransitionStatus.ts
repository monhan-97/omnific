import { isAnimationAbortError, useAnimate } from '@omnific/animate';
import { useForkRef } from '@omnific/hooks';
import { isNil, resolveValue } from '@omnific/utils';
import { useEffectEvent, useLayoutEffect, useState } from 'react';

import { ENTERED, ENTERING, EXITED, EXITING, UNMOUNTED } from './types';
import type { TransitionOptions, TransitionResult, TransitionStatus } from './types';

/**
 * 管理元素进入、退出、挂载状态及对应动画。
 */
export const useTransitionStatus = <Custom = unknown>(
  options: TransitionOptions<Custom>,
): TransitionResult => {
  const {
    appear = false,
    custom,
    duration = 0.3,
    enter,
    exit,
    in: isOpen = false,
    onEnter,
    onEntered,
    onExit,
    onExited,
    ref,
    unmountOnExit = false,
  } = options;

  const [scope, animate] = useAnimate<HTMLElement>();

  const [status, setStatus] = useState<TransitionStatus>(() => {
    if (isOpen) return appear ? EXITED : ENTERED;
    return unmountOnExit ? UNMOUNTED : EXITED;
  });

  const handleRef = useForkRef(scope, ref);

  const handleEnterMotion = useEffectEvent(async () => {
    if (status === UNMOUNTED) {
      setStatus(EXITED);
      return;
    }

    const element = scope.current;
    if (isNil(enter) || isNil(element)) return;

    setStatus(ENTERING);
    onEnter?.(element);

    try {
      await animate(element, resolveValue(enter, custom, element), { duration });
    } catch (error) {
      if (isAnimationAbortError(error)) return;
      throw error;
    }

    setStatus(ENTERED);
    onEntered?.(element);
  });

  const handleExitMotion = useEffectEvent(async () => {
    const element = scope.current;
    if (isNil(exit) || isNil(element)) return;

    setStatus(EXITING);
    onExit?.(element);

    try {
      await animate(element, resolveValue(exit, custom, element), { duration });
    } catch (error) {
      if (isAnimationAbortError(error)) return;
      throw error;
    }

    onExited?.(element);
    setStatus(unmountOnExit ? UNMOUNTED : EXITED);
  });

  useLayoutEffect(() => {
    if (isOpen) {
      const canEnter = status === EXITED || status === UNMOUNTED;
      if (canEnter) handleEnterMotion();
      return;
    }

    const canExit = status === ENTERING || status === ENTERED;
    if (canExit) handleExitMotion();
  }, [isOpen, status]);

  return { handleRef, isMounted: status !== UNMOUNTED, status };
};
