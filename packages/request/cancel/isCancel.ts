import { isObject } from '@omnific/utils';

import type CanceledError from './CanceledError';

/**
 * 检查值是否为请求取消错误。
 */
const isCancel = (value: unknown): value is CanceledError => {
  return !!(value && isObject(value) && (value as { __CANCEL__?: boolean }).__CANCEL__);
};

export default isCancel;
