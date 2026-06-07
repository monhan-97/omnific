import { describe, expect, it } from 'vitest';

import CanceledError from '../CanceledError';
import isCancel from '../isCancel';

describe('cancel errors', () => {
  it('marks CanceledError instances as cancellable', () => {
    const error = new CanceledError(undefined, { url: '/users' });

    expect(error.name).toBe('CanceledError');
    expect(error.message).toBe('canceled');
    expect(isCancel(error)).toBe(true);
  });

  it('does not treat arbitrary objects as cancel errors', () => {
    expect(isCancel(new Error('nope'))).toBe(false);
    expect(isCancel({ __CANCEL__: false })).toBe(false);
  });
});
