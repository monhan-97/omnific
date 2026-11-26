import { ListItemText } from '@omnific/atelier/list';

import type { MenuItemProps } from '../types';
import { MenuItem } from '../MenuItem';

/**
 * 展示 MenuItem 的选中状态。
 */
export const MenuItemSelectedExample = (props: MenuItemProps) => {
  const { children = '首页', selected = true, ...rest } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 280 }}>
      <MenuItem {...rest} aria-current='page' selected={selected}>
        <ListItemText>{children}</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>文档</ListItemText>
      </MenuItem>
    </div>
  );
};
