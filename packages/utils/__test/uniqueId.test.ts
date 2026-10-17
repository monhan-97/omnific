import { describe, expect, it } from 'vitest';

import { uniqueId } from '../uniqueId';

describe('uniqueId', () => {
  it('appends an incrementing identifier to the prefix', () => {
    const first = uniqueId('contact_');
    const second = uniqueId('contact_');

    expect(first).toMatch(/^contact_\d+$/);
    expect(Number(second.slice('contact_'.length))).toBe(Number(first.slice('contact_'.length)) + 1);
  });

  it('returns the bare identifier when no prefix is provided', () => {
    expect(uniqueId()).toMatch(/^\d+$/);
  });

  it('generates unique identifiers across calls', () => {
    const identifiers = new Set(Array.from({ length: 64 }, () => uniqueId('node-')));

    expect(identifiers.size).toBe(64);
  });
});
