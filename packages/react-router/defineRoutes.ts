import { hasValue, isArray, isNil, isString } from '@omnific/utils';
import type { ComponentType } from 'react';
import type { DataRouter, IndexRouteObject, NonIndexRouteObject, RouteObject } from 'react-router';

import { setRouter } from './routerCache';

/**
 * 路由公共选项，当前只需要透传错误边界。
 */
type SharedRouteOptions = Pick<NonIndexRouteObject, 'ErrorBoundary'>;

/**
 * 普通路由和布局路由的扩展选项。
 */
type RouteHelperOptions = Omit<
  NonIndexRouteObject,
  'path' | 'Component' | 'children' | 'index'
>;

/**
 * index 路由的扩展选项。
 */
type IndexHelperOptions = Omit<
  IndexRouteObject,
  'path' | 'Component' | 'children' | 'index'
>;

/**
 * 布局路由的扩展选项。
 */
type LayoutHelperOptions = RouteHelperOptions;

/**
 * defineRoutes 的选项。
 */
export type DefineRoutesOptions = SharedRouteOptions & {
  /**
   * 创建应用 router 的函数，例如 createBrowserRouter、createHashRouter 或 createMemoryRouter。
   */
  createRouter: (routes: RouteObject[]) => DataRouter;
};

/**
 * 把路由公共选项复制到尚未配置对应选项的路由，包含嵌套的 children。
 */
function applyOptions(routes: RouteObject[], options: SharedRouteOptions): void {
  for (const item of routes) {
    if (isNil(item.ErrorBoundary) && hasValue(options.ErrorBoundary)) {
      item.ErrorBoundary = options.ErrorBoundary;
    }

    if (item.children) {
      applyOptions(item.children, options);
    }
  }
}

/**
 * 定义路由、创建 router 并缓存为当前应用的 router。
 */
export function defineRoutes(
  routes: RouteObject[],
  options: DefineRoutesOptions,
): DataRouter {
  const { createRouter, ...routeOptions } = options;

  applyOptions(routes, routeOptions);

  const router = createRouter(routes);

  setRouter(router);

  return router;
}

/**
 * 创建普通路由：path 由调用方提供，渲染组件直接传入。
 */
export function route(
  path: string | null | undefined,
  Component: ComponentType,
  children?: RouteObject[],
): NonIndexRouteObject;

export function route(
  path: string | null | undefined,
  Component: ComponentType,
  options: RouteHelperOptions,
  children?: RouteObject[],
): NonIndexRouteObject;

export function route(
  path: string | null | undefined,
  Component: ComponentType,
  optionsOrChildren?: RouteHelperOptions | RouteObject[],
  children?: RouteObject[],
): NonIndexRouteObject {
  let options: RouteHelperOptions = {};
  let routeChildren = children;

  if (isArray<RouteObject>(optionsOrChildren)) {
    routeChildren = optionsOrChildren;
  } else if (hasValue(optionsOrChildren)) {
    options = optionsOrChildren;
  }

  return {
    path: path ?? undefined,
    Component,
    ...options,
    children: routeChildren,
  };
}

/**
 * 创建 index 路由：自动补上 index 标记，且不接收 children。
 */
export function index(
  Component: ComponentType,
  options: IndexHelperOptions = {},
): IndexRouteObject {
  return {
    index: true,
    Component,
    ...options,
  };
}

/**
 * 创建布局路由：没有 path，只负责渲染嵌套的 children。
 */
export function layout(
  Component: ComponentType,
  children?: RouteObject[],
): NonIndexRouteObject;

export function layout(
  Component: ComponentType,
  options: LayoutHelperOptions,
  children?: RouteObject[],
): NonIndexRouteObject;

export function layout(
  Component: ComponentType,
  optionsOrChildren?: LayoutHelperOptions | RouteObject[],
  children?: RouteObject[],
): NonIndexRouteObject {
  let options: LayoutHelperOptions = {};
  let routeChildren = children;

  if (isArray<RouteObject>(optionsOrChildren)) {
    routeChildren = optionsOrChildren;
  } else if (hasValue(optionsOrChildren)) {
    options = optionsOrChildren;
  }

  return {
    Component,
    ...options,
    children: routeChildren,
  };
}

function joinRoutePaths(prefixPath: string, path: string): string {
  return `${prefixPath.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/**
 * 给一组路由加统一的路径前缀，直接原地修改路由对象。
 *
 * - 有 path 的路由：前缀拼到自身 path 上，children 保持相对路径不变。
 * - 无 path 的布局路由：前缀继续下发给 children。
 */
export function prefix(prefixPath: string, routes: RouteObject[]): void {
  for (const item of routes) {
    if (item.index || isString(item.path)) {
      item.path = item.path ? joinRoutePaths(prefixPath, item.path) : prefixPath;
      continue;
    }

    if (item.children) {
      prefix(prefixPath, item.children);
    }
  }
}
