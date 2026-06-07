import { describe, expect, it } from 'vitest';

import isCancel from '../../cancel/isCancel';
import throwIfAborted from '../throwIfAborted';

describe('throwIfAborted', () => {
  it('throws a cancel error when config signal is aborted', () => {
    const controller = new AbortController();
    controller.abort();

    expect(() => throwIfAborted({ signal: controller.signal })).toThrowError(
      expect.objectContaining({
        message: 'canceled',
      }),
    );

    try {
      throwIfAborted({ signal: controller.signal });
    } catch (error) {
      expect(isCancel(error)).toBe(true);
    }
  });

  it('does nothing when there is no aborted signal', () => {
    expect(() => throwIfAborted({})).not.toThrow();
  });
});
