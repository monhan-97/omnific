import { hasValue } from './hasValue';
import { isNil } from './isNil';
import { isString } from './isString';
import { isStringEmpty } from './isStringEmpty';
import { isURLSearchParameters } from './isURLSearchParameters';

/**
 * 查询参数序列化时接受的基础值类型。
 */
export type QueryValue = string | number | boolean | null | undefined;

/**
 * 查询参数映射。
 */
export type QueryParameters = Record<string, QueryValue | readonly QueryValue[]>;

/**
 * buildURL 接受的查询参数。
 */
export type QueryInput = QueryParameters | URLSearchParams | string;

function serializeParameters(parameters: QueryInput): string {
  if (isString(parameters)) {
    return new URLSearchParams(parameters).toString();
  }

  if (isURLSearchParameters(parameters)) {
    return parameters.toString();
  }

  const searchParameters = new URLSearchParams();
  const keys = Object.keys(parameters);

  // 使用索引循环方便保持查询参数的原始顺序。
  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index]!;
    const value = parameters[key];

    if (isNil(value)) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (hasValue(item)) {
          searchParameters.append(key, String(item));
        }
      }
      continue;
    }

    searchParameters.append(key, String(value));
  }

  return searchParameters.toString();
}

/**
 * 将查询参数追加到 URL。
 *
 * - 支持对象、URLSearchParams 和原始查询字符串。
 * - 对象中的 null/undefined 会被跳过，数组会展开为重复参数。
 * - 保留已有查询参数，并按现有 request 行为移除 hash。
 */
export function buildURL(url: string, parameters?: QueryInput): string {
  if (isNil(parameters)) {
    return url;
  }

  const serializedParameters = serializeParameters(parameters);

  if (isStringEmpty(serializedParameters)) {
    return url;
  }

  const hashMarkIndex = url.indexOf('#');
  const nextURL = hashMarkIndex === -1 ? url : url.slice(0, hashMarkIndex);
  const separator = nextURL.includes('?') ? '&' : '?';

  return `${nextURL}${separator}${serializedParameters}`;
}
