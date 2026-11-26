// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createMockAnimation, stubElementAnimate } from './mockAnimation';

import { animateElement } from '../animateElement';
import { normalizeKeyframes } from '../helpers';
import { isAnimationAbortError } from '../nativeAnimation';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('normalizeKeyframes', () => {
  it('uses computed style as from and appends px for length props', () => {
    const computedStyle = {
      width: '10px',
      opacity: '1',
      lineHeight: '1.5',
      letterSpacing: '0px',
    } as unknown as CSSStyleDeclaration;

    expect(normalizeKeyframes(null, computedStyle, 'width')).toEqual(['10px', '10px']);
    expect(normalizeKeyframes(20, computedStyle, 'width')).toEqual(['10px', '20px']);
    expect(normalizeKeyframes(0, computedStyle, 'width')).toEqual(['10px', '0px']);
    expect(normalizeKeyframes('50%', computedStyle, 'width')).toEqual(['10px', '50%']);
    expect(normalizeKeyframes(1, computedStyle, 'opacity')).toEqual(['1', 1]);
    expect(normalizeKeyframes(2, computedStyle, 'lineHeight')).toEqual(['1.5', 2]);
    expect(normalizeKeyframes(2, computedStyle, 'letterSpacing')).toEqual(['0px', '2px']);
  });
});

describe('animateElement', () => {
  it('rejects finished with AbortError after stop', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const controls = animateElement(element, { opacity: 1 }, { duration: 0.3 });
    controls.stop();

    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });
    expect(mock.commitStyles).toHaveBeenCalledOnce();
    expect(mock.cancel).toHaveBeenCalled();
  });

  it('aborts the previous animation when starting a new one', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const first = createMockAnimation();
    const second = createMockAnimation();
    const queue = [first, second];
    const animateSpy = stubElementAnimate(element, () => queue.shift()!);

    const firstControls = animateElement(element, { opacity: 1 }, { duration: 1 });
    const secondControls = animateElement(element, { opacity: 0 }, { duration: 1 });

    await expect(firstControls.finished).rejects.toMatchObject({ name: 'AbortError' });
    expect(first.commitStyles).toHaveBeenCalledOnce();
    expect(animateSpy).toHaveBeenCalledTimes(2);

    second.triggerFinish();
    await expect(secondControls.finished).resolves.toBeUndefined();
  });

  it('returns awaitable noop controls when keyframes are empty', async () => {
    const element = document.createElement('div');
    const animateSpy = stubElementAnimate(element, () => createMockAnimation());

    const controls = animateElement(element, {});
    await expect(controls).resolves.toBeUndefined();
    expect(animateSpy).not.toHaveBeenCalled();
  });

  it('returns awaitable noop controls when WAAPI is unavailable', async () => {
    const element = document.createElement('div');

    const controls = animateElement(element, { opacity: 1 });
    await expect(controls).resolves.toBeUndefined();
  });

  it('animates numeric width with px keyframes', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    element.style.width = '0px';

    const mock = createMockAnimation();
    const animateSpy = stubElementAnimate(element, () => mock);

    const controls = animateElement(element, { width: 16 }, { duration: 0.2 });
    const animateInput = animateSpy.mock.calls[0]?.[0] as PropertyIndexedKeyframes;
    expect(animateInput.width).toEqual(['0px', '16px']);

    mock.triggerFinish();
    await expect(controls.finished).resolves.toBeUndefined();
    expect(element.style.width).toBe('16px');
  });

  it('rejects finished after cancel without committing styles', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const controls = animateElement(element, { opacity: 1 }, { duration: 1 });
    controls.cancel();

    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });
    expect(mock.commitStyles).not.toHaveBeenCalled();
    expect(mock.cancel).toHaveBeenCalled();
  });

  it('resolves finished after complete and commits the final style', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const controls = animateElement(element, { opacity: 1 }, { duration: 1 });
    controls.complete();

    await expect(controls.finished).resolves.toBeUndefined();
    expect(element.style.opacity).toBe('1');
  });

  it('still cancels and rejects when commitStyles throws', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const mock = createMockAnimation();
    mock.commitStyles.mockImplementation(() => {
      throw new Error('commit failed');
    });
    stubElementAnimate(element, () => mock);

    const controls = animateElement(element, { opacity: 1 }, { duration: 1 });
    controls.stop();

    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });
    expect(mock.cancel).toHaveBeenCalled();
  });

  it('rejects finished when the animation is canceled externally', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const mock = createMockAnimation();
    stubElementAnimate(element, () => mock);

    const controls = animateElement(element, { opacity: 1 }, { duration: 1 });
    mock.triggerCancel();

    await expect(controls.finished).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('merges multiple properties into one animation', () => {
    const element = document.createElement('div');
    document.body.append(element);
    element.style.opacity = '0';
    element.style.width = '0px';

    const mock = createMockAnimation();
    const animateSpy = stubElementAnimate(element, () => mock);

    animateElement(element, { opacity: 1, width: 16 });

    expect(animateSpy).toHaveBeenCalledOnce();
    const animateInput = animateSpy.mock.calls[0]?.[0] as PropertyIndexedKeyframes;
    expect(animateInput.opacity).toEqual(['0', 1]);
    expect(animateInput.width).toEqual(['0px', '16px']);
  });

  it('detects animation abort errors by shape', () => {
    expect(isAnimationAbortError(new DOMException('aborted', 'AbortError'))).toBe(true);
    expect(isAnimationAbortError({ name: 'AbortError' })).toBe(true);
    expect(isAnimationAbortError(new Error('boom'))).toBe(false);
    expect(isAnimationAbortError(null)).toBe(false);
  });
});
