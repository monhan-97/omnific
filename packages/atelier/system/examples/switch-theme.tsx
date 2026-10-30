import { useState } from 'react';

import { Box, Button } from '@omnific/atelier';
import { createTheme, useTheme } from '@omnific/atelier/system';

const darkTheme = {
  semanticTokens: {
    colors: {
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
        fg: '#93c5fd',
        subtle: '#172554',
        muted: '#1e3a8a',
        emphasized: '#1d4ed8',
        solid: '#3b82f6',
        hover: '#60a5fa',
        active: '#2563eb',
        contrast: '#ffffff',
        'focus-ring': 'rgb(59 130 246 / 30%)',
        border: '#3b82f6',
      },
    },
  },
};

const warmTheme = {
  semanticTokens: {
    colors: {
      bg: {
        base: '#fff7ed',
        muted: '#ffedd5',
        panel: '#fff7ed',
      },
      fg: {
        base: '#7c2d12',
        muted: '#9a3412',
      },
      border: {
        base: '#fdba74',
      },
      accent: {
        fg: '#ea580c',
        subtle: '#fff7ed',
        muted: '#ffedd5',
        emphasized: '#fed7aa',
        solid: '#ea580c',
        hover: '#f97316',
        active: '#c2410c',
        contrast: '#ffffff',
        'focus-ring': 'rgb(234 88 12 / 30%)',
        border: '#ea580c',
      },
    },
  },
};

/**
 * 私有局部主题：独立 name，与全局主题隔离。
 */
const privateTheme = {
  semanticTokens: {
    colors: {
      bg: {
        base: '#0f172a',
        muted: '#1e293b',
        panel: '#0f172a',
      },
      fg: {
        base: '#e2e8f0',
        muted: '#94a3b8',
      },
      border: {
        base: '#334155',
      },
      accent: {
        fg: '#5eead4',
        subtle: '#042f2e',
        muted: '#134e4a',
        emphasized: '#115e59',
        solid: '#14b8a6',
        hover: '#2dd4bf',
        active: '#0f766e',
        contrast: '#042f2e',
        'focus-ring': 'rgb(20 184 166 / 30%)',
        border: '#14b8a6',
      },
    },
  },
};

const lightSystem = createTheme('light');
const darkSystem = createTheme('dark', darkTheme);
const warmSystem = createTheme('warm', warmTheme);
const privateSystem = createTheme('private', privateTheme);

const globalThemes = {
  light: lightSystem,
  dark: darkSystem,
  warm: warmSystem,
} as const;

const GLOBAL_THEME_LABELS = {
  light: 'Light',
  dark: 'Dark',
  warm: 'Warm',
} as const;

const GLOBAL_THEME_NAMES = ['light', 'dark', 'warm'] as const;

/**
 * 全局 `:root` 可切换主题，另有一块不受全局切换影响的私有局部主题。
 */
export const SystemSwitchThemeExample = () => {
  const [globalTheme, setGlobalTheme] = useState<keyof typeof globalThemes>('light');
  useTheme(globalThemes[globalTheme]);

  const privateThemeRef = useTheme<HTMLDivElement>(privateSystem);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {GLOBAL_THEME_NAMES.map(name => (
          <Button
            key={name}
            color={globalTheme === name ? 'primary' : 'default'}
            variant={globalTheme === name ? 'solid' : 'outlined'}
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
          bg='bg-muted'
          border
          p='4'
          radius='md'
          style={{ color: 'var(--color-fg)', minWidth: 220 }}
        >
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            全局主题（documentElement）
          </div>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
            当前：{GLOBAL_THEME_LABELS[globalTheme]}。未挂 ref，写入 documentElement。
          </div>
          <Button color='primary' variant='solid'>
            Primary
          </Button>
        </Box>

        <div ref={privateThemeRef} style={{ color: 'var(--color-fg)', minWidth: 220 }}>
          <Box bg='bg-muted' border p='4' radius='md'>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>私有主题（容器）</div>
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
              独立 `system` + ref；局部已覆盖的变量不受全局切换影响，未覆盖变量仍继承当前全局主题。
            </div>
            <Button color='primary' variant='solid'>
              Primary
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};
