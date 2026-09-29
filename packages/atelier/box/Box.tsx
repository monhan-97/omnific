import { clsx } from 'clsx';

import { boxPrefixCls } from './constants';
import type { BoxProps } from './types';

import { styleFromTokens } from '../system/css-vars';

/**
 * 通用样式容器，通过 token 直接写入 CSS 属性应用 padding / 背景 / 圆角 / 边框色 / 阴影。
 */
export const Box = (props: BoxProps) => {
  const {
    bg,
    border = false,
    borderColor,
    children,
    className,
    p,
    px,
    py,
    ref,
    rounded,
    shadow,
    style,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      className={clsx(boxPrefixCls, border && `${boxPrefixCls}-border`, className)}
      ref={ref}
      style={styleFromTokens(
        [
          ['padding', p],
          ['paddingInline', px],
          ['paddingBlock', py],
          ['background', bg],
          ['borderColor', borderColor],
          ['borderRadius', rounded],
          ['boxShadow', shadow],
        ],
        style,
      )}
    >
      {children}
    </div>
  );
};
