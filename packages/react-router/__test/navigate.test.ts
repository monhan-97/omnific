import { createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { defineRoutes, layout, route } from '../defineRoutes';
import { createRouteNavigator } from '../navigate';
import { clearRouter } from '../routerCache';

const Page = () => null;
const paths = {
  home: '/',
  userDetail: '/users/:id',
} as const;

describe('createRouteNavigator', () => {
  beforeEach(() => {
    clearRouter();
  });

  it('navigates with the router cached by defineRoutes', async () => {
    const router = defineRoutes([layout(Page, [route(paths.userDetail, Page)])], {
      createRouter: createMemoryRouter,
    });
    const navigateTo = createRouteNavigator(paths);

    await navigateTo('userDetail', { id: '42' });

    expect(router.state.location.pathname).toBe('/users/42');
  });

  it('throws when navigateTo is called before router initialization', () => {
    const navigateTo = createRouteNavigator(paths);

    expect(() => navigateTo('home')).toThrow('Router 尚未初始化');
  });
});
