import { hasValue, parseJson } from '@omnific/utils';

import settle from './core/settle';
import FetchError from './core/FetchError';
import transformRequest from './core/transformRequest';
import type { RequestConfig, Response, ResponseType } from './types';
import composeSignals from './utils/composeSignals';
import resolveConfig from './utils/resolveConfig';

/**
 * fetch 传输层返回的响应类型。
 */
export type FetchResponse<T = unknown> = Response<T, Request>;

type SupportedResponseType = Exclude<ResponseType, 'document'>;

/**
 * fetch 传输层接受的请求配置。
 */
export type FetchRequestConfig<D = unknown> = RequestConfig<D>;

const unSupportedResponseType = new Set<ResponseType>(['document']);

function validateResponseType(
  responseType: ResponseType,
  config: FetchRequestConfig,
): asserts responseType is SupportedResponseType {
  if (unSupportedResponseType.has(responseType)) {
    throw new FetchError(
      `Response type '${responseType}' is not supported`,
      FetchError.ERR_NOT_SUPPORT,
      config,
    );
  }
}

const parseResponseData = async <T>(
  response: globalThis.Response,
  responseType: SupportedResponseType,
): Promise<T> => {
  switch (responseType) {
    case 'json': {
      const text = await response.text();
      return parseJson(text) as T;
    }
    case 'text': {
      return (await response.text()) as T;
    }
    case 'arraybuffer': {
      return (await response.arrayBuffer()) as T;
    }
    case 'blob': {
      return (await response.blob()) as T;
    }
    case 'formdata': {
      return (await response.formData()) as T;
    }
  }
};

const createFetchResponse = <T>(
  data: T | undefined,
  response: globalThis.Response,
  request: Request,
): FetchResponse<T> => ({
  data: data as T,
  status: response.status,
  statusText: response.statusText,
  headers: response.headers,
  request,
});

/**
 * 通过 Fetch API 传输层发送请求。
 */
async function fetch<T = unknown, R = FetchResponse<T>>(config: FetchRequestConfig) {
  const { responseType = 'json', signal, withCredentials } = config;

  validateResponseType(responseType, config);

  const { url, method, timeout } = resolveConfig(config);

  const { data, headers } = transformRequest(config);

  const composed = composeSignals(timeout, [signal], config);

  try {
    const requestInit: RequestInit = {
      method,
      body: data as BodyInit | null | undefined,
      headers,
      signal: composed?.signal,
      credentials: 'same-origin',
    };

    if (hasValue(withCredentials)) {
      requestInit.credentials = withCredentials ? 'include' : 'omit';
    }

    const request = new Request(url, requestInit);

    const response = await globalThis.fetch(request);

    let responseData: T | undefined;

    try {
      responseData = await parseResponseData<T>(response, responseType);
    } catch (error) {
      if (response.ok) {
        throw error;
      }
    }

    const fetchResponse = createFetchResponse(responseData, response, request);

    return settle(fetchResponse, config) as R;
  } finally {
    composed?.clean();
  }
}

export default fetch;
