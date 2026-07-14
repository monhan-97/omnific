import { hasValue, isNil } from '@omnific/utils';

import CanceledError from './cancel/CanceledError';
import FetchError from './core/FetchError';
import settle from './core/settle';
import transformRequest from './core/transformRequest';
import type { RequestConfig, Response, ResponseType } from './types';
import parseHeader from './utils/parseHeaders';
import { progressEventReducer } from './utils/progressEventReducer';
import resolveConfig from './utils/resolveConfig';

/**
 * XMLHttpRequest 传输层返回的响应类型。
 */
export type XhrResponse<T = unknown> = Response<T, XMLHttpRequest>;

type SupportedXhrResponseType = Exclude<ResponseType, 'formdata'>;

/**
 * XMLHttpRequest 传输层接受的请求配置。
 */
export type XhrRequestConfig<D = unknown> = RequestConfig<D>;

const unSupportedResponseType = new Set<ResponseType>(['formdata']);

function validateResponseType(
  responseType: ResponseType,
  config: XhrRequestConfig,
): asserts responseType is SupportedXhrResponseType {
  if (unSupportedResponseType.has(responseType)) {
    throw new FetchError(
      `Response type '${responseType}' is not supported by XMLHttpRequest`,
      FetchError.ERR_NOT_SUPPORT,
      config,
    );
  }
}

/**
 * 通过 XMLHttpRequest 传输层发送请求。
 */
function xhr<T = unknown, R = XhrResponse<T>>(config: XhrRequestConfig): Promise<R> {
  return new Promise((resolve, reject) => {
    const { withCredentials, responseType = 'json', signal, onUploadProgress } = config;

    const { url, method, timeout } = resolveConfig(config);

    const { data, headers } = transformRequest(config);

    let onCanceled: ((event?: Event) => void) | undefined;

    const request = new XMLHttpRequest();

    request.open(method, url, true);

    request.timeout = timeout;

    function done() {
      signal?.removeEventListener('abort', onCanceled as EventListener);
    }

    function createResponse(): XhrResponse<T> {
      return {
        data: request.response,
        status: request.status,
        statusText: request.statusText,
        headers: parseHeader(request.getAllResponseHeaders()),
        request,
      };
    }

    function onloadend() {
      try {
        resolve(settle(createResponse(), config) as unknown as R);
      } catch (error) {
        reject(error);
      } finally {
        done();
      }
    }

    request.onloadend = onloadend;

    request.addEventListener('abort', () => {
      try {
        reject(new FetchError('Request aborted', FetchError.ECONNABORTED, config, createResponse()));
      } finally {
        done();
      }
    });

    request.addEventListener('error', () => {
      try {
        reject(new FetchError('Network Error', FetchError.ERR_NETWORK, config, createResponse()));
      } finally {
        done();
      }
    });

    request.addEventListener('timeout', () => {
      const timeoutErrorMessage = timeout
        ? `timeout of ${timeout} ms exceeded`
        : 'timeout exceeded';
      try {
        reject(new FetchError(timeoutErrorMessage, FetchError.ETIMEDOUT, config, createResponse()));
      } finally {
        done();
      }
    });

    isNil(data) && headers.delete('content-type');

    for (const [key, value] of headers.entries()) {
      request.setRequestHeader(key, value);
    }

    if (hasValue(withCredentials)) {
      request.withCredentials = withCredentials;
    }

    validateResponseType(responseType, config);
    request.responseType = responseType as XMLHttpRequestResponseType;

    if (onUploadProgress && request.upload) {
      const uploadThrottled = progressEventReducer(onUploadProgress);
      request.upload.addEventListener('progress', uploadThrottled);
      request.upload.addEventListener('loadend', uploadThrottled.flush);
    }

    if (signal) {
      onCanceled = cancel => {
        reject(isNil(cancel) || cancel.type ? new CanceledError(undefined, config) : cancel);
        request.abort();
      };

      signal.addEventListener('abort', onCanceled as EventListener);

      if (signal.aborted) {
        onCanceled();
        return;
      }
    }

    request.send((data ?? undefined) as XMLHttpRequestBodyInit);
  });
}

export default xhr;
