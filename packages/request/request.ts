import { dispatchFetchRequest, dispatchXhrRequest } from './core/dispatchRequest';
import type { FetchRequestConfig, FetchResponse } from './fetch';
import type { XhrRequestConfig, XhrResponse } from './xhr';

export type FetchRequest = <T>(
  url: string,
  config: FetchRequestConfig,
) => Promise<FetchResponse<T>>;

export type XhrRequest = <T>(url: string, config: XhrRequestConfig) => Promise<XhrResponse<T>>;

export type ApiRequest = typeof dispatchFetchRequest & {
  get: FetchRequest;
  delete: FetchRequest;
  head: FetchRequest;
  options: FetchRequest;
  post: FetchRequest;
  put: FetchRequest;
  patch: FetchRequest;
  upload: XhrRequest;
};

const request = dispatchFetchRequest as ApiRequest;

Object.assign(request, {
  get(url, config) {
    return dispatchFetchRequest({ ...config, method: 'GET', url });
  },
  delete(url, config) {
    return dispatchFetchRequest({ ...config, method: 'DELETE', url });
  },
  head(url, config) {
    return dispatchFetchRequest({ ...config, method: 'HEAD', url });
  },
  options(url, config) {
    return dispatchFetchRequest({ ...config, method: 'OPTIONS', url });
  },
  post(url, config) {
    return dispatchFetchRequest({ ...config, method: 'POST', url });
  },
  put(url, config) {
    return dispatchFetchRequest({ ...config, method: 'PUT', url });
  },
  patch(url, config) {
    return dispatchFetchRequest({ ...config, method: 'PATCH', url });
  },
  upload(url, config) {
    return dispatchXhrRequest({ ...config, method: 'POST', url });
  },
} as ApiRequest);

export default request;
