import { isNil } from '@omnific/utils';

import combineURLs from '../utils/combineURLs';
import isAbsoluteURL from '../utils/isAbsoluteURL';

/**
 * 在请求 URL 不是绝对地址时合并基础 URL 和请求 URL。
 */
export default function buildFullPath(baseURL: string | undefined, requestedURL: string) {
  return isNil(baseURL) || isAbsoluteURL(requestedURL) ? requestedURL : combineURLs(baseURL, requestedURL);
}
