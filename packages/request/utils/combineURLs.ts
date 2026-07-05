import { isNil } from '@omnific/utils';

/**
 * 使用单个斜杠边界拼接基础 URL 和相对 URL。
 */
const combineURLs = (baseURL: string, relativeURL?: string) => {
  if (isNil(relativeURL)) {
    return baseURL;
  }
  return baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};

export default combineURLs;
