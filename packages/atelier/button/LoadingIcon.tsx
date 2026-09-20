import { LoadingIcon as SpinnerIcon } from '@omnific/icons';
import { clsx } from 'clsx';
import type { FC } from 'react';

import { buttonPrefixCls } from './constants';
import type { LoadingIconProps } from './types';

import { EXITED, useTransitionStatus } from '../transition';

/**
 * 渲染按钮内部的加载图标。
 */
const LoadingIcon: FC<LoadingIconProps> = props => {
  const { className, iconOnly = false, loading = false, style } = props;

  const { handleRef, isMounted, status } = useTransitionStatus({
    appear: true,
    enter: {
      opacity: 1,
      scale: 1,
      width: 'auto',
      marginRight: iconOnly ? 0 : 8,
    },
    exit: {
      opacity: 0,
      scale: 0,
      width: 0,
      marginRight: 0,
    },
    in: loading,
    unmountOnExit: true,
  });

  if (!isMounted) return null;

  return (
    <span
      aria-hidden='true'
      className={clsx(`${buttonPrefixCls}-loading-icon`, className)}
      ref={handleRef}
      style={{
        visibility: status === EXITED && !loading ? 'hidden' : undefined,
        opacity: 0,
        width: 0,
        ...style,
      }}
    >
      <SpinnerIcon size='1em' />
    </span>
  );
};

export default LoadingIcon;
