import { EyeIcon } from '@omnific/icons';

import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的默认、circle 和 round 形状。
 */
export const ButtonShapeExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button variant='primary'>默认按钮</Button>
    <Button aria-label='圆形按钮' icon={<EyeIcon />} shape='circle' variant='primary' />
    <Button shape='round' variant='primary'>圆角按钮</Button>
  </div>
);
