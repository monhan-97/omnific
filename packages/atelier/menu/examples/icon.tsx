import { Search, SlidersHorizontal } from '@omnific/icons';

import { ListItemIcon, ListItemText } from '@omnific/atelier/list';

import { MenuItem } from '../MenuItem';

/**
 * 展示带图标的 MenuItem。
 */
export const MenuItemIconExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', width: 280 }}>
    <MenuItem>
      <ListItemIcon>
        <Search />
      </ListItemIcon>
      <ListItemText>搜索</ListItemText>
    </MenuItem>
    <MenuItem selected>
      <ListItemIcon>
        <SlidersHorizontal />
      </ListItemIcon>
      <ListItemText>筛选</ListItemText>
    </MenuItem>
  </div>
);
