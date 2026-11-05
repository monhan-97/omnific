# @omnific/react-router

React Router route definition and navigation helpers for Omnific applications.

## Install

```sh
pnpm add @omnific/react-router
```

## Define routes

```ts
import { createBrowserRouter } from 'react-router';
import {
  defineRoutes,
  index,
  layout,
  route,
} from '@omnific/react-router';

const router = defineRoutes(
  [
    layout(AppLayout, [
      index(Home),
      route('users/:id', UserDetail),
    ]),
  ],
  {
    createRouter: createBrowserRouter,
    ErrorBoundary: RouteErrorBoundary,
  },
);
```

`defineRoutes` applies the shared route options to every route, creates the router, caches it, and returns it.

### Optional route options

`route`, `index`, and `layout` also accept an optional options object when a route needs its own configuration:

```ts
layout(AppLayout, { id: 'root' }, [
  index(Home, { id: 'home' }),
  route('users/:id', UserDetail, {
    id: 'userDetail',
    caseSensitive: true,
  }),
]);
```

### Lazy routes

Use `lazyRoute` for page modules with a default export. React Router handles the
route-level lazy loading, so navigation state and error boundaries cover the
module loading phase.

```ts
import { lazyRoute, layout } from '@omnific/react-router';

layout(AppLayout, [
  lazyRoute('dashboard', () => import('./pages/dashboard/Page')),
  lazyRoute('users/:id', () => import('./pages/users/Page'), {
    id: 'userDetail',
  }),
]);
```

## Route progress

Bind the optional route progress indicator once after creating the router:

```ts
import { bindRouteProgress } from '@omnific/react-router';

const dispose = bindRouteProgress(router, {
  color: 'var(--color-accent-solid, #1677ff)',
});

dispose();
```

The progress element is created only while navigation is active and is removed
after the navigation completes. No global CSS import is required.

Inside React, use the hook instead of binding manually:

```tsx
import { useRouteProgress } from '@omnific/react-router';

function App() {
  useRouteProgress(router, {
    color: 'var(--color-accent-solid, #1677ff)',
  });

  return <RouterProvider router={router} />;
}
```

## Navigate

```ts
import { ROUTE_PATH } from './paths';
import { createRouteNavigator } from '@omnific/react-router';

export const navigateTo = createRouteNavigator(ROUTE_PATH);

navigateTo('userDetail', {
  params: { id: '42' },
  search: { tab: 'profile' },
});
```

`navigateTo` uses the router cached by `defineRoutes`, so callers do not need to pass `navigate` or `router`.
