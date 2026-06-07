import { describe, expect, it } from 'vitest';

import isAbsoluteURL from '../isAbsoluteURL';

describe('isAbsoluteURL', () => {
  it('detects protocol and protocol-relative urls', () => {
    expect(isAbsoluteURL('https://example.com/users')).toBe(true);
    expect(isAbsoluteURL('//example.com/users')).toBe(true);
    expect(isAbsoluteURL('custom+scheme://example.com/users')).toBe(true);
  });

  it('rejects relative urls', () => {
    expect(isAbsoluteURL('/users')).toBe(false);
    expect(isAbsoluteURL('users')).toBe(false);
  });
});
