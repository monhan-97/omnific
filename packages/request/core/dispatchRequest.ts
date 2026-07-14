import throwIfAborted from './throwIfAborted';
import buildFullPath from './buildFullPath';

import isCancel from '../cancel/isCancel';
import type { RequestConfig, Response } from '../types';

interface RequestFunction {
  (config: any): Promise<any>;
}

/**
 * 请求分发前后应用的默认配置和转换函数。
 */
export type DispatchRequestConfig = {
  /**
   * 请求基础地址
   */
  baseURL?: string;
  /**
   * 默认是否携带跨站点凭据，可被单次请求配置覆盖。
   */
  withCredentials?: RequestConfig['withCredentials'];
  /**
   * 在分发前转换请求配置。
   */
  transformRequest?: (config: RequestConfig) => RequestConfig;
  /**
   * 在返回前转换标准化响应。
   */
  transformResponse?: (config: Response<any, any>) => any;
};

/**
 * 使用基础 URL 处理和请求/响应转换包装传输函数。
 */
export const dispatchRequest = (
  request: RequestFunction,
  defaultConfig: DispatchRequestConfig = {},
) => {
  const { baseURL, transformRequest, transformResponse, withCredentials } = defaultConfig;

  function wrapper(config: RequestConfig) {
    let requestConfig: RequestConfig = { withCredentials, ...config };

    if (transformRequest) {
      requestConfig = transformRequest(requestConfig);
    }

    if (baseURL && requestConfig.url) {
      requestConfig.url = buildFullPath(baseURL, requestConfig.url);
    }

    return request(requestConfig)
      .then(response => {
        throwIfAborted(requestConfig);
        return transformResponse ? transformResponse(response) : response;
      })
      .catch(error => {
        if (isCancel(error)) throw error;
        throwIfAborted(requestConfig);
        throw error;
      });
  }
  return wrapper;
};
