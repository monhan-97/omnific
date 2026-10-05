import { describe, expect, it } from 'vitest';

import { kebabCase } from '../kebabCase';

describe('kebabCase', () => {
  it('converts common naming formats to kebab-case', () => {
    expect(kebabCase('camelCase')).toBe('camel-case');
    expect(kebabCase('some whitespace')).toBe('some-whitespace');
    expect(kebabCase('hyphen-text')).toBe('hyphen-text');
    expect(kebabCase('snake_case')).toBe('snake-case');
    expect(kebabCase('HTTPRequest')).toBe('http-request');
  });

  it('keeps unicode and emoji words', () => {
    expect(kebabCase('Keep unicode 😅')).toBe('keep-unicode-😅');
  });
});
