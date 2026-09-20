import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { clsx } from 'clsx';

import CustomizerSidebar from './CustomizerSidebar';
import IconCell from './IconCell';
import IconDetailsDrawer from './IconDetailsDrawer';
import type { IconEntry } from './icon-entries';
import type {
  CopyStatus,
  IconCustomizerSettings,
  IconExampleKind,
} from './icon-gallery-model';
import {
  copyExampleToClipboard,
  createIconCategories,
  createIconExamples,
  defaultIconCustomizerSettings,
  filterIcons,
} from './icon-gallery-model';
import './style/icon-gallery-layout.css';
import './style/icon-gallery-theme.css';

/**
 * Props accepted by {@link IconGallery}.
 */
export type IconGalleryProps = {
  /**
   * Icon metadata rendered by the gallery.
   */
  icons: readonly IconEntry[];
};

/**
 * Searchable icon browser modeled after the Lucide icons workspace.
 */
export function IconGallery(props: IconGalleryProps) {
  const { icons } = props;
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customizer, setCustomizer] = useState<IconCustomizerSettings>(
    defaultIconCustomizerSettings,
  );
  const [selectedIconName, setSelectedIconName] = useState('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus | undefined>();
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const detailsTitleRef = useRef<HTMLHeadingElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement | null>(null);

  const categories = useMemo(() => createIconCategories(icons), [icons]);
  const visibleIcons = useMemo(
    () => filterIcons(icons, query, selectedCategory),
    [icons, query, selectedCategory],
  );

  const selectedIcon = useMemo(
    () => icons.find(icon => icon.name === selectedIconName),
    [icons, selectedIconName],
  );
  const examples = useMemo(
    () => (selectedIcon ? createIconExamples(selectedIcon.name, customizer) : undefined),
    [customizer, selectedIcon],
  );
  const iconStyle = {
    '--icon-color': customizer.color,
    '--icon-size': `${customizer.size}px`,
    '--icon-stroke-width': customizer.absoluteStrokeWidth
      ? (customizer.strokeWidth * 24) / customizer.size
      : customizer.strokeWidth,
  } as CSSProperties;
  const isCustomized =
    customizer.color !== defaultIconCustomizerSettings.color ||
    customizer.size !== defaultIconCustomizerSettings.size ||
    customizer.strokeWidth !== defaultIconCustomizerSettings.strokeWidth ||
    customizer.absoluteStrokeWidth !== defaultIconCustomizerSettings.absoluteStrokeWidth;

  const selectIcon = useCallback(function selectIcon(name: string, button: HTMLButtonElement) {
    selectedButtonRef.current = button;
    setCopyStatus(undefined);
    setSelectedIconName(name);
  }, []);

  const closeDetails = useCallback(function closeDetails() {
    setSelectedIconName('');
    selectedButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyboardShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (selectedIconName && event.key === 'Escape') {
        closeDetails();
        return;
      }

      if (customizerOpen && event.key === 'Escape') {
        setCustomizerOpen(false);
      }
    }

    globalThis.addEventListener('keydown', handleKeyboardShortcut);
    return () => globalThis.removeEventListener('keydown', handleKeyboardShortcut);
  }, [closeDetails, customizerOpen, selectedIconName]);

  useEffect(() => {
    if (selectedIconName) {
      detailsTitleRef.current?.focus();
    }
  }, [selectedIconName]);

  useEffect(() => {
    if (!copyStatus) {
      return;
    }

    const timeout = globalThis.setTimeout(() => setCopyStatus(undefined), 1000);
    return () => globalThis.clearTimeout(timeout);
  }, [copyStatus]);

  async function copyExample(kind: IconExampleKind, content?: string) {
    setCopyStatus(undefined);
    const status = await copyExampleToClipboard({
      clipboard: navigator.clipboard,
      content: content ?? examples?.[kind] ?? '',
      kind,
    });

    setCopyStatus(status);
  }

  function updateCustomizer(values: Partial<IconCustomizerSettings>) {
    setCustomizer(currentCustomizer => ({
      ...currentCustomizer,
      ...values,
    }));
  }

  return (
    <main className='icon-page' aria-label='Icons' style={iconStyle}>
      <CustomizerSidebar
        categories={categories}
        customizer={customizer}
        isCustomized={isCustomized}
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        onReset={() => setCustomizer(defaultIconCustomizerSettings)}
        onSelectCategory={category => {
          setSelectedCategory(currentCategory => currentCategory === category ? 'All' : category);
          setSelectedIconName('');
        }}
        onUpdate={updateCustomizer}
        selectedCategory={selectedCategory}
      />

      <section
        className={clsx('icons-workspace', {
          'icons-workspace--drawer-open': selectedIcon,
        })}
        aria-label='Icon browser'
      >
        <div className='sticky-toolbar'>
          <button
            aria-label='Open customizer'
            className='mobile-customizer-button icon-control'
            onClick={() => setCustomizerOpen(true)}
            title='Open customizer'
            type='button'
          >
            <SlidersHorizontal aria-hidden='true' size={20} />
          </button>

          <div className='search-control'>
            <Search aria-hidden='true' size={22} />
            <input
              aria-label='Search icons'
              onChange={event => setQuery(event.currentTarget.value)}
              placeholder={`Search ${icons.length} icons…`}
              ref={searchInputRef}
              type='search'
              value={query}
            />
            {query ? (
              <button
                aria-label='Clear search'
                className='clear-search icon-control'
                onClick={() => {
                  setQuery('');
                  searchInputRef.current?.focus();
                }}
                title='Clear search'
                type='button'
              >
                <X aria-hidden='true' size={18} />
              </button>
            ) : (
              <kbd>⌘K</kbd>
            )}
          </div>
        </div>

        {visibleIcons.length === 0 ? (
          <div className='empty-state'>
            <Search aria-hidden='true' size={28} />
            <strong>No icons found</strong>
            <span>Try another component name.</span>
            <button onClick={() => setQuery('')} type='button'>
              Clear search
            </button>
          </div>
        ) : (
          <div className='icon-grid' aria-label={`${visibleIcons.length} matching icons`}>
            {visibleIcons.map(({ Component, name }) => (
              <IconCell
                Component={Component}
                isSelected={selectedIcon?.name === name}
                key={name}
                name={name}
                onSelect={selectIcon}
              />
            ))}
          </div>
        )}
      </section>

      {selectedIcon && examples ? (
        <IconDetailsDrawer
          copyStatus={copyStatus}
          examples={examples}
          icon={selectedIcon}
          onClose={closeDetails}
          onCopy={copyExample}
          titleRef={detailsTitleRef}
        />
      ) : undefined}
    </main>
  );
}
