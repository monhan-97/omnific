import { ListItemText } from '@omnific/atelier/list';

import type { MenuItemProps } from '../types';
import { MenuItem } from '../MenuItem';

/**
 * 展示 MenuItem 的禁用状态。
 */
export const MenuItemDisabledExample = (props: MenuItemProps) => {
  const { children = '不可用菜单项', disabled = true, ...rest } = props;

  return (
    <div style={{ width: 280 }}>
      <MenuItem {...rest} disabled={disabled}>
        <ListItemText>{children}</ListItemText>
      </MenuItem>
    </div>
  );
};
