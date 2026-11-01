import { describe, expect, it } from 'vitest';

import { buildURL } from '../buildURL';

describe('buildURL', () => {
  it('serializes object params and skips nil values', () => {
    expect(
      buildURL('/users', {
        active: true,
        page: 2,
        empty: undefined,
        missing: null,
        tag: ['admin', undefined, 'owner'],
      }),
    ).toBe('/users?active=true&page=2&tag=admin&tag=owner');
  });

  it('appends params to an existing query string and removes the hash', () => {
    expect(buildURL('/users?active=true#profile', { page: 2 })).toBe(
      '/users?active=true&page=2',
    );
  });

  it('accepts URLSearchParams and raw query strings', () => {
    expect(buildURL('/users', new URLSearchParams({ q: 'name' }))).toBe('/users?q=name');
    expect(buildURL('/users', '?q=name')).toBe('/users?q=name');
  });

  it('returns the original url when params serialize to an empty string', () => {
    expect(buildURL('/users', {})).toBe('/users');
    expect(buildURL('/users', '?')).toBe('/users');
  });
});
