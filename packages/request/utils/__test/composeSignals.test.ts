import { afterEach, describe, expect, it, vi } from 'vitest';

import CanceledError from '../../cancel/CanceledError';
import FetchError from '../../core/FetchError';
import composeSignals from '../composeSignals';

describe('composeSignals', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns undefined when no timeout or signals are provided', () => {
    expect(composeSignals()).toBeUndefined();
  });

  it('aborts when any input signal aborts', () => {
    const controller = new AbortController();
    const reason = new Error('stop');
    const composed = composeSignals(0, [controller.signal]);

    controller.abort(reason);

    expect(composed?.signal.aborted).toBe(true);
    expect(composed?.reason).toBe(reason);
  });

  it('uses CanceledError when an input signal aborts without an error reason', () => {
    const controller = new AbortController();
    const composed = composeSignals(0, [controller.signal]);

    controller.abort('stop');

    expect(composed?.reason).toBeInstanceOf(CanceledError);
  });

  it('aborts with FetchError when timeout expires', async () => {
    vi.useFakeTimers();
    const composed = composeSignals(10, [], { url: '/slow' });
    const aborted = new Promise<void>(resolve => {
      composed?.signal.addEventListener('abort', () => resolve());
    });

    await vi.advanceTimersByTimeAsync(10);
    await aborted;

    expect(composed?.signal.aborted).toBe(true);
    expect(composed?.reason).toMatchObject({
      code: FetchError.ETIMEDOUT,
      message: 'timeout of 10 ms exceeded',
    });
  });

  it('clean removes signal listeners before aborting', () => {
    const controller = new AbortController();
    const composed = composeSignals(0, [controller.signal]);

    composed?.clean();
    controller.abort();

    expect(composed?.signal.aborted).toBe(false);
  });
});
