import { hasValue, isNil } from '@omnific/utils';
import { clsx } from 'clsx';
import type { MouseEvent } from 'react';

import { buttonPrefixCls } from './constants';
import LoadingIcon from './LoadingIcon';
import type { ButtonProps } from './types';

/**
 * 通用按钮。
 */
export const Button = (props: ButtonProps) => {
  const {
    block = false,
    children,
    className,
    disabled,
    icon,
    loading = false,
    onClick,
    ref,
    shape = 'default',
    size = 'default',
    type = 'button',
    variant = 'secondary',
    ...rest
  } = props;

  const hasChildren = hasValue(children);

  const isIconOnly = isNil(children) && (hasValue(icon) || loading);

  const classes = clsx(
    buttonPrefixCls,
    `${buttonPrefixCls}-${variant}`,
    `${buttonPrefixCls}-size-${size}`,
    {
      [`${buttonPrefixCls}-shape-${shape}`]: shape !== 'default',
      [`${buttonPrefixCls}-icon-only`]: isIconOnly,
      [`${buttonPrefixCls}-block`]: block,
      [`${buttonPrefixCls}-loading`]: loading,
    },
    className,
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const iconNode =
    loading || isNil(icon) ? <LoadingIcon iconOnly={isIconOnly} loading={loading} /> : icon;

  return (
    <button
      {...rest}
      aria-busy={loading || undefined}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      type={type}
    >
      {iconNode}
      {hasChildren && <span>{children}</span>}
    </button>
  );
};
