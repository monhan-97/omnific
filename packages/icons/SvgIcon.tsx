import type { IconProps } from './iconTypes';
import { svgAttributes } from './svgAttributes';

/**
 * SvgIcon 组件，用于渲染自定义的 SVG 图标
 * @param {IconProps} props - 组件的属性对象
 * @returns {JSX.Element} 返回一个 SVG 元素
 */
export const SvgIcon = (props: IconProps) => {
  const {
    absoluteStrokeWidth = false,
    children,
    color = svgAttributes.stroke,
    size = 24,
    strokeWidth = 2,
    ...restProps
  } = props;

  return (
    <svg
      {...svgAttributes}
      width={size}
      height={size}
      stroke={color}
      strokeWidth={absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth}
      {...restProps}
    >
      {children}
    </svg>
  );
};
