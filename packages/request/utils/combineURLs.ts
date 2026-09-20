import { isNil } from '@omnific/utils';

/**
 * 使用单个斜杠边界拼接基础 URL 和相对 URL。
 */
const combineURLs = (baseURL: string, relativeURL?: string) => {
  return isNil(relativeURL) ? baseURL : baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};

export default combineURLs;
