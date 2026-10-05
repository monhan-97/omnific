import { clsx } from 'clsx';

import { boxPrefixCls } from './constants';
import type { BoxProps } from './types';

import { extractProps } from '../utils/extractProps';
import { getPrefixCls } from '../utils/getPrefixCls';

const borderClassName = getPrefixCls('border');

/**
 * 通用样式容器，通过共享静态 class 应用间距、布局与外观。
 */
export const Box = (props: BoxProps) => {
  const { border = false, children, className, ref, scaling, style, ...rest } = extractProps(props);

  return (
    <div
      {...rest}
      className={clsx(boxPrefixCls, border && borderClassName, className)}
      data-scaling={scaling}
      ref={ref}
      style={style}
    >
      {children}
    </div>
  );
};
