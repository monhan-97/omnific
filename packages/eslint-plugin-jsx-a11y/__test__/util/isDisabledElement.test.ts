import { describe, expect, test } from 'vitest';

import { JSXAttributeMock } from '../utils/jsxMocks';
import isDisabledElement from '../../src/util/isDisabledElement';

describe('isDisabledElement', () => {
  test('HTML5', () => {
    expect(isDisabledElement([JSXAttributeMock('disabled', 'disabled')])).toBe(true);

    expect(isDisabledElement([JSXAttributeMock('disabled', null)])).toBe(true);

    expect(isDisabledElement([JSXAttributeMock('disabled', undefined)])).toBe(false);
  });

  test('ARIA', () => {
    expect(isDisabledElement([JSXAttributeMock('aria-disabled', 'true')])).toBe(true);

    expect(isDisabledElement([JSXAttributeMock('aria-disabled', true)])).toBe(true);

    expect(
      isDisabledElement([JSXAttributeMock('aria-disabled', 'false')]),
    ).toBe(false);

    expect(isDisabledElement([JSXAttributeMock('aria-disabled', false)])).toBe(false);

    expect(isDisabledElement([JSXAttributeMock('aria-disabled', null)])).toBe(false);

    expect(
      isDisabledElement([JSXAttributeMock('aria-disabled', undefined)]),
    ).toBe(false);
  });
});
