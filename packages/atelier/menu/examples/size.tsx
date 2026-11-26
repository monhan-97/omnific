import { ListItemText } from '@omnific/atelier/list';

import { MenuItem } from '../MenuItem';

/**
 * 展示 MenuItem 的 small、default 与 large 尺寸。
 */
export const MenuItemSizeExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', width: 280 }}>
    <MenuItem size='small'>
      <ListItemText>小尺寸菜单项</ListItemText>
    </MenuItem>
    <MenuItem size='small' selected>
      <ListItemText>小尺寸选中项</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemText>默认尺寸菜单项</ListItemText>
    </MenuItem>
    <MenuItem selected>
      <ListItemText>默认尺寸选中项</ListItemText>
    </MenuItem>
    <MenuItem size='large'>
      <ListItemText>大尺寸菜单项</ListItemText>
    </MenuItem>
  </div>
);
