import { expect, test } from 'vitest';

import { JSXAttributeMock } from '../../utils/jsxMocks';
import getImplicitRoleForMenuitem from '../../../src/util/implicitRoles/menuitem';

test('isAbstractRole', () => {
  expect(
    getImplicitRoleForMenuitem([JSXAttributeMock('type', 'command')]),
  ).toBe('menuitem');

  expect(
    getImplicitRoleForMenuitem([JSXAttributeMock('type', 'checkbox')]),
  ).toBe('menuitemcheckbox');

  expect(getImplicitRoleForMenuitem([JSXAttributeMock('type', 'radio')])).toBe(
    'menuitemradio',
  );

  expect(getImplicitRoleForMenuitem([JSXAttributeMock('type', '')])).toBe(null);

  expect(getImplicitRoleForMenuitem([JSXAttributeMock('type', true)])).toBe(
    null,
  );
});
