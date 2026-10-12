import { Box, Button } from '@omnific/atelier';
import { createSystem, defaultColors, defineColors, useTheme } from '@omnific/atelier/system';

const localSystem = createSystem(
  'local-amber',
  defaultColors,
  defineColors({
    bg: {
      base: '#18181b',
      muted: '#27272a',
      panel: '#18181b',
    },
    fg: {
      base: '#fafafa',
      muted: '#a1a1aa',
    },
    border: {
      base: '#3f3f46',
    },
    accent: {
      solid: '#f59e0b',
      hover: '#fbbf24',
      active: '#d97706',
      contrast: '#18181b',
    },
  }),
);

/**
 * 对比全局主题与容器局部主题（`useTheme` 挂到局部节点）。
 */
export const SystemLocalThemeExample = () => {
  const themeRef = useTheme<HTMLDivElement>(localSystem);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <Box
        bg='bg-muted'
        border
        p='4'
        radius='md'
        style={{ color: 'var(--color-fg)', minWidth: 220 }}
      >
        <div style={{ marginBottom: 12, fontSize: 14 }}>全局主题（documentElement）</div>
        <Button color='primary' variant='solid'>
          Primary
        </Button>
      </Box>

      <div ref={themeRef} style={{ color: 'var(--color-fg)', minWidth: 220 }}>
        <Box bg='bg-muted' border p='4' radius='md'>
          <div style={{ marginBottom: 12, fontSize: 14 }}>局部主题（容器）</div>
          <Button color='primary' variant='solid'>
            Primary
          </Button>
        </Box>
      </div>
    </div>
  );
};
