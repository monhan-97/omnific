import { useState } from 'react';

import { Box, Button } from '@omnific/atelier';
import { createSystem, defaultColors, defineColors, useTheme } from '@omnific/atelier/system';

const sharedSystem = createSystem(
  'shared-panel',
  defaultColors,
  defineColors({
    bg: {
      base: '#1e1b4b',
      muted: '#312e81',
      panel: '#1e1b4b',
    },
    fg: {
      base: '#e0e7ff',
      muted: '#a5b4fc',
    },
    border: {
      base: '#4338ca',
    },
    accent: {
      solid: '#818cf8',
      hover: '#a5b4fc',
      active: '#6366f1',
      contrast: '#1e1b4b',
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
    <div ref={themeRef} style={{ color: 'var(--color-fg)', minWidth: 200 }}>
      <Box bg='bg-muted' border p='4' radius='md'>
        <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
          name: {sharedSystem.name}
        </div>
        <Button color='primary' variant='solid'>
          Primary
        </Button>
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
          color={showThird ? 'default' : 'primary'}
          variant={showThird ? 'outlined' : 'solid'}
          onClick={() => {
            setShowThird(prev => !prev);
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
