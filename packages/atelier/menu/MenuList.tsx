import { clsx } from 'clsx';
import { useRef } from 'react';
import { useForkRef } from '@omnific/hooks';

import { menuListPrefixCls } from './constants';
import type { MenuListProps } from './types';

import { ListCollection } from '../navigation/ListCollection';
import { ListState } from '../navigation/ListState';
import { useInteractions } from '../navigation/useInteractions';
import { useListCollection } from '../navigation/useListCollection';
import { useListNavigation } from '../navigation/useListNavigation';
import { useListState } from '../navigation/useListState';
import { useTypeahead } from '../navigation/useTypeahead';

/**
 * 菜单列表容器，组合 item 注册、active 状态、选中状态和键盘导航。
 */
export const MenuList = (props: MenuListProps) => {
  const {
    'aria-orientation': ariaOrientation = 'vertical',
    children,
    className,
    defaultSelectedKey,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    onSelect,
    ref,
    role = 'menu',
    selectedKey,
    size = 'default',
    tabIndex = -1,
    ...rest
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleRef = useForkRef(containerRef, ref);

  const collection = useListCollection();

  const state = useListState({
    defaultSelectedKey,
    onSelect,
    selectedKey,
  });

  const navigation = useListNavigation({
    getActiveIndex: state.getActiveIndex,
    getElement: collection.getElement,
    getSize: collection.getSize,
    loop: true,
    onNavigate: state.setActiveIndex,
    orientation: ariaOrientation,
  });

  const typeahead = useTypeahead({
    getActiveIndex: state.getActiveIndex,
    getLabels: collection.getLabels,
    onMatch: index => {
      state.setActiveIndex(index);
      navigation.focusIndex(index);
    },
  });

  const interactions = useInteractions([navigation, typeahead]);

  return (
    <ListCollection store={collection}>
      <ListState store={state}>
        <div
          {...rest}
          {...interactions.getFloatingProps({ onClick, onFocus, onKeyDown, onKeyUp })}
          aria-orientation={ariaOrientation}
          className={clsx(menuListPrefixCls, className)}
          data-size={size}
          ref={handleRef}
          role={role}
          tabIndex={tabIndex}
        >
          {children}
        </div>
      </ListState>
    </ListCollection>
  );
};
