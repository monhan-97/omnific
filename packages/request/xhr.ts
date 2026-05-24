import { hasValue, isNil } from '@omnific/utils';

import CanceledError from './cancel/CanceledError';
import FetchError from './core/FetchError';
import settle from './core/settle';
import transformRequest from './core/transformRequest';
import type { RequestConfig, Response } from './types';
import parseHeader from './utils/parseHeaders';
import { type UploadProgressEvent, progressEventReducer } from './utils/progressEventReducer';
import resolveConfig from './utils/resolveConfig';

export type XhrResponse<T = unknown> = Response<T, XMLHttpRequest>;

export type XhrRequestConfig<D = unknown> = RequestConfig<D> & {
  withCredentials?: boolean;
  responseType?: XMLHttpRequestResponseType;
  onUploadProgress?: (e: UploadProgressEvent) => void;
};

function xhr<T = unknown>(config: XhrRequestConfig): Promise<XhrResponse<T>> {
  return new Promise((resolve, reject) => {
    const { withCredentials, responseType = 'json', signal, onUploadProgress } = config;

    const { url, method, timeout } = resolveConfig(config);

    const { data, headers } = transformRequest(config);

    let onCanceled: ((e?: Event) => void) | undefined;

    let request = new XMLHttpRequest();

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
        resolve(settle(createResponse()));
      } catch (error) {
        reject(error);
      } finally {
        done();
      }
    }

    request.onloadend = onloadend;

    request.addEventListener('abort', () => {
      reject(new FetchError('Request aborted', FetchError.ECONNABORTED, config, createResponse()));
    });

    request.addEventListener('error', () => {
      reject(new FetchError('Network Error', FetchError.ERR_NETWORK, config, createResponse()));
    });

    request.addEventListener('timeout', () => {
      const timeoutErrorMessage = timeout
        ? `timeout of ${timeout} ms exceeded`
        : 'timeout exceeded';
      reject(new FetchError(timeoutErrorMessage, FetchError.ETIMEDOUT, config, createResponse()));
    });

    isNil(data) && headers.delete('content-type');

    for (const [key, value] of headers.entries()) {
      request.setRequestHeader(key, value);
    }

    if (hasValue(withCredentials)) {
      request.withCredentials = withCredentials;
    }

    if (responseType) {
      request.responseType = responseType;
    }

    if (onUploadProgress && request.upload) {
      const uploadThrottled = progressEventReducer(onUploadProgress);
      request.upload.addEventListener('progress', uploadThrottled);
      request.upload.addEventListener('loadend', uploadThrottled.flush);
    }

    if (signal) {
      onCanceled = cancel => {
        reject(!cancel || cancel.type ? new CanceledError(undefined, config) : cancel);
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
