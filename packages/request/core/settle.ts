import FetchError from './FetchError';

import type { Response } from '../types';

const validateStatus = (status: number) => {
  return status >= 200 && status < 300;
};

const settle = <TData = unknown, TRequest = unknown>(response: Response<TData, TRequest>) => {
  if (!response.status || validateStatus(response.status)) {
    return response;
  }

  const code = response.status >= 500 ? FetchError.ERR_BAD_RESPONSE : FetchError.ERR_BAD_REQUEST;

  throw new FetchError(
    `Request failed with status code ${response.status}`,
    code,
    undefined,
    response,
  );
};

export default settle;
