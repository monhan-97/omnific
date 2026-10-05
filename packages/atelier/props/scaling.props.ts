/**
 * Atelier 结构缩放的静态值。
 */
export const scalingValues = ['90%', '95%', '100%', '105%', '110%'] as const;

/**
 * Atelier 结构缩放值。
 */
export type ScalingValue = (typeof scalingValues)[number];
