import { clsx } from 'clsx';
import type { ComponentPropsWithRef } from 'react';

import { listItemIconPrefixCls } from './constants';

/**
 * 列表项左侧图标容器。
 */
export const ListItemIcon = (props: ComponentPropsWithRef<'span'>) => {
  const { className, ...rest } = props;

  return <span {...rest} className={clsx(listItemIconPrefixCls, className)} />;
};
