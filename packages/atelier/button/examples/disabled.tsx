import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的禁用状态。
 */
export const ButtonDisabledExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button variant='primary'>可提交</Button>
    <Button disabled variant='primary'>
      无法提交
    </Button>
  </div>
);
