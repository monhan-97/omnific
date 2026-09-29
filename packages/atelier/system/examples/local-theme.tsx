import { Box, Button } from '@omnific/atelier';
import {
  createSystem,
  defaultConfig,
  defineTokens,
  useTheme,
} from '@omnific/atelier/system';

const localSystem = createSystem(
  'local-amber',
  defaultConfig,
  defineTokens({
    colors: {
      bg: { value: '#18181b' },
      'bg.muted': { value: '#27272a' },
      'bg.panel': { value: '#18181b' },
      fg: { value: '#fafafa' },
      'fg.muted': { value: '#a1a1aa' },
      border: { value: '#3f3f46' },
      'blue.solid': { value: '#f59e0b' },
      'blue.hover': { value: '#fbbf24' },
      'blue.active': { value: '#d97706' },
      'blue.contrast': { value: '#18181b' },
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
      <Box bg='bg.muted' border p={4} rounded='md' style={{ color: 'var(--color-fg)', minWidth: 220 }}>
        <div style={{ marginBottom: 12, fontSize: 14 }}>全局主题（documentElement）</div>
        <Button variant='primary'>Primary</Button>
      </Box>

      <div
        ref={themeRef}
        style={{ color: 'var(--color-fg)', minWidth: 220 }}
      >
        <Box bg='bg.muted' border p={4} rounded='md'>
          <div style={{ marginBottom: 12, fontSize: 14 }}>局部主题（容器）</div>
          <Button variant='primary'>Primary</Button>
        </Box>
      </div>
    </div>
  );
};
