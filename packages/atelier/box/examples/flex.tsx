import type { BoxProps } from '@omnific/atelier';
import { Box } from '@omnific/atelier';

const wrapItems = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'] as const;

/**
 * 展示 Box 的 flex 布局：主轴分布、交叉轴对齐、方向、弹性伸缩与换行；首个容器由 Controls 驱动。
 */
export const BoxFlexExample = (props: BoxProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        受 Controls 控制的容器：调整 display / flexDirection / justifyContent / alignItems / gap
      </div>
      <Box {...props}>
        <Box bg='accent-subtle' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>start</span>
        </Box>
        <Box bg='success-subtle' p='4' radius='sm'>
          <span style={{ fontSize: 12 }}>center</span>
        </Box>
        <Box bg='warning-subtle' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>end</span>
        </Box>
      </Box>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        flexDirection=column + gap=2
      </div>
      <Box bg='bg-muted' border display='flex' flexDirection='column' gap='2' p='3' radius='md'>
        {['第一行', '第二行', '第三行'].map((label) => (
          <Box key={label} bg='accent-subtle' p='2' radius='sm'>
            <span style={{ fontSize: 12 }}>{label}</span>
          </Box>
        ))}
      </Box>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        flexBasis=0 + flexGrow=1：中间项占满剩余空间
      </div>
      <Box bg='bg-muted' border display='flex' gap='2' p='3' radius='md'>
        <Box bg='accent-subtle' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>固定</span>
        </Box>
        <Box bg='success-subtle' flexBasis='0' flexGrow='1' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>flexGrow=1</span>
        </Box>
        <Box bg='warning-subtle' p='2' radius='sm'>
          <span style={{ fontSize: 12 }}>固定</span>
        </Box>
      </Box>
    </div>

    <div>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-fg-muted)' }}>
        flexWrap=wrap：容器变窄时自动换行
      </div>
      <div style={{ width: 220 }}>
        <Box bg='bg-muted' border display='flex' flexWrap='wrap' gap='2' p='3' radius='md'>
          {wrapItems.map((label) => (
            <Box key={label} bg='accent-subtle' p='2' radius='sm'>
              <span style={{ fontSize: 12 }}>{label}</span>
            </Box>
          ))}
        </Box>
      </div>
    </div>
  </div>
);
