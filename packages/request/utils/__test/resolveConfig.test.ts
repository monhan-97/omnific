import { describe, expect, it } from 'vitest';

import FetchError from '../../core/FetchError';
import resolveConfig from '../resolveConfig';

describe('resolveConfig', () => {
  it('applies default method and timeout while building the url', () => {
    expect(resolveConfig({ url: '/users', params: { page: 1 } })).toEqual({
      method: 'GET',
      timeout: 0,
      url: '/users?page=1',
    });
  });

  it('preserves explicit method and timeout', () => {
    expect(resolveConfig({ url: '/users', method: 'POST', timeout: 500 })).toEqual({
      method: 'POST',
      timeout: 500,
      url: '/users',
    });
  });

  it('throws a FetchError when url is missing', () => {
    expect(() => resolveConfig({})).toThrow(FetchError);
    expect(() => resolveConfig({})).toThrow('URL is required but got undefined');
  });
});
