import {
  isArrayBuffer,
  isBlob,
  isFormData,
  isPlainObject,
  isURLSearchParameters,
} from '@omnific/utils';

import type { RequestConfig } from '../types';

const defaultHeaders = {
  accept: 'application/json, text/plain, */*',
};

const setHeaderValue = (headers: Headers, name: string, value: string) => {
  if (headers.has(name)) return;
  headers.set(name, value);
};

/**
 * 在传输分发前标准化请求体数据和请求头。
 */
const transformRequest = <T extends RequestConfig>(config: T) => {
  let { data } = config;

  const headers = new Headers(config.headers);
  setHeaderValue(headers, 'accept', defaultHeaders.accept);

  const contentType = headers.get('content-type');

  const hasJSONContentType = contentType ? contentType.includes('application/json') : false;

  if (isFormData(data) || isBlob(data) || isArrayBuffer(data)) {
    return { data, headers };
  }

  if (isURLSearchParameters(data)) {
    setHeaderValue(headers, 'content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    data = data.toString();
  } else if (hasJSONContentType || isPlainObject(data)) {
    setHeaderValue(headers, 'content-type', 'application/json');
    data = JSON.stringify(data);
  }

  return { data, headers };
};

export default transformRequest;
