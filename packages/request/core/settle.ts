import FetchError from './FetchError';

import type { RequestConfig, Response } from '../types';

const isStatusValid = (status: number) => {
  return status >= 200 && status < 300;
};

/**
 * 返回成功响应，或在状态码失败时抛出 FetchError。
 */
const settle = <TData = unknown, TRequest = unknown>(
  response: Response<TData, TRequest>,
  config?: RequestConfig,
) => {
  if (isStatusValid(response.status)) {
    return response;
  }

  const code = response.status >= 500 ? FetchError.ERR_BAD_RESPONSE : FetchError.ERR_BAD_REQUEST;

  throw new FetchError(
    `Request failed with status code ${response.status}`,
    code,
    config,
    response,
  );
};

export default settle;
