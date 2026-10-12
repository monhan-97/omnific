import { EyeIcon } from '@omnific/icons';

import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的默认、circle 和 round 形状。
 */
export const ButtonShapeExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button color='primary' variant='solid'>
      默认按钮
    </Button>
    <Button
      aria-label='圆形按钮'
      color='primary'
      icon={<EyeIcon />}
      shape='circle'
      variant='solid'
    />
    <Button color='primary' shape='round' variant='solid'>
      圆角按钮
    </Button>
  </div>
);
