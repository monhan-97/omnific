import { clsx } from 'clsx';
import { useForkRef } from '@omnific/hooks';
import { hasValue } from '@omnific/utils';

import { menuItemPrefixCls } from './constants';
import type { MenuItemProps } from './types';

import { useListStateContext } from '../navigation/ListState';
import { useListItem } from '../navigation/useListItem';
import { useActiveIndex, useSelectedKey } from '../navigation/useListState';

/**
 * 纵向菜单中的单个菜单项。
 */
export const MenuItem = (props: MenuItemProps) => {
  const {
    'aria-checked': ariaChecked,
    'aria-current': ariaCurrent,
    'aria-disabled': ariaDisabled,
    children,
    className,
    disabled = false,
    divider = false,
    value,
    label,
    onClick,
    onFocus,
    ref,
    role = 'menuitem',
    selected = false,
    size = 'default',
    tabIndex,
    type = 'button',
    ...rest
  } = props;

  const state = useListStateContext();

  const activeIndex = useActiveIndex(state);

  const selectedKey = useSelectedKey(state);

  const { index, ref: listItemRef } = useListItem<HTMLButtonElement>({
    label: disabled ? null : label,
  });

  const handleRef = useForkRef(listItemRef, ref);

  const isInList = index >= 0 && hasValue(state);

  let isSelected = selected;
  if (hasValue(state) && hasValue(value)) {
    isSelected = Object.is(selectedKey, value);
  }

  const itemProps =
    hasValue(state) && index >= 0
      ? state.getItemProps(index, { value, onClick, onFocus })
      : { onClick, onFocus };

  const isCheckableRole = role === 'menuitemradio' || role === 'menuitemcheckbox';

  let resolvedTabIndex = tabIndex;
  if (isInList) {
    resolvedTabIndex = index === activeIndex ? 0 : -1;
  }

  const classes = clsx(
    menuItemPrefixCls,
    `${menuItemPrefixCls}-size-${size}`,
    {
      [`${menuItemPrefixCls}-disabled`]: disabled,
      [`${menuItemPrefixCls}-divider`]: divider,
      [`${menuItemPrefixCls}-selected`]: isSelected,
    },
    className,
  );

  return (
    <button
      {...rest}
      aria-checked={isCheckableRole ? isSelected : ariaChecked}
      aria-current={ariaCurrent}
      aria-disabled={disabled ? true : ariaDisabled}
      className={classes}
      data-size={size}
      data-divider={divider || undefined}
      data-selected={isSelected || undefined}
      disabled={disabled}
      {...itemProps}
      ref={handleRef}
      role={role}
      tabIndex={disabled ? undefined : resolvedTabIndex}
      type={type}
    >
      {children}
    </button>
  );
};
