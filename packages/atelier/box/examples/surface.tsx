import { Box } from '@omnific/atelier';

/**
 * 展示 Box 的 padding / 背景 / 圆角 / 边框 / 阴影组合。
 */
export const BoxSurfaceExample = () => (
  <Box bg='bg' border p={4} rounded='md' shadow='md'>
    带边框、圆角与阴影的内容块
  </Box>
);
