import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的尺寸变化。
 */
export const ButtonSizesExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button color='primary' size='small' variant='solid'>
      小号按钮
    </Button>
    <Button color='primary' size='default' variant='solid'>
      默认按钮
    </Button>
    <Button color='primary' size='large' variant='solid'>
      大号按钮
    </Button>
  </div>
);
