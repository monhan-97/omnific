import { isStringEmpty } from '@omnific/utils';

const ignoreDuplicateSet = new Set([
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent',
]);

/**
 * 将原始 XMLHttpRequest 响应头解析为 Headers 对象。
 */
const parseHeader = (rawHeaders: string) => {
  const headers = new Headers();

  for (const line of rawHeaders.split('\n')) {
    const index = line.indexOf(':');
    const key = line.slice(0, Math.max(0, index)).trim().toLowerCase();
    const value = line.slice(Math.max(0, index + 1)).trim();

    if (isStringEmpty(key) || (headers.has(key) && ignoreDuplicateSet.has(key))) {
      continue;
    }

    const previous = headers.get(key);
    if (previous?.includes(value)) continue;
    headers.append(key, value);
  }

  return headers;
};

export default parseHeader;
