import { memo } from 'react';

import type { IconEntry } from './icon-entries';

type IconCellProps = Pick<IconEntry, 'Component' | 'name'> & {
  isSelected: boolean;
  onSelect(name: string, button: HTMLButtonElement): void;
};

const iconAppearance = {
  color: 'var(--icon-color)',
  size: 'var(--icon-size)',
  strokeWidth: 'var(--icon-stroke-width)',
} as const;

/**
 * Memoized icon button rendered inside the gallery grid.
 */
const IconCell = memo(function IconCell(props: IconCellProps) {
  const { Component, isSelected, name, onSelect } = props;

  return (
    <div className='icon-cell'>
      <button
        aria-label={name}
        aria-pressed={isSelected}
        className='icon-button'
        onClick={event => onSelect(name, event.currentTarget)}
        title={name}
        type='button'
      >
        <Component aria-hidden='true' focusable='false' {...iconAppearance} />
      </button>
      <span aria-hidden='true' className='icon-tooltip'>{name}</span>
    </div>
  );
});

export default IconCell;
