import { isNil } from '@omnific/utils';

import combineURLs from '../utils/combineURLs';
import isAbsoluteURL from '../utils/isAbsoluteURL';

/**
 * 在请求 URL 不是绝对地址时合并基础 URL 和请求 URL。
 */
export default function buildFullPath(baseURL: string | undefined, requestedURL: string) {
  if (isNil(baseURL) || isAbsoluteURL(requestedURL)) {
    return requestedURL;
  }
  return combineURLs(baseURL, requestedURL);
}
