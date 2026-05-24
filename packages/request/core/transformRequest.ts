import {
  isArrayBuffer,
  isBlob,
  isFormData,
  isPlainObject,
  isURLSearchParams,
} from '@omnific/utils';

import type { RequestConfig } from '../types';

const defaultHeaders = {
  accept: 'application/json, text/plain, */*',
};

const setHeaderValue = (headers: Headers, name: string, value: string) => {
  if (!headers.has(name)) {
    headers.set(name, value);
  }
};

const transformRequest = <T extends RequestConfig>(config: T) => {
  let { data } = config;

  const headers = new Headers(config.headers);
  if (!headers.has('accept')) {
    headers.set('accept', defaultHeaders.accept);
  }

  const contentType = headers.get('content-type');

  const hasJSONContentType = !!contentType && contentType.includes('application/json');

  if (isFormData(data) || isBlob(data) || isArrayBuffer(data)) {
    return { data, headers };
  }

  if (isURLSearchParams(data)) {
    setHeaderValue(headers, 'content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    data = data.toString();
  } else if (isPlainObject(data) || hasJSONContentType) {
    setHeaderValue(headers, 'content-type', 'application/json');
    data = JSON.stringify(data);
  }

  return { data, headers };
};

export default transformRequest;
