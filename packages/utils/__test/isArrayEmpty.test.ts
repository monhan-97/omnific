import { describe, expect, it } from 'vitest';

import { isArrayEmpty } from '../isArrayEmpty';

describe('isArrayEmpty', () => {
  it('returns true only for an empty array', () => {
    expect(isArrayEmpty([])).toBe(true);
    expect(isArrayEmpty([0])).toBe(false);
    expect(isArrayEmpty([] as readonly string[])).toBe(true);
    expect(isArrayEmpty(JSON.parse('null'))).toBe(true);
    expect(isArrayEmpty(undefined)).toBe(true);
  });
});
