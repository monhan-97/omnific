import { EyeIcon } from '@omnific/icons';

import type { ButtonProps } from '@omnific/atelier';
import { Button } from '@omnific/atelier';

/**
 * 展示仅包含图标的 Button。
 */
export const ButtonIconOnlyExample = (props: ButtonProps) => (
  <Button aria-label='查看详情' icon={<EyeIcon />} {...props} />
);
