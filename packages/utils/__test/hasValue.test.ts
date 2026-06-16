import { describe, expect, it } from 'vitest';

import { hasValue } from '../hasValue';

describe('hasValue', () => {
  it('returns false only for nullish values', () => {
    expect(hasValue(JSON.parse('null'))).toBe(false);
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue(false)).toBe(true);
    expect(hasValue(0)).toBe(true);
    expect(hasValue('')).toBe(true);
  });
});
