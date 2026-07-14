import { describe, expect, it } from 'vitest';

import { isStringEmpty } from '../isStringEmpty';

describe('isStringEmpty', () => {
  it('returns true only for an empty string', () => {
    expect(isStringEmpty('')).toBe(true);
    expect(isStringEmpty(' ')).toBe(true);
    expect(isStringEmpty('\n\t')).toBe(true);
    expect(isStringEmpty('value')).toBe(false);
    expect(isStringEmpty(JSON.parse('null'))).toBe(true);
    expect(isStringEmpty(undefined)).toBe(true);
  });
});
