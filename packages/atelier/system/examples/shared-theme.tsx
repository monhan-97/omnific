import { useState } from 'react';

import { Box, Button } from '@omnific/atelier';
import {
  createSystem,
  defaultConfig,
  defineTokens,
  useTheme,
} from '@omnific/atelier/system';

const sharedSystem = createSystem(
  'shared-panel',
  defaultConfig,
  defineTokens({
    colors: {
      bg: { value: '#1e1b4b' },
      'bg.muted': { value: '#312e81' },
      'bg.panel': { value: '#1e1b4b' },
      fg: { value: '#e0e7ff' },
      'fg.muted': { value: '#a5b4fc' },
      border: { value: '#4338ca' },
      'blue.solid': { value: '#818cf8' },
      'blue.hover': { value: '#a5b4fc' },
      'blue.active': { value: '#6366f1' },
      'blue.contrast': { value: '#1e1b4b' },
    },
  }),
);

type SharedPanelProps = {
  /**
   * 面板标题。
   */
  title: string;
};

/**
 * 挂载同一份 `sharedSystem` 的局部主题容器。
 */
const SharedPanel = (props: SharedPanelProps) => {
  const { title } = props;
  const themeRef = useTheme<HTMLDivElement>(sharedSystem);

  return (
    <div
      ref={themeRef}
      style={{ color: 'var(--color-fg)', minWidth: 200 }}
    >
      <Box bg='bg.muted' border p={4} rounded='md'>
        <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
          name: {sharedSystem.name}
        </div>
        <Button variant='primary'>Primary</Button>
      </Box>
    </div>
  );
};

/**
 * 多个容器复用同一 `system.name`，只注入一张 `<style>`。
 */
export const SystemSharedThemeExample = () => {
  const [showThird, setShowThird] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <Button
          variant={showThird ? 'secondary' : 'primary'}
          onClick={() => {
            setShowThird((prev) => !prev);
          }}
        >
          {showThird ? '卸载面板 C' : '挂载面板 C'}
        </Button>
        <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>
          卸载 / 挂载只会增减引用次数，不会重复创建样式表。
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <SharedPanel title='面板 A' />
        <SharedPanel title='面板 B' />
        {showThird ? <SharedPanel title='面板 C' /> : null}
      </div>
    </div>
  );
};
