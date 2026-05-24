import { parseJson } from '@omnific/utils';
import type { Override } from '@omnific/types';

import settle from './core/settle';
import FetchError from './core/FetchError';
import transformRequest from './core/transformRequest';
import type { RequestConfig, Response } from './types';
import composeSignals from './utils/composeSignals';
import resolveConfig from './utils/resolveConfig';

export type FetchResponseType = 'text' | 'arrayBuffer' | 'blob' | 'formData' | 'json';

export type FetchResponse<T = unknown> = Response<T, Request>;

export type FetchRequestConfig<D = unknown> = Override<
  RequestInit,
  RequestConfig<D> & {
    responseType?: FetchResponseType;
  }
>;

const parseResponseData = async <T>(
  response: globalThis.Response,
  responseType: FetchResponseType,
  config: FetchRequestConfig,
): Promise<T> => {
  switch (responseType) {
    case 'json': {
      const text = await response.text();
      return parseJson(text) as T;
    }
    case 'text': {
      return (await response.text()) as T;
    }
    case 'arrayBuffer': {
      return (await response.arrayBuffer()) as T;
    }
    case 'blob': {
      return (await response.blob()) as T;
    }
    case 'formData': {
      return (await response.formData()) as T;
    }
    default: {
      throw new FetchError(
        `Response type '${responseType}' is not supported`,
        FetchError.ERR_NOT_SUPPORT,
        config,
      );
    }
  }
};

async function fetch<T = unknown>(config: FetchRequestConfig): Promise<FetchResponse<T>> {
  const { responseType = 'json', signal } = config;

  const { url, method, timeout } = resolveConfig(config);

  const { data, headers } = transformRequest(config);

  const composed = composeSignals(timeout, [signal]);

  try {
    const request = new Request(url, {
      method,
      body: data as BodyInit | null | undefined,
      window: config.window,
      headers,
      credentials: config.credentials,
      redirect: config.redirect,
      referrer: config.referrer,
      referrerPolicy: config.referrerPolicy,
      integrity: config.integrity,
      signal: composed?.signal,
      mode: config.mode,
      cache: config.cache,
      keepalive: config.keepalive,
      priority: config.priority,
    });

    const response = await globalThis.fetch(request);

    const fetchData = await parseResponseData<T>(response, responseType, config);

    return settle({
      data: fetchData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      request,
    });
  } finally {
    composed?.clean();
  }
}

export default fetch;
