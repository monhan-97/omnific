import { generatePath } from 'react-router';
import type { NavigateOptions, Params } from 'react-router';

import { getRouter } from './routerCache';

/**
 * 绑定到具体路由表的导航函数。
 */
export type RouteNavigator<TPaths extends Record<string, string>> = (
  key: keyof TPaths,
  params?: Params,
  options?: NavigateOptions,
) => Promise<void>;

/**
 * 创建绑定到具体路由表的导航函数。
 */
export function createRouteNavigator<const TPaths extends Record<string, string>>(
  paths: TPaths,
): RouteNavigator<TPaths> {
  return (key, params, options) => {
    const path: string = paths[key]!;
    return getRouter().navigate(generatePath(path, params), options);
  };
}
