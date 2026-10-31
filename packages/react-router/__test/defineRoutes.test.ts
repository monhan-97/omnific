import { createMemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { defineRoutes, index, layout, prefix, route } from '../defineRoutes';
import { clearRouter } from '../routerCache';

const Page = () => null;
const ErrorBoundary = () => null;

describe('defineRoutes', () => {
  beforeEach(() => {
    clearRouter();
  });

  it('applies route options to nested routes and returns the created router', () => {
    const indexRoute = index(Page);
    const userRoute = route('users/:id', Page);
    const layoutRoute = layout(Page, [indexRoute, userRoute]);

    const router = defineRoutes([layoutRoute], {
      createRouter: createMemoryRouter,
      ErrorBoundary,
    });

    expect(router.state.location.pathname).toBe('/');
    expect(layoutRoute.ErrorBoundary).toBe(ErrorBoundary);
    expect(indexRoute.ErrorBoundary).toBe(ErrorBoundary);
    expect(userRoute.ErrorBoundary).toBe(ErrorBoundary);
  });

  it('does not copy createRouter onto route objects', () => {
    const userRoute = route('users/:id', Page);

    defineRoutes([userRoute], {
      createRouter: createMemoryRouter,
      ErrorBoundary,
    });

    expect(userRoute).not.toHaveProperty('createRouter');
  });
});

describe('prefix', () => {
  it('prefixes paths in place and forwards the prefix through layout routes', () => {
    const userRoute = route('/user', Page);
    const roleRoute = route('role', Page);
    const layoutRoute = layout(Page, [roleRoute]);
    const routes = [userRoute, layoutRoute];

    prefix('/system', routes);

    expect(userRoute.path).toBe('/system/user');
    expect(roleRoute.path).toBe('/system/role');
    expect(routes[0]).toBe(userRoute);
    expect(layoutRoute.children?.[0]).toBe(roleRoute);
  });
});
