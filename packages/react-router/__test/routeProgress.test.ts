// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import type { DataRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { bindRouteProgress, useRouteProgress } from '../routeProgress';

type NavigationState = 'idle' | 'loading';
type RouterListener = (state: { navigation: { state: NavigationState } }) => void;

function createRouterMock() {
  let listener: RouterListener | undefined;

  return {
    subscribe(next: RouterListener) {
      listener = next;
      return () => {
        listener = undefined;
      };
    },
    emit(state: NavigationState) {
      listener?.({ navigation: { state } });
    },
  };
}

describe('bindRouteProgress', () => {
  const animate = vi.fn(() => ({
    cancel: vi.fn(),
    onfinish: null as (() => void) | null,
  }));

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.replaceChildren();
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      value: animate,
    });
    animate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it('creates a progress bar during navigation and removes it after fading', () => {
    const router = createRouterMock();
    const unbind = bindRouteProgress(router as unknown as DataRouter);

    router.emit('loading');
    expect(document.body.querySelector('div')).not.toBeNull();
    expect(animate).toHaveBeenCalledTimes(1);

    router.emit('idle');
    vi.advanceTimersByTime(120);
    expect(animate).toHaveBeenCalledTimes(2);

    const fade = animate.mock.results[1]?.value as { onfinish?: () => void };
    fade.onfinish?.();
    expect(document.body.querySelector('div')).toBeNull();

    unbind();
  });

  it('supports appearance options', () => {
    const router = createRouterMock();
    const unbind = bindRouteProgress(router as unknown as DataRouter, {
      color: 'tomato',
      height: 4,
      zIndex: 100,
    });

    router.emit('loading');
    const bar = document.body.querySelector('div') as HTMLDivElement;

    expect(bar.style.background).toBe('tomato');
    expect(bar.style.height).toBe('4px');
    expect(bar.style.zIndex).toBe('100');

    unbind();
  });

  it('binds and cleans up through the hook', () => {
    const router = createRouterMock();
    const { unmount } = renderHook(() =>
      useRouteProgress(router as unknown as DataRouter),
    );

    act(() => {
      router.emit('loading');
    });
    expect(document.body.querySelector('[aria-hidden="true"]')).not.toBeNull();

    act(() => unmount());
    expect(document.body.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('cleans up the element when unbound', () => {
    const router = createRouterMock();
    const unbind = bindRouteProgress(router as unknown as DataRouter);

    router.emit('loading');
    expect(document.body.querySelector('div')).not.toBeNull();

    unbind();
    expect(document.body.querySelector('div')).toBeNull();
  });
});
