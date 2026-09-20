import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的尺寸变化。
 */
export const ButtonSizesExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button size='small' variant='primary'>小号按钮</Button>
    <Button size='default' variant='primary'>默认按钮</Button>
    <Button size='large' variant='primary'>大号按钮</Button>
  </div>
);
