import type { BoxProps } from '@omnific/atelier';
import { Box } from '@omnific/atelier';

const widthSteps = ['50%', '75%', '100%'] as const;
const heightSteps = ['2', '4', '6', '8'] as const;

/**
 * 展示 Box 的百分比宽度、min / max 约束与 height 刻度；首个 Box 由 Controls 驱动。
 */
export const BoxSizingExample = (props: BoxProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        受 Controls 控制的 Box：调整 width / height / minWidth / maxWidth 与外观
      </div>
      <Box {...props} />
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        width：百分比相对父容器宽度
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {widthSteps.map((step) => (
          <Box key={step} bg='accent-subtle' border p='2' radius='sm' width={step}>
            <span style={{ fontSize: 12 }}>width={step}</span>
          </Box>
        ))}
      </div>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        minWidth / maxWidth：约束内容驱动的尺寸
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        <Box bg='bg-muted' border p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>A</span>
        </Box>
        <Box bg='bg-muted' border minWidth='9' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>A</span>
        </Box>
        <Box bg='bg-muted' border maxWidth='9' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>maxWidth=9</span>
        </Box>
      </div>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        height：复用间距刻度
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        {heightSteps.map((step) => (
          <div
            key={step}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            <Box bg='accent-subtle' border height={step} radius='sm' width='4' />
            <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>height={step}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
