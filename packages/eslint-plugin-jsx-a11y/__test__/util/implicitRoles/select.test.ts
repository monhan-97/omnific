import { describe, expect, test } from 'vitest';

import { JSXAttributeMock } from '../../utils/jsxMocks';
import getImplicitRoleForSelect from '../../../src/util/implicitRoles/select';

describe('isAbstractRole', () => {
  test('works for combobox', () => {
    expect(getImplicitRoleForSelect([])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('multiple', null)])).toBe('listbox');

    expect(
      getImplicitRoleForSelect([JSXAttributeMock('multiple', undefined)]),
    ).toBe('combobox');

    expect(
      getImplicitRoleForSelect([JSXAttributeMock('multiple', false)]),
    ).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('multiple', '')])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', '1')])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', 1)])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', 0)])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', '0')])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', '-1')])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', '')])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', 'true')])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', true)])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', NaN)])).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', '')])).toBe('combobox');

    expect(
      getImplicitRoleForSelect([JSXAttributeMock('size', undefined)]),
    ).toBe('combobox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', false)])).toBe('combobox');
  });

  test('works for listbox based on multiple attribute', () => {
    expect(getImplicitRoleForSelect([JSXAttributeMock('multiple', true)])).toBe('listbox');

    expect(
      getImplicitRoleForSelect([JSXAttributeMock('multiple', 'multiple')]),
    ).toBe('listbox');

    expect(
      getImplicitRoleForSelect([JSXAttributeMock('multiple', 'true')]),
    ).toBe('listbox');
  });

  test('works for listbox based on size attribute', () => {
    expect(getImplicitRoleForSelect([JSXAttributeMock('size', 2)])).toBe('listbox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', '3')])).toBe('listbox');

    expect(getImplicitRoleForSelect([JSXAttributeMock('size', 40)])).toBe('listbox');
  });
});
