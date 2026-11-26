import { ListItemText } from '@omnific/atelier/list';

import type { MenuItemProps } from '../types';
import { MenuItem } from '../MenuItem';

/**
 * 展示 MenuItem 的基础用法。
 */
export const MenuItemBasicExample = (props: MenuItemProps) => {
  const { children = '首页', ...rest } = props;

  return (
    <div style={{ width: 280 }}>
      <MenuItem {...rest}>
        <ListItemText>{children}</ListItemText>
      </MenuItem>
    </div>
  );
};
