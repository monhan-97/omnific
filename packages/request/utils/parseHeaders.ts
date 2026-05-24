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

const parseHeader = (rawHeaders: string) => {
  const headers = new Headers();

  for (const line of rawHeaders.split('\n')) {
    const index = line.indexOf(':');
    const key = line.slice(0, Math.max(0, index)).trim().toLowerCase();
    const value = line.slice(Math.max(0, index + 1)).trim();

    if (!key || (headers.has(key) && ignoreDuplicateSet.has(key))) {
      continue;
    }

    const previous = headers.get(key);
    if (!previous || !previous.includes(value)) {
      headers.append(key, value);
    }
  }

  return headers;
};

export default parseHeader;
