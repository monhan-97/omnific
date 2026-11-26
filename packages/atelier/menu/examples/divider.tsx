import { ListItemText } from '@omnific/atelier/list';

import { MenuItem } from '../MenuItem';

/**
 * 展示 MenuItem 的分隔线。
 */
export const MenuItemDividerExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', width: 280 }}>
    <MenuItem>
      <ListItemText>首页</ListItemText>
    </MenuItem>
    <MenuItem divider>
      <ListItemText>文档</ListItemText>
    </MenuItem>
    <MenuItem>
      <ListItemText>设置</ListItemText>
    </MenuItem>
  </div>
);
