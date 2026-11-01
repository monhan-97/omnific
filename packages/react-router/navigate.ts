import { buildURL } from '@omnific/utils';
import type { QueryInput } from '@omnific/utils';
import { generatePath } from 'react-router';
import type { NavigateOptions, Params } from 'react-router';

import { getRouter } from './routerCache';

/**
 * navigateTo 的选项。
 */
export type NavigateToOptions = NavigateOptions & {
  /**
   * 路径参数，用于替换 path 中的 :param 片段。
   */
  params?: Params;
  /**
   * 追加到 URL 的查询参数。
   */
  search?: QueryInput;
};

/**
 * 绑定到具体路由表的导航函数。
 */
export type RouteNavigator<TPaths extends Record<string, string>> = (
  key: keyof TPaths,
  options?: NavigateToOptions,
) => Promise<void>;

/**
 * 创建绑定到具体路由表的导航函数。
 */
export function createRouteNavigator<const TPaths extends Record<string, string>>(
  paths: TPaths,
): RouteNavigator<TPaths> {
  return (key, options = {}) => {
    const { params, search, ...navigateOptions } = options;
    const path: string = paths[key]!;
    const resolvedPath = generatePath(path, params);
    const targetURL = buildURL(resolvedPath, search);

    return getRouter().navigate(targetURL, navigateOptions);
  };
}
