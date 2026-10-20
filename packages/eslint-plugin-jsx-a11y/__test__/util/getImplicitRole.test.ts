import { expect, test } from 'vitest';

import getImplicitRole from '../../src/util/getImplicitRole';

test('getImplicitRole', () => {
  expect(getImplicitRole('li', [])).toBe('listitem');

  expect(getImplicitRole('div', [])).toBe(null);
});
