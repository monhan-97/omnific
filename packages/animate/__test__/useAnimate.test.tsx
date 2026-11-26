// @vitest-environment jsdom
import { cleanup, render, renderHook } from '@testing-library/react';
import { isNil } from '@omnific/utils';
import { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createMockAnimation, stubElementAnimate } from './mockAnimation';

import { useAnimate } from '../useAnimate';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('useAnimate', () => {
  it('stops the active animation on unmount', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const { result, unmount } = renderHook(() => useAnimate<HTMLDivElement>());
    const [, animate] = result.current;

    const controls = animate(element, { opacity: 1 }, { duration: 1 });
    unmount();

    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });
    expect(mock.commitStyles).toHaveBeenCalledOnce();
    expect(mock.cancel).toHaveBeenCalled();
  });

  it('stops the active animation when the scope ref is attached by React', () => {
    const mock = createMockAnimation();

    const Animated = () => {
      const [scope, animate] = useAnimate<HTMLDivElement>();

      useEffect(() => {
        if (isNil(scope.current)) return;

        stubElementAnimate(scope.current, () => mock);
        animate(scope.current, { opacity: 1 }, { duration: 1 });
      }, [animate, scope]);

      return <div ref={scope} />;
    };

    const { unmount } = render(<Animated />);
    unmount();

    expect(mock.cancel).toHaveBeenCalled();
  });

  it('removes finished animations from the scope', async () => {
    const element = document.createElement('div');
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const { result } = renderHook(() => useAnimate<HTMLDivElement>());
    const [scope, animate] = result.current;

    const controls = animate(element, { opacity: 1 }, { duration: 1 });
    expect(scope.animations).toHaveLength(1);

    mock.triggerFinish();
    await controls.finished;

    expect(scope.animations).toHaveLength(0);
  });

  it('removes canceled animations from the scope', async () => {
    const element = document.createElement('div');
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const { result } = renderHook(() => useAnimate<HTMLDivElement>());
    const [scope, animate] = result.current;

    const controls = animate(element, { opacity: 1 }, { duration: 1 });
    expect(scope.animations).toHaveLength(1);

    controls.cancel();
    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });

    expect(scope.animations).toHaveLength(0);
  });
});
