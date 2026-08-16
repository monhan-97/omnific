import { hasValue, isNil } from '@omnific/utils';
import { clsx } from 'clsx';
import type { ElementType, MouseEvent } from 'react';

import { buttonPrefixCls } from './constants';
import LoadingIcon from './LoadingIcon';
import type { ButtonProps } from './types';

/** 支持自定义渲染目标的通用按钮。 */
export const Button = <Component extends ElementType = 'button'>(props: ButtonProps<Component>) => {
  const {
    block = false,
    children,
    className,
    component: RootComponent = 'button',
    disabled,
    htmlType = 'button',
    icon,
    loading = false,
    onClick,
    ref,
    shape = 'default',
    size = 'default',
    status,
    type = 'default',
    ...rest
  } = props;

  const buttonType = type === 'default' ? 'secondary' : type;

  const hasChildren = hasValue(children);

  const isIconOnly = isNil(children) && (hasValue(icon) || loading);

  const classes = clsx(
    buttonPrefixCls,
    `${buttonPrefixCls}-${buttonType}`,
    `${buttonPrefixCls}-size-${size}`,
    {
      [`${buttonPrefixCls}-shape-${shape}`]: shape !== 'default',
      [`${buttonPrefixCls}-status-${status}`]: hasValue(status),
      [`${buttonPrefixCls}-icon-only`]: isIconOnly,
      [`${buttonPrefixCls}-block`]: block,
      [`${buttonPrefixCls}-loading`]: loading,
    },
    className,
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const iconNode =
    loading || isNil(icon) ? <LoadingIcon iconOnly={isIconOnly} loading={loading} /> : icon;

  return (
    <RootComponent
      {...rest}
      aria-busy={loading || undefined}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      ref={ref}
      type={htmlType}
    >
      {iconNode}
      {hasChildren && <span>{children}</span>}
    </RootComponent>
  );
};
