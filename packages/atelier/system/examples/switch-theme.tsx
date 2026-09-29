import { useState } from 'react';

import { Box, Button } from '@omnific/atelier';
import {
  createSystem,
  defaultConfig,
  defaultSystem,
  defineTokens,
  useTheme,
} from '@omnific/atelier/system';
import type { SystemContext } from '@omnific/atelier/system';

const darkSystem = createSystem(
  'dark',
  defaultConfig,
  defineTokens({
    colors: {
      bg: { value: '#18181b' },
      'bg.muted': { value: '#27272a' },
      'bg.panel': { value: '#18181b' },
      fg: { value: '#fafafa' },
      'fg.muted': { value: '#a1a1aa' },
      border: { value: '#3f3f46' },
      'blue.solid': { value: '#3b82f6' },
      'blue.hover': { value: '#60a5fa' },
      'blue.active': { value: '#2563eb' },
      'blue.contrast': { value: '#ffffff' },
    },
  }),
);

const warmSystem = createSystem(
  'warm',
  defaultConfig,
  defineTokens({
    colors: {
      bg: { value: '#fff7ed' },
      'bg.muted': { value: '#ffedd5' },
      'bg.panel': { value: '#fff7ed' },
      fg: { value: '#7c2d12' },
      'fg.muted': { value: '#9a3412' },
      border: { value: '#fdba74' },
      'blue.solid': { value: '#ea580c' },
      'blue.hover': { value: '#f97316' },
      'blue.active': { value: '#c2410c' },
      'blue.contrast': { value: '#ffffff' },
    },
  }),
);

/**
私有局部主题：独立 name，与全局主题隔离。
*/
const privateSystem = createSystem(
  'private',
  defaultConfig,
  defineTokens({
    colors: {
      bg: { value: '#0f172a' },
      'bg.muted': { value: '#1e293b' },
      'bg.panel': { value: '#0f172a' },
      fg: { value: '#e2e8f0' },
      'fg.muted': { value: '#94a3b8' },
      border: { value: '#334155' },
      'blue.solid': { value: '#14b8a6' },
      'blue.hover': { value: '#2dd4bf' },
      'blue.active': { value: '#0f766e' },
      'blue.contrast': { value: '#042f2e' },
    },
  }),
);

type GlobalThemeName = 'light' | 'dark' | 'warm';

/**
Light 复用包内 `defaultSystem`，与 Storybook preview 同一引用。
*/
const globalThemes: Record<GlobalThemeName, SystemContext> = {
  light: defaultSystem,
  dark: darkSystem,
  warm: warmSystem,
};

const GLOBAL_THEME_LABELS: Record<GlobalThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  warm: 'Warm',
};

const GLOBAL_THEME_NAMES: GlobalThemeName[] = ['light', 'dark', 'warm'];

/**
 * 全局 `:root` 可切换主题，另有一块不受全局切换影响的私有局部主题。
 */
export const SystemSwitchThemeExample = () => {
  const [globalTheme, setGlobalTheme] = useState<GlobalThemeName>('light');
  useTheme(globalThemes[globalTheme]);

  const privateThemeRef = useTheme<HTMLDivElement>(privateSystem);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {GLOBAL_THEME_NAMES.map((name) => (
          <Button
            key={name}
            variant={globalTheme === name ? 'primary' : 'secondary'}
            onClick={() => {
              setGlobalTheme(name);
            }}
          >
            全局 · {GLOBAL_THEME_LABELS[name]}
          </Button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <Box
          bg='bg.muted'
          border
          p={4}
          rounded='md'
          style={{ color: 'var(--color-fg)', minWidth: 220 }}
        >
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            全局主题（documentElement）
          </div>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
            当前：{GLOBAL_THEME_LABELS[globalTheme]}。未挂 ref，写入 documentElement。
          </div>
          <Button variant='primary'>Primary</Button>
        </Box>

        <div
          ref={privateThemeRef}
          style={{ color: 'var(--color-fg)', minWidth: 220 }}
        >
          <Box bg='bg.muted' border p={4} rounded='md'>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              私有主题（容器）
            </div>
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
              独立 `system` + ref；切换全局时保持不变。
            </div>
            <Button variant='primary'>Primary</Button>
          </Box>
        </div>
      </div>
    </div>
  );
};
