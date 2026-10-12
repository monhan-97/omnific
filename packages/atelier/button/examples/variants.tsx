import { Button } from '@omnific/atelier';

/**
 * 展示旧 Button 视觉组合在新 color / variant API 下的映射。
 */
export const ButtonVariantsExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button color='primary' variant='solid'>
      主按钮
    </Button>
    <Button color='default' variant='outlined'>
      次按钮
    </Button>
    <Button color='default' variant='dashed'>
      虚线按钮
    </Button>
    <Button color='primary' variant='outlined'>
      描边按钮
    </Button>
    <Button color='danger' variant='solid'>
      危险按钮
    </Button>
  </div>
);
