import type { BoxProps } from '@omnific/atelier';
import { Box } from '@omnific/atelier';

const paddingSteps = ['0', '2', '4', '6', '8'] as const;

/**
 * 展示 Box 的 padding 刻度、轴向简写与负 margin 叠压；首个 Box 由 Controls 驱动。
 */
export const BoxSpacingExample = (props: BoxProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        受 Controls 控制的 Box：调整 p / px / py / m / mx / my 与外观
      </div>
      <Box {...props} />
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        padding 刻度：p=0 / 2 / 4 / 6 / 8
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        {paddingSteps.map((step) => (
          <Box key={step} bg='bg-muted' border p={step} radius='sm'>
            <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>p={step}</span>
          </Box>
        ))}
      </div>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        轴向简写：px 控制左右，py 控制上下
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        <Box bg='accent-subtle' border px='6' py='2' radius='sm'>
          <span style={{ fontSize: 12 }}>px=6 py=2</span>
        </Box>
        <Box bg='success-subtle' border px='2' py='6' radius='sm'>
          <span style={{ fontSize: 12 }}>px=2 py=6</span>
        </Box>
      </div>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        margin 负值：-ml 让后续块向左叠压
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Box bg='bg-muted' border p='3' radius='sm'>
          <span style={{ fontSize: 12 }}>A</span>
        </Box>
        <Box bg='accent-subtle' border ml='-3' p='3' radius='sm'>
          <span style={{ fontSize: 12 }}>B · ml=-3</span>
        </Box>
        <Box bg='success-subtle' border ml='-3' p='3' radius='sm'>
          <span style={{ fontSize: 12 }}>C · ml=-3</span>
        </Box>
      </div>
    </div>
  </div>
);
