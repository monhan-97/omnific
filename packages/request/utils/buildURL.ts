import { hasValue, isNil } from '@omnific/utils';

import type { QueryParams } from '../types';

const appendParam = (
  searchParams: URLSearchParams,
  key: string,
  value: string | number | boolean,
) => {
  searchParams.append(key, String(value));
};

const serializeParams = (params: QueryParams | URLSearchParams) => {
  if (params instanceof URLSearchParams) {
    return params.toString();
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (isNil(value)) {
      continue;
    }

    if (!Array.isArray(value)) {
      appendParam(searchParams, key, value);
      continue;
    }

    for (const item of value) {
      if (hasValue(item)) {
        appendParam(searchParams, key, item);
      }
    }
  }

  return searchParams.toString();
};

const buildURL = (url: string, params?: QueryParams | URLSearchParams) => {
  if (isNil(params)) {
    return url;
  }

  const serializedParams = serializeParams(params);

  if (!serializedParams) {
    return url;
  }

  const hashMarkIndex = url.indexOf('#');

  const nextURL = hashMarkIndex === -1 ? url : url.slice(0, hashMarkIndex);

  return nextURL + (nextURL.includes('?') ? '&' : '?') + serializedParams;
};

export default buildURL;
