import { describe, expect, it } from 'vitest';

import combineURLs from '../combineURLs';

describe('combineURLs', () => {
  it('joins base and relative urls with a single slash', () => {
    expect(combineURLs('https://api.example.com/', '/users')).toBe(
      'https://api.example.com/users',
    );
    expect(combineURLs('https://api.example.com', 'users')).toBe(
      'https://api.example.com/users',
    );
  });

  it('returns the base url when relative url is missing', () => {
    expect(combineURLs('https://api.example.com')).toBe('https://api.example.com');
  });
});
