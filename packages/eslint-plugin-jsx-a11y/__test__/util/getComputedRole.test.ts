import { expect, test } from 'vitest';

import { JSXAttributeMock } from '../utils/jsxMocks';
import getComputedRole from '../../src/util/getComputedRole';

test('getComputedRole', () => {
  expect(getComputedRole('div', [JSXAttributeMock('role', 'button')])).toBe(
    'button',
  );

  expect(getComputedRole('li', [JSXAttributeMock('role', 'beeswax')])).toBe(
    'listitem',
  );

  expect(getComputedRole('div', [JSXAttributeMock('role', 'beeswax')])).toBe(
    null,
  );

  expect(getComputedRole('li', [])).toBe('listitem');

  expect(getComputedRole('div', [])).toBe(null);

  expect(getComputedRole('li', [JSXAttributeMock('role', 'beeswax')])).toBe(
    'listitem',
  );

  expect(getComputedRole('div', [])).toBe(null);
});
