import { hasValue, isNil } from '@omnific/utils';

import type { QueryParameters } from '../types';

const appendParameter = (
  searchParameters: URLSearchParams,
  key: string,
  value: string | number | boolean,
) => {
  searchParameters.append(key, String(value));
};

const serializeParameters = (parameters: QueryParameters | URLSearchParams) => {
  if (parameters instanceof URLSearchParams) {
    return parameters.toString();
  }

  const searchParameters = new URLSearchParams();

  for (const [key, value] of Object.entries(parameters)) {
    if (isNil(value)) {
      continue;
    }

    if (!Array.isArray(value)) {
      appendParameter(searchParameters, key, value);
      continue;
    }

    for (const item of value) {
      if (hasValue(item)) {
        appendParameter(searchParameters, key, item);
      }
    }
  }

  return searchParameters.toString();
};

/**
 * 将序列化后的查询参数追加到 URL，并保留 hash 处理。
 */
const buildURL = (url: string, parameters?: QueryParameters | URLSearchParams) => {
  if (isNil(parameters)) {
    return url;
  }

  const serializedParameters = serializeParameters(parameters);

  if (!serializedParameters) {
    return url;
  }

  const hashMarkIndex = url.indexOf('#');

  const nextURL = hashMarkIndex === -1 ? url : url.slice(0, hashMarkIndex);

  return nextURL + (nextURL.includes('?') ? '&' : '?') + serializedParameters;
};

export default buildURL;
