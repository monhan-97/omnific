import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { hasValue } from '@omnific/utils';

import { ListItemText } from '@omnific/atelier/list';

import { MenuItem } from '../MenuItem';
import { MenuList } from '../MenuList';
import type { ComponentSize } from '../../types';

const panelStyle: CSSProperties = {
  width: 280,
  padding: 12,
  background: 'var(--color-bg-panel)',
  border: '1px solid var(--color-border-muted)',
  borderRadius: 12,
};

const focusButtonStyle: CSSProperties = {
  width: '100%',
  marginBottom: 12,
  padding: '8px 12px',
  color: 'var(--color-fg)',
  font: 'inherit',
  background: 'var(--color-bg-subtle)',
  border: '1px solid var(--color-border-muted)',
  borderRadius: 8,
  cursor: 'pointer',
};

const hintStyle: CSSProperties = {
  margin: '12px 0 0',
  color: 'var(--color-fg-muted)',
  fontSize: 12,
  lineHeight: 1.5,
};

type FocusMenuButtonProps = {
  /**
   * 点击后聚焦菜单容器。
   */
  onClick: () => void;
};

type MenuPanelProps = {
  /**
   * 面板内容。
   */
  children: ReactNode;
  /**
   * 面板底部的操作提示。
   */
  footer?: ReactNode;
};

const FocusMenuButton = (props: FocusMenuButtonProps) => (
  <button style={focusButtonStyle} type='button' onClick={props.onClick}>
    聚焦菜单
  </button>
);

const MenuPanel = (props: MenuPanelProps) => (
  <div style={panelStyle}>
    {props.children}
    {hasValue(props.footer) ? <p style={hintStyle}>{props.footer}</p> : null}
  </div>
);

/**
 * 展示 MenuList 的受控单选状态。
 */
export const MenuListSelectedExample = () => {
  const [selectedKey, setSelectedKey] = useState('docs');

  return (
    <MenuPanel footer='点击菜单项切换受控选中的 value。'>
      <MenuList selectedKey={selectedKey} onSelect={setSelectedKey}>
        <MenuItem value='home' role='menuitemradio'>
          <ListItemText>首页</ListItemText>
        </MenuItem>
        <MenuItem value='docs' role='menuitemradio'>
          <ListItemText>文档</ListItemText>
        </MenuItem>
        <MenuItem value='settings' role='menuitemradio'>
          <ListItemText>设置</ListItemText>
        </MenuItem>
      </MenuList>
    </MenuPanel>
  );
};

/**
 * 展示 MenuList 跳过禁用菜单项的行为。
 */
export const MenuListDisabledExample = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <MenuPanel footer='聚焦菜单后使用方向键，会跳过禁用项；禁用项不能选中。'>
      <FocusMenuButton onClick={() => menuRef.current?.focus()} />
      <MenuList defaultSelectedKey='home' ref={menuRef}>
        <MenuItem value='home' role='menuitemradio'>
          <ListItemText>首页</ListItemText>
        </MenuItem>
        <MenuItem disabled value='billing' role='menuitemradio'>
          <ListItemText>计费（无权限）</ListItemText>
        </MenuItem>
        <MenuItem value='settings' role='menuitemradio'>
          <ListItemText>设置</ListItemText>
        </MenuItem>
      </MenuList>
    </MenuPanel>
  );
};

/**
 * 展示 MenuList 的方向键、Home 和 End 导航。
 */
export const MenuListKeyboardExample = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <MenuPanel footer='方向键 ↑ / ↓ 移动焦点，Home / End 跳到首尾。'>
      <FocusMenuButton onClick={() => menuRef.current?.focus()} />
      <MenuList ref={menuRef}>
        <MenuItem>
          <ListItemText>首页</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>文档</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>组件</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>设置</ListItemText>
        </MenuItem>
      </MenuList>
    </MenuPanel>
  );
};

/**
 * 展示 MenuList 的字符搜索与连续首字母循环。
 */
export const MenuListTypeaheadExample = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <MenuPanel footer='输入 a、b、c 或 g 快速定位；搜索缓冲在 750ms 后重置。'>
      <FocusMenuButton onClick={() => menuRef.current?.focus()} />
      <MenuList ref={menuRef}>
        <MenuItem>
          <ListItemText>Apple</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Banana</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Cherry</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Grape</ListItemText>
        </MenuItem>
      </MenuList>
    </MenuPanel>
  );
};

const menuSizes: ReadonlyArray<ComponentSize> = ['small', 'default', 'large'];

/**
 * 展示 MenuList 的列表级尺寸与 MenuItem 单项覆盖。
 */
export const MenuListSizeExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
    {menuSizes.map(size => (
      <MenuPanel key={size} footer={`MenuList size="${size}"`}>
        <MenuList size={size}>
          <MenuItem>
            <ListItemText>首页</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText>文档</ListItemText>
          </MenuItem>
          <MenuItem disabled>
            <ListItemText>禁用项</ListItemText>
          </MenuItem>
        </MenuList>
      </MenuPanel>
    ))}
    <MenuPanel footer='MenuItem size="small" 覆盖大尺寸列表'>
      <MenuList size='large'>
        <MenuItem>
          <ListItemText>Large list item</ListItemText>
        </MenuItem>
        <MenuItem size='small'>
          <ListItemText>Small override</ListItemText>
        </MenuItem>
      </MenuList>
    </MenuPanel>
  </div>
);
