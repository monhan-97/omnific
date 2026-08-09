import type { CSSProperties } from 'react';
import { PanelLeftClose, RotateCw } from 'lucide-react';
import { clsx } from 'clsx';

import type { IconCategory, IconCustomizerSettings } from './icon-gallery-model';

type CustomizerSidebarProps = {
  categories: readonly IconCategory[];
  customizer: IconCustomizerSettings;
  isCustomized: boolean;
  isOpen: boolean;
  onClose(): void;
  onReset(): void;
  onSelectCategory(category: string): void;
  onUpdate(values: Partial<IconCustomizerSettings>): void;
  selectedCategory: string;
};

function getRangeStyle(value: number, min: number, max: number) {
  return {
    '--range-progress': `${((value - min) / (max - min)) * 100}%`,
  } as CSSProperties;
}

/**
 * Sidebar containing icon appearance controls and category navigation.
 */
export default function CustomizerSidebar(props: CustomizerSidebarProps) {
  const {
    customizer,
    categories,
    isCustomized,
    isOpen,
    onClose,
    onReset,
    onSelectCategory,
    onUpdate,
    selectedCategory,
  } = props;

  return (
    <>
      {isOpen ? (
        <button
          aria-label='Close customizer'
          className='sidebar-backdrop'
          onClick={onClose}
          type='button'
        />
      ) : undefined}

      <aside
        aria-label='Icon customizer and categories'
        className={clsx('sidebar', { 'sidebar--open': isOpen })}
      >
        <button
          aria-label='Close customizer'
          className='mobile-close icon-control'
          onClick={onClose}
          title='Close customizer'
          type='button'
        >
          <PanelLeftClose aria-hidden='true' size={18} />
        </button>

        <section
          className={clsx('customizer-card', {
            'customizer-card--active': isCustomized,
          })}
          aria-labelledby='customizer-title'
        >
          <div className='panel-heading'>
            <h1 id='customizer-title'>Customizer</h1>
            <button
              aria-label='Reset icon customization'
              className='icon-control reset-button'
              onClick={onReset}
              title='Reset customization'
              type='button'
            >
              <RotateCw aria-hidden='true' size={20} />
            </button>
          </div>

          <label className='customizer-field'>
            <span>Color</span>
            <span className='color-control'>
              <input
                aria-label='Icon color'
                onChange={event => onUpdate({ color: event.currentTarget.value })}
                type='color'
                value={customizer.color}
              />
              <code>{customizer.color}</code>
            </span>
          </label>

          <div className='customizer-field'>
            <div className='field-heading'>
              <label htmlFor='icon-stroke-width'>Stroke width</label>
              <output htmlFor='icon-stroke-width'>{customizer.strokeWidth}px</output>
            </div>
            <input
              aria-label='Icon stroke width'
              id='icon-stroke-width'
              max='3'
              min='0.5'
              onChange={event => onUpdate({ strokeWidth: Number(event.currentTarget.value) })}
              step='0.25'
              style={getRangeStyle(customizer.strokeWidth, 0.5, 3)}
              type='range'
              value={customizer.strokeWidth}
            />
          </div>

          <div className='customizer-field'>
            <div className='field-heading'>
              <label htmlFor='icon-size'>Size</label>
              <output htmlFor='icon-size'>{customizer.size}px</output>
            </div>
            <input
              aria-label='Icon size'
              id='icon-size'
              max='48'
              min='16'
              onChange={event => onUpdate({ size: Number(event.currentTarget.value) })}
              step='4'
              style={getRangeStyle(customizer.size, 16, 48)}
              type='range'
              value={customizer.size}
            />
          </div>

          <div className='customizer-field switch-field'>
            <label htmlFor='absolute-stroke-width'>Absolute stroke width</label>
            <input
              id='absolute-stroke-width'
              checked={customizer.absoluteStrokeWidth}
              onChange={event => onUpdate({ absoluteStrokeWidth: event.currentTarget.checked })}
              role='switch'
              type='checkbox'
            />
          </div>
        </section>

        <nav className='categories-panel' aria-labelledby='categories-title'>
          <h2 id='categories-title'>Categories</h2>
          {categories.map(category => (
            <button
              aria-current={selectedCategory === category.name ? 'page' : undefined}
              className='category-link'
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              type='button'
            >
              <span>{category.name}</span>
              <span aria-label={`Count of icons in ${category.name}`}>{category.count}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
