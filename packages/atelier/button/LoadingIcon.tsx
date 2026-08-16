import { LoadingIcon as SpinnerIcon } from '@omnific/icons';
import { clsx } from 'clsx';
import type { FC } from 'react';

import { buttonPrefixCls } from './constants';
import type { LoadingIconProps } from './types';

import { EXITED, useTransitionStatus } from '../transition';
import type { Variants } from '../transition';

const variants: Variants<{ iconOnly: boolean }> = {
  enter: custom => ({
    opacity: 1,
    scale: 1,
    width: '1em',
    marginRight: custom?.iconOnly ? 0 : 8,
  }),
  exit: {
    opacity: 0,
    scale: 0,
    width: 0,
    marginRight: 0,
  },
};

/** 渲染按钮内部的加载图标。 */
const LoadingIcon: FC<LoadingIconProps> = props => {
  const { className, iconOnly = false, loading = false, style } = props;

  const { handleRef, isMounted, status } = useTransitionStatus({
    custom: { iconOnly },
    enter: variants.enter,
    exit: variants.exit,
    in: loading,
    unmountOnExit: true,
  });

  if (!isMounted) return;

  return (
    <span
      aria-hidden='true'
      className={clsx(`${buttonPrefixCls}-loading-icon`, className)}
      ref={handleRef}
      style={{
        opacity: 0,
        visibility: status === EXITED ? 'hidden' : undefined,
        width: 0,
        ...style,
      }}
    >
      <SpinnerIcon size='1em' />
    </span>
  );
};

export default LoadingIcon;
