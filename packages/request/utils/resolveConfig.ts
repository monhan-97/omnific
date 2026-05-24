import { isNil } from '@omnific/utils';

import buildURL from './buildURL';

import FetchError from '../core/FetchError';
import buildFullPath from '../core/buildFullPath';
import type { RequestConfig } from '../types';

const resolveConfig = (config: RequestConfig) => {
  if (isNil(config.url)) {
    throw new FetchError(
      `URL is required but got ${typeof config.url}`,
      FetchError.ERR_BAD_REQUEST,
      config,
    );
  }

  const method = config.method || 'GET';

  return {
    method,
    timeout: config.timeout || 0,
    url: buildURL(buildFullPath(config.baseURL, config.url), config.params),
  };
};

export default resolveConfig;
