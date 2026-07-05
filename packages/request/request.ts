import type { FetchRequestConfig, FetchResponse } from './fetch';
import type { XhrRequestConfig, XhrResponse } from './xhr';
import xhr from './xhr';
import fetch from './fetch';
import { type DispatchRequestConfig, dispatchRequest } from './core/dispatchRequest';

/**
 * 基于 fetch 传输层的 URL 优先请求函数签名。
 */
export type FetchRequest = <T, R = FetchResponse<T>>(
  url: string,
  config?: FetchRequestConfig,
) => Promise<R>;

/**
 * 基于 XMLHttpRequest 传输层的 URL 优先请求函数签名。
 */
export type XhrRequest = <T, R = XhrResponse<T>>(url: string, config?: XhrRequestConfig) => Promise<R>;

/**
 * 带有 HTTP 方法辅助函数和上传能力的请求客户端。
 */
export type ApiRequest = typeof fetch & {
  get: FetchRequest;
  delete: FetchRequest;
  head: FetchRequest;
  options: FetchRequest;
  post: FetchRequest;
  put: FetchRequest;
  patch: FetchRequest;
  upload: XhrRequest;
};

/**
 * 使用默认配置创建带有方法辅助函数的请求客户端。
 */
export function createRequest(config?: DispatchRequestConfig) {
  const request = dispatchRequest(fetch, config) as ApiRequest;

  const xhrRequest: typeof xhr = dispatchRequest(xhr, config);

  request.get = (url, config) => request({ ...config, method: 'GET', url });
  request.delete = (url, config) => request({ ...config, method: 'DELETE', url });
  request.head = (url, config) => request({ ...config, method: 'HEAD', url });
  request.options = (url, config) => request({ ...config, method: 'OPTIONS', url });
  request.post = (url, config) => request({ ...config, method: 'POST', url });
  request.put = (url, config) => request({ ...config, method: 'PUT', url });
  request.patch = (url, config) => request({ ...config, method: 'PATCH', url });
  request.upload = (url, config) => xhrRequest({ ...config, method: 'POST', url });

  return request;
}

/**
 * 使用标准 fetch 传输层的默认请求客户端。
 */
export const request = createRequest();
