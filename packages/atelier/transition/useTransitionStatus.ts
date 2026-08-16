import { useForkRef } from '@omnific/hooks';
import { isNil, resolveValue } from '@omnific/utils';
import { useAnimate } from 'motion/react';
import { useEffectEvent, useLayoutEffect, useState } from 'react';

import { ENTERED, ENTERING, EXITED, EXITING, UNMOUNTED } from './types';
import type { TransitionOptions, TransitionResult, TransitionStatus } from './types';

/** 管理元素进入、退出、挂载状态及对应 Motion 动画。 */
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

    if (isNil(enter) || isNil(scope.current)) return;

    setStatus(ENTERING);
    onEnter?.(scope.current);
    await animate(scope.current, resolveValue(enter, custom, scope.current), { duration });
    setStatus(ENTERED);
    onEntered?.(scope.current);
  });

  const handleExitMotion = useEffectEvent(async () => {
    if (isNil(exit) || isNil(scope.current)) return;

    setStatus(EXITING);
    onExit?.(scope.current);
    await animate(scope.current, resolveValue(exit, custom, scope.current), { duration });
    setStatus(EXITED);
    onExited?.(scope.current);
    if (unmountOnExit) setStatus(UNMOUNTED);
  });

  useLayoutEffect(() => {
    const canEnter = status === EXITED || status === UNMOUNTED;
    const canExit = status === ENTERING || status === ENTERED;

    if (isOpen) {
      if (canEnter) void handleEnterMotion();
      return;
    }

    if (canExit) void handleExitMotion();
  }, [isOpen, status]);

  return { handleRef, isMounted: status !== UNMOUNTED, status };
};
