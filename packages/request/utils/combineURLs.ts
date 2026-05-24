import { isNil } from '@omnific/utils';

const combineURLs = (baseURL: string, relativeURL?: string) => {
  if (isNil(relativeURL)) {
    return baseURL;
  }
  return baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};

export default combineURLs;
