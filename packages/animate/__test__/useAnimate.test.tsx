// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
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
    const [scope, animate] = result.current;
    scope.current = element;

    const controls = animate(element, { opacity: 1 }, { duration: 1 });
    unmount();

    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });
    expect(mock.commitStyles).toHaveBeenCalledOnce();
    expect(mock.cancel).toHaveBeenCalled();
  });
});
