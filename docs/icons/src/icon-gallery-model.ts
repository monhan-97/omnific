import type { IconEntry } from './icon-entries';

/**
Code example variants supported by the details panel.
*/
export type IconExampleKind = 'svg' | 'jsx';

/**
Category summary rendered in the sidebar.
*/
export type IconCategory = {
  /**
  Category label stored by icon entries.
  */
  name: string;
  /**
  Number of icons assigned to the category.
  */
  count: number;
};

/**
Clipboard write contract used by the browser and tests.
*/
export type ClipboardWriter = {
  /**
  Writes text into the system clipboard.
  */
  writeText(content: string): Promise<void>;
};

/**
Outcome rendered after a copy attempt.
*/
export type CopyStatus = `${IconExampleKind}-${'success' | 'failed'}`;

/**
Customizer values applied to preview icons and generated JSX.
*/
export type IconCustomizerSettings = {
  /**
  SVG stroke color used by every preview icon.
  */
  color: string;
  /**
  Icon width and height in pixels.
  */
  size: number;
  /**
  SVG stroke width used by every preview icon.
  */
  strokeWidth: number;
  /**
  Keeps the apparent stroke width stable when the icon size changes.
  */
  absoluteStrokeWidth: boolean;
};

/**
Default icon appearance for the preview browser.
*/
export const defaultIconCustomizerSettings: IconCustomizerSettings = {
  color: '#000000',
  size: 24,
  strokeWidth: 2,
  absoluteStrokeWidth: false,
};
/**
Filters icon entries by component name and category.
*/
export function filterIcons(
  icons: readonly IconEntry[],
  query: string,
  category = 'All',
) {
  const normalizedQuery = query.trim().toLowerCase();

  return icons.filter(icon => {
    const matchesCategory = category === 'All' || icon.categories.includes(category);
    const matchesQuery =
      normalizedQuery.length === 0 || icon.name.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

/**
Creates the non-empty category navigation shown beside the gallery.
*/
export function createIconCategories(icons: readonly IconEntry[]): IconCategory[] {
  const counts = new Map<string, number>();

  for (const icon of icons) {
    for (const category of icon.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
Creates the named import example shown in the details panel.
*/
export function createImportExample(iconName: string) {
  return `import { ${iconName} } from '@omnific/icons';`;
}

/**
Creates the JSX usage example shown in the details panel.
*/
export function createJsxExample(iconName: string, settings: IconCustomizerSettings) {
  const absoluteStrokeWidth = settings.absoluteStrokeWidth ? ' absoluteStrokeWidth' : '';

  return `<${iconName} color="${settings.color}" size={${settings.size}} strokeWidth={${settings.strokeWidth}}${absoluteStrokeWidth} aria-label="${iconName}" />`;
}

/**
Creates all code examples for one icon name.
*/
export function createIconExamples(iconName: string, settings: IconCustomizerSettings) {
  return {
    svg: '',
    jsx: createJsxExample(iconName, settings),
  };
}

/**
Writes example content to the Clipboard API and returns a renderable status.
*/
export async function copyExampleToClipboard(options: {
  clipboard: ClipboardWriter | undefined;
  content: string;
  kind: IconExampleKind;
}): Promise<CopyStatus> {
  const { clipboard, content, kind } = options;

  if (!content || !clipboard) {
    return `${kind}-failed`;
  }

  try {
    await clipboard.writeText(content);
    return `${kind}-success`;
  } catch {
    return `${kind}-failed`;
  }
}

/**
Returns the short feedback text for a copy status.
*/
export function getCopyStatusLabel(status: CopyStatus | undefined, kind: IconExampleKind) {
  if (status === `${kind}-success`) {
    return 'Copied!';
  }

  if (status === `${kind}-failed`) {
    return 'Copy failed';
  }

  return;
}
