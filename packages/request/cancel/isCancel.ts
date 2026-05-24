import { isObject } from '@omnific/utils';

import type CanceledError from './CanceledError';

const isCancel = (value: unknown): value is CanceledError => {
  return !!(value && isObject(value) && (value as { __CANCEL__?: boolean }).__CANCEL__);
};

export default isCancel;
