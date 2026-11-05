import { hasValue, isArray, isNil, isString } from '@omnific/utils';
import type { ComponentType } from 'react';
import type { DataRouter, IndexRouteObject, NonIndexRouteObject, RouteObject } from 'react-router';

import { setRouter } from './routerCache';

/**
 * 路由公共选项，当前只需要透传错误边界。
 */
type SharedRouteOptions = Pick<NonIndexRouteObject, 'ErrorBoundary'>;

/**
 * 统一的路由扩展选项：移除由 helper 自行管理的字段。
 */
type HelperOptions<TRoute extends RouteObject> = Omit<
  TRoute,
  'path' | 'Component' | 'children' | 'index' | 'lazy'
>;

/**
 * 普通路由、布局路由和懒加载路由共用的扩展选项。
 */
export type RouteHelperOptions = HelperOptions<NonIndexRouteObject>;

/**
 * index 路由的扩展选项。
 */
type IndexHelperOptions = HelperOptions<IndexRouteObject>;

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
 * 解析 route helper 的 options / children 参数形式。
 */
function resolveRouteArguments<TOptions>(
  optionsOrChildren: TOptions | RouteObject[] | undefined,
  children: RouteObject[] | undefined,
): { options?: TOptions; children?: RouteObject[] } {
  if (isArray<RouteObject>(optionsOrChildren)) {
    return { children: optionsOrChildren };
  }

  if (hasValue(optionsOrChildren)) {
    return { options: optionsOrChildren, children };
  }

  return { children };
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
  const { options, children: routeChildren } = resolveRouteArguments<RouteHelperOptions>(
    optionsOrChildren,
    children,
  );

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
  const { options, children: routeChildren } = resolveRouteArguments<LayoutHelperOptions>(
    optionsOrChildren,
    children,
  );

  return {
    Component,
    ...options,
    children: routeChildren,
  };
}

/**
 * 懒加载页面模块的默认导出组件。
 */
export type LazyComponentLoader = () => Promise<{ default: ComponentType }>;

/**
 * 创建懒加载页面路由。
 *
 * `load` 约定返回带有默认导出组件的模块，由 React Router 的 `lazy`
 * 接管模块加载状态。
 */
export function lazyRoute(
  path: string,
  load: LazyComponentLoader,
  children?: RouteObject[],
): NonIndexRouteObject;

/**
 * 创建带路由选项的懒加载页面路由。
 */
export function lazyRoute(
  path: string,
  load: LazyComponentLoader,
  options: RouteHelperOptions,
  children?: RouteObject[],
): NonIndexRouteObject;

export function lazyRoute(
  path: string,
  load: LazyComponentLoader,
  optionsOrChildren?: RouteHelperOptions | RouteObject[],
  children?: RouteObject[],
): NonIndexRouteObject {
  const { options, children: routeChildren } = resolveRouteArguments<RouteHelperOptions>(
    optionsOrChildren,
    children,
  );

  return {
    path,
    ...options,
    lazy: async () => {
      const { default: Component } = await load();
      return { Component };
    },
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
