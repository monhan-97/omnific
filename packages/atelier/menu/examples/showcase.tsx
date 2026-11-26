import { Search, SlidersHorizontal, X } from '@omnific/icons';

import { ListItemIcon, ListItemText } from '@omnific/atelier/list';

import { MenuItem } from '../MenuItem';

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 8,
};

const labelStyle = {
  color: 'var(--color-fg-muted)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
};

/**
 * 展示 MenuItem 的主要状态组合。
 */
export const MenuItemShowcaseExample = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(240px, 280px))',
      gap: 32,
    }}
  >
    <section style={sectionStyle}>
      <span style={labelStyle}>Default</span>
      <MenuItem>
        <ListItemText>首页</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>文档</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>设置</ListItemText>
      </MenuItem>
    </section>

    <section style={sectionStyle}>
      <span style={labelStyle}>Selected</span>
      <MenuItem selected>
        <ListItemText>首页</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>文档</ListItemText>
      </MenuItem>
      <MenuItem>
        <ListItemText>设置</ListItemText>
      </MenuItem>
    </section>

    <section style={sectionStyle}>
      <span style={labelStyle}>Icon</span>
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
    </section>

    <section style={sectionStyle}>
      <span style={labelStyle}>Size / Divider / Disabled</span>
      <MenuItem size='small'>
        <ListItemText>紧凑菜单项</ListItemText>
      </MenuItem>
      <MenuItem divider size='small'>
        <ListItemText>带分隔线</ListItemText>
      </MenuItem>
      <MenuItem disabled>
        <ListItemIcon>
          <X />
        </ListItemIcon>
        <ListItemText>禁用菜单项</ListItemText>
      </MenuItem>
    </section>
  </div>
);
