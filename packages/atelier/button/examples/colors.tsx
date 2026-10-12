import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的颜色角色。
 */
export const ButtonColorsExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button color='default' variant='solid'>
      默认按钮
    </Button>
    <Button color='primary' variant='solid'>
      主按钮
    </Button>
    <Button color='danger' variant='solid'>
      危险按钮
    </Button>
  </div>
);
