import { describe, expect, test } from 'vitest';

import isHiddenFromScreenReader from '../../src/util/isHiddenFromScreenReader';
import { JSXAttributeMock } from '../utils/jsxMocks';

describe('isHiddenFromScreenReader', () => {
  test('detects hidden input type', () => {
    expect(isHiddenFromScreenReader('input', [JSXAttributeMock('type', 'hidden')])).toBe(true);
    expect(isHiddenFromScreenReader('input', [JSXAttributeMock('type', 'text')])).toBe(false);
    expect(isHiddenFromScreenReader('div', [JSXAttributeMock('type', 'hidden')])).toBe(false);
  });

  test('detects aria-hidden={true}', () => {
    expect(isHiddenFromScreenReader('div', [JSXAttributeMock('aria-hidden', true)])).toBe(true);
    expect(isHiddenFromScreenReader('div', [JSXAttributeMock('aria-hidden', false)])).toBe(false);
    expect(isHiddenFromScreenReader('div', [])).toBe(false);
  });
});
