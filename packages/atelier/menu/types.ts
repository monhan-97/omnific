import type { ComponentPropsWithRef } from 'react';

import type { ComponentSize } from '../types';

/**
 * MenuItem 组件属性。
 */
export type MenuItemProps = Omit<ComponentPropsWithRef<'button'>, 'value'> & {
  /**
   * 菜单项的唯一值，在 MenuList 中用于选中。
   */
  value?: string;
  /**
   * 是否禁用菜单项。
   */
  disabled?: boolean;
  /**
   * 是否处于选中状态。
   *
   * 在 MenuList 中且提供 `value` 时，由 MenuList 的 `selectedKey` 覆盖。
   */
  selected?: boolean;
  /**
   * 菜单项尺寸。
   *
   * @default 'default'
   */
  size?: ComponentSize;
  /**
   * 是否在菜单项底部显示分隔线。
   */
  divider?: boolean;
  /**
   * typeahead 使用的文本标签；缺省时读取菜单项 DOM 文本。
   *
   * 传入 `null` 可让该项不参与 typeahead；禁用项始终使用 `null`。
   */
  label?: string | null;
};

/**
 * MenuList 组件属性。
 */
export type MenuListProps = Omit<ComponentPropsWithRef<'div'>, 'onSelect'> & {
  /**
   * 受控选中项；不传表示非受控模式。
   */
  selectedKey?: string;
  /**
   * 非受控模式的初始选中项；缺省表示无选中项。
   */
  defaultSelectedKey?: string;
  /**
   * 选中项变化时触发，返回新的选中 key。
   */
  onSelect?: (selectedKey: string) => void;
  /**
   * 菜单列表的统一尺寸，通过 CSS 变量继承给内部 MenuItem。
   *
   * MenuItem 自身的 `size` 覆盖该值；`default` 保留列表继承值。
   *
   * @default 'default'
   */
  size?: ComponentSize;
};
