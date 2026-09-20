import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChevronUp, X } from 'lucide-react';
import { clsx } from 'clsx';

import type { IconEntry } from './icon-entries';
import type { CopyStatus, IconExampleKind } from './icon-gallery-model';
import { getCopyStatusLabel } from './icon-gallery-model';

type IconDetailsDrawerProps = {
  copyStatus: CopyStatus | undefined;
  examples: Record<IconExampleKind, string>;
  icon: IconEntry;
  onClose(): void;
  onCopy(kind: IconExampleKind, content?: string): void;
  titleRef: RefObject<HTMLHeadingElement | null>;
};

type CopyMenuOption = {
  label: string;
  onSelect(): void;
};

const iconAppearance = {
  color: 'var(--icon-color)',
  size: 'var(--icon-size)',
  strokeWidth: 'var(--icon-stroke-width)',
} as const;

function getFileName(componentName: string) {
  return componentName
    .replace(/Icon$/, '')
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function serializePreviewSvg(preview: HTMLDivElement | null) {
  const svg = preview?.querySelector('svg');

  if (!svg) {
    return '';
  }

  const clone = svg.cloneNode(true) as SVGSVGElement;
  const computedStyle = globalThis.getComputedStyle(svg);
  const size = computedStyle.getPropertyValue('--icon-size').trim().replace('px', '');
  const color = computedStyle.getPropertyValue('--icon-color').trim();
  const strokeWidth = computedStyle.getPropertyValue('--icon-stroke-width').trim();

  clone.setAttribute('width', size);
  clone.setAttribute('height', size);
  clone.setAttribute('stroke', color);
  clone.setAttribute('stroke-width', strokeWidth);

  return clone.outerHTML;
}

function download(content: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');

  link.download = fileName;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadPng(svg: string, fileName: string) {
  const imageUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve());
      image.addEventListener('error', () => reject(new Error('Unable to render SVG')));
      image.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 512;
    context?.drawImage(image, 0, 0, 512, 512);
    canvas.toBlob(blob => {
      if (blob) {
        download(blob, `${fileName}.png`, 'image/png');
      }
    }, 'image/png');
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/**
 * Bottom details panel with a large preview and Lucide-style copy menus.
 */
export default function IconDetailsDrawer(props: IconDetailsDrawerProps) {
  const { copyStatus, examples, icon, onClose, onCopy, titleRef } = props;
  const [openMenu, setOpenMenu] = useState<IconExampleKind | undefined>();
  const IconComponent = icon.Component;
  const actionsRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileName = getFileName(icon.name);

  useEffect(() => {
    if (!openMenu) {
      return;
    }

    function closeMenu(event: PointerEvent) {
      if (event.target instanceof Node && !actionsRef.current?.contains(event.target)) {
        setOpenMenu(undefined);
      }
    }

    document.addEventListener('pointerdown', closeMenu);
    return () => document.removeEventListener('pointerdown', closeMenu);
  }, [openMenu]);

  function getSvg() {
    return serializePreviewSvg(previewRef.current);
  }

  function copy(kind: IconExampleKind, content: string) {
    setOpenMenu(undefined);
    onCopy(kind, content);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (!(openMenu && event.key === 'Escape')) {
      return;
    }

    event.stopPropagation();
    setOpenMenu(undefined);
  }

  const copyMenus: ReadonlyArray<{
    kind: IconExampleKind;
    options: readonly CopyMenuOption[];
  }> = [
    {
      kind: 'svg',
      options: [
        { label: 'Copy SVG', onSelect: () => copy('svg', getSvg()) },
        {
          label: 'Copy Data URL',
          onSelect: () => copy('svg', `data:image/svg+xml,${encodeURIComponent(getSvg())}`),
        },
        {
          label: 'Download SVG',
          onSelect: () => {
            setOpenMenu(undefined);
            download(getSvg(), `${fileName}.svg`, 'image/svg+xml');
          },
        },
        {
          label: 'Download PNG',
          onSelect: () => {
            setOpenMenu(undefined);
            void downloadPng(getSvg(), fileName);
          },
        },
      ],
    },
    {
      kind: 'jsx',
      options: [
        { label: 'Copy JSX', onSelect: () => copy('jsx', examples.jsx) },
        { label: 'Copy Component Name', onSelect: () => copy('jsx', icon.name) },
        {
          label: 'Copy Vue',
          onSelect: () => copy('jsx', examples.jsx.replaceAll('{', ':').replaceAll('}', '')),
        },
        { label: 'Copy Svelte', onSelect: () => copy('jsx', examples.jsx) },
        {
          label: 'Copy Angular',
          onSelect: () => copy('jsx', examples.jsx.replaceAll('{', '[').replaceAll('}', ']')),
        },
      ],
    },
  ];

  return (
    <dialog
      aria-labelledby='details-title'
      aria-live='polite'
      className='details-drawer'
      onKeyDown={handleKeyDown}
      open
    >
      <div className='drawer-panel'>
        <nav className='drawer-menu' aria-label='Icon details actions'>
          <button
            aria-label='Close icon details'
            className='drawer-close icon-control'
            onClick={onClose}
            title='Close details'
            type='button'
          >
            <X aria-hidden='true' size={20} />
          </button>
        </nav>

        <div className='drawer-preview' ref={previewRef}>
          <IconComponent aria-label={`${icon.name} large preview`} role='img' {...iconAppearance} />
        </div>

        <section className='drawer-details' aria-label='Icon information'>
          <div className='drawer-title-wrapper'>
            <h2 id='details-title' ref={titleRef} tabIndex={-1}>
              {icon.name}
            </h2>
          </div>
          <p className='icon-keywords'>{icon.keywords.join(' • ')}</p>
          <div className='category-tags' aria-label='Categories'>
            {icon.categories.map(category => <span key={category}>{category}</span>)}
          </div>
          <div className='drawer-actions' ref={actionsRef}>
            <a href={`#${icon.name}`}>
              See in action
            </a>
            {copyMenus.map(menu => {
              const feedback = getCopyStatusLabel(copyStatus, menu.kind);
              const isOpen = openMenu === menu.kind;
              const label = `Copy ${menu.kind.toUpperCase()}`;

              return (
                <div
                  className='copy-menu'
                  data-copy-kind={menu.kind}
                  data-copy-state={feedback ? copyStatus : undefined}
                  key={menu.kind}
                >
                  <div className='copy-button-wrapper'>
                    <button
                      aria-label={`Copy ${menu.kind} example`}
                      className={clsx('copy-main-button confetti-button', {
                        animate: feedback === 'Copied!',
                      })}
                      data-confetti-text='Copied!'
                      onClick={() => copy(menu.kind, menu.kind === 'svg' ? getSvg() : examples.jsx)}
                      type='button'
                    >
                      {label}
                    </button>
                    <button
                      aria-controls={`${menu.kind}-copy-menu`}
                      aria-expanded={isOpen}
                      aria-haspopup='listbox'
                      aria-label={`Show ${menu.kind.toUpperCase()} options`}
                      className='copy-menu-toggle'
                      onClick={() =>
                        setOpenMenu(currentMenu =>
                          currentMenu === menu.kind ? undefined : menu.kind,
                        )
                      }
                      type='button'
                    >
                      <ChevronUp aria-hidden='true' size={16} />
                    </button>
                  </div>
                  {feedback ? <span className='copy-status' role='status'>{feedback}</span> : undefined}
                  {isOpen ? (
                    <div className='copy-menu-items' id={`${menu.kind}-copy-menu`} role='listbox'>
                      {menu.options.map((option, index) => (
                        <button
                          aria-selected={index === 0}
                          className='copy-menu-item'
                          key={option.label}
                          onClick={option.onSelect}
                          role='option'
                          type='button'
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : undefined}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </dialog>
  );
}
