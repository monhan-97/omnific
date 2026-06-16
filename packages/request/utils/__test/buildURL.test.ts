import { describe, expect, it } from 'vitest';

import buildURL from '../buildURL';

describe('buildURL', () => {
  it('serializes object params and skips nil values', () => {
    expect(
      buildURL('/users', {
        active: true,
        page: 2,
        empty: undefined,
        missing: undefined,
        tag: ['admin', undefined, 'owner', undefined],
      }),
    ).toBe('/users?active=true&page=2&tag=admin&tag=owner');
  });

  it('appends params to existing query strings and removes hash fragments', () => {
    expect(buildURL('/users?active=true#profile', { page: 2 })).toBe(
      '/users?active=true&page=2',
    );
  });

  it('accepts URLSearchParams and leaves urls unchanged when params serialize empty', () => {
    expect(buildURL('/users', new URLSearchParams({ q: 'name' }))).toBe('/users?q=name');
    expect(buildURL('/users', {})).toBe('/users');
  });
});
