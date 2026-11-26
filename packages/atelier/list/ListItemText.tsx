import { clsx } from 'clsx';
import type { ComponentPropsWithRef } from 'react';

import { listItemTextPrefixCls } from './constants';

/**
 * 列表项主内容容器。
 */
export const ListItemText = (props: ComponentPropsWithRef<'span'>) => {
  const { className, ...rest } = props;

  return <span {...rest} className={clsx(listItemTextPrefixCls, className)} />;
};
