import { Button } from '@omnific/atelier';

/**
 * 展示 Button 的视觉变体。
 */
export const ButtonVariantsExample = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button variant='primary'>主按钮</Button>
    <Button variant='secondary'>次按钮</Button>
    <Button variant='dashed'>虚线按钮</Button>
    <Button variant='outline'>描边按钮</Button>
    <Button variant='danger'>危险按钮</Button>
  </div>
);
