import type { FetchRequestConfig, FetchResponse } from './fetch';
import type { XhrRequestConfig, XhrResponse } from './xhr';
import xhr from './xhr';
import fetch from './fetch';
import { type DispatchRequestConfig, dispatchRequest } from './core/dispatchRequest';

export type FetchRequest = <T, R = FetchResponse<T>>(
  url: string,
  config?: FetchRequestConfig,
) => Promise<R>;

export type XhrRequest = <T, R = XhrResponse<T>>(url: string, config?: XhrRequestConfig) => Promise<R>;

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

export const request = createRequest();
