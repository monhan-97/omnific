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
