import { expect, test } from 'vitest';

import { JSXAttributeMock } from '../utils/jsxMocks';
import getExplicitRole from '../../src/util/getExplicitRole';

test('getExplicitRole', () => {
  expect(getExplicitRole('div', [JSXAttributeMock('role', 'button')])).toBe(
    'button',
  );

  expect(getExplicitRole('div', [JSXAttributeMock('role', 'beeswax')])).toBe(
    null,
  );

  expect(getExplicitRole('div', [])).toBe(null);
});
