import { EyeIcon } from '@omnific/icons';

import type { ButtonProps } from '@omnific/atelier';
import { Button } from '@omnific/atelier';

/**
 * 展示包含图标和文本的 Button。
 */
export const ButtonIconExample = (props: ButtonProps) => (
  <Button icon={<EyeIcon />} {...props} />
);
