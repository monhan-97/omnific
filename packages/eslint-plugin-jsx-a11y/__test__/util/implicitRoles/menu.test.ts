import { expect, test } from 'vitest';

import { JSXAttributeMock } from '../../utils/jsxMocks';
import getImplicitRoleForMenu from '../../../src/util/implicitRoles/menu';

test('isAbstractRole', () => {
  expect(getImplicitRoleForMenu([JSXAttributeMock('type', 'toolbar')])).toBe(
    'toolbar',
  );

  expect(getImplicitRoleForMenu([JSXAttributeMock('type', '')])).toBe(null);
});
