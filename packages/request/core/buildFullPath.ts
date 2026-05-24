import { isNil } from '@omnific/utils';

import combineURLs from '../utils/combineURLs';
import isAbsoluteURL from '../utils/isAbsoluteURL';

export default function buildFullPath(baseURL: string | undefined, requestedURL: string) {
  if (isNil(baseURL) || isAbsoluteURL(requestedURL)) {
    return requestedURL;
  }
  return combineURLs(baseURL, requestedURL);
}
