import { Search, SlidersHorizontal, X } from '@omnific/icons';

import { ListItemIcon, ListItemText } from '@omnific/atelier/list';
import { antdDarkSystem, antdLightSystem, useTheme } from '@omnific/atelier/system';
import type { SystemContext } from '@omnific/atelier/system';

import { MenuItem } from '../MenuItem';
import type { ComponentSize } from '../../types';

type ThemePanelProps = {
  /**
   * 面板背景色。
   */
  background: string;
  /**
   * 面板边框色。
   */
  borderColor: string;
  /**
   * 面板标题色。
   */
  labelColor: string;
  /**
   * 面板标题。
   */
  label: string;
  /**
   * MenuItem 尺寸。
   */
  size?: ComponentSize;
  /**
   * 面板使用的主题 system。
   */
  system: SystemContext;
};

const ThemePanel = (props: ThemePanelProps) => {
  const { background, borderColor, label, labelColor, size, system } = props;
  const themeRef = useTheme<HTMLDivElement>(system);

  return (
    <div
      ref={themeRef}
      style={{
        width: 280,
        padding: 16,
        color: 'var(--color-fg)',
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          marginBottom: 12,
          color: labelColor,
          fontSize: 12,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <MenuItem selected size={size}>
        <ListItemIcon>
          <Search />
        </ListItemIcon>
        <ListItemText>搜索</ListItemText>
      </MenuItem>
      <MenuItem size={size}>
        <ListItemIcon>
          <SlidersHorizontal />
        </ListItemIcon>
        <ListItemText>筛选</ListItemText>
      </MenuItem>
      <MenuItem disabled size={size}>
        <ListItemIcon>
          <X />
        </ListItemIcon>
        <ListItemText>禁用菜单项</ListItemText>
      </MenuItem>
    </div>
  );
};

/**
 * 展示 Ant Design light 与 dark system 作用到同一个 MenuItem 的效果。
 */
export const MenuItemThemeExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
    <ThemePanel
      background='var(--color-bg)'
      borderColor='#d9d9d9'
      label='Ant Design Light'
      labelColor='rgba(0, 0, 0, 0.65)'
      system={antdLightSystem}
    />
    <ThemePanel
      background='var(--color-bg)'
      borderColor='#1f3a52'
      label='Ant Design Dark'
      labelColor='rgba(255, 255, 255, 0.65)'
      system={antdDarkSystem}
    />
    <ThemePanel
      background='var(--color-bg)'
      borderColor='#d9d9d9'
      label='Size Small'
      labelColor='rgba(0, 0, 0, 0.65)'
      size='small'
      system={antdLightSystem}
    />
  </div>
);
