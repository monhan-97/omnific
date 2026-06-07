import throwIfAborted from './throwIfAborted';
import buildFullPath from './buildFullPath';

import isCancel from '../cancel/isCancel';
import type { RequestConfig, Response } from '../types';

interface RequestFunction {
  (config: any): Promise<any>;
}

export type DispatchRequestConfig = {
  /**
   * 请求基础地址
   */
  baseURL?: string;
  /**
   *
   * @param config
   * @returns
   */
  transformRequest?: (config: RequestConfig) => RequestConfig;
  /**
   *
   * @param config
   * @returns
   */
  transformResponse?: (config: Response<any, any>) => any;
};

export const dispatchRequest = (
  request: RequestFunction,
  defaultConfig: DispatchRequestConfig = {},
) => {
  const { baseURL, transformRequest, transformResponse } = defaultConfig;

  function wrapper(config: RequestConfig) {
    let requestConfig = { ...config };

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
        if (!isCancel(error)) {
          throwIfAborted(requestConfig);
        }
        throw error;
      });
  }
  return wrapper;
};
