import { describe, expect, it } from 'vitest';

import * as menu from '../index';

describe('menu entry', () => {
  it('re-exports navigation hooks', () => {
    expect(menu.useListNavigation).toBeTypeOf('function');
    expect(menu.useTypeahead).toBeTypeOf('function');
  });
});
