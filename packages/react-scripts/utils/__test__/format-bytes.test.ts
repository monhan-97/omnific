import { describe, expect, it } from 'vitest';

import { formatBytes } from '../format-bytes';

describe('formatBytes', () => {
  it('formats byte values without decimals', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(999)).toBe('999 B');
  });

  it('formats larger values with compact decimal precision', () => {
    expect(formatBytes(1000)).toBe('1 kB');
    expect(formatBytes(1024)).toBe('1.02 kB');
    expect(formatBytes(12_345)).toBe('12.3 kB');
    expect(formatBytes(123_456)).toBe('123 kB');
    expect(formatBytes(1_048_576)).toBe('1.05 MB');
  });

  it('preserves the sign for negative values', () => {
    expect(formatBytes(-1536)).toBe('-1.54 kB');
  });
});
