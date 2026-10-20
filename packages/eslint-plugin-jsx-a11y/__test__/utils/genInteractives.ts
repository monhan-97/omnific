/**
 * Interactive / non-interactive element fixtures for util tests.
 * Ported from upstream `__mocks__/genInteractives.js`, using parsed JSX instead of hand-built AST mocks.
 */

import { hasValue, isNil } from '@omnific/utils';
import { dom, roles } from 'aria-query';
import type { JSXElement, JSXOpeningElement } from 'estree-jsx';

import { jsxElementSource, parseJSXElement } from './parseJsx';

type AttrSpec = { name: string; value?: string | number | boolean | null };

// aria-query types/runtime: `.keys()` returns a string array (not an Iterator).
const domElements = dom.keys();
const roleNames = roles.keys();

const interactiveElementsMap: Record<string, AttrSpec[]> = {
  a: [{ name: 'href', value: '#' }],
  area: [{ name: 'href', value: '#' }],
  audio: [],
  button: [],
  canvas: [],
  datalist: [],
  embed: [],
  input: [],
  'input[type="button"]': [{ name: 'type', value: 'button' }],
  'input[type="checkbox"]': [{ name: 'type', value: 'checkbox' }],
  'input[type="color"]': [{ name: 'type', value: 'color' }],
  'input[type="date"]': [{ name: 'type', value: 'date' }],
  'input[type="datetime"]': [{ name: 'type', value: 'datetime' }],
  'input[type="email"]': [{ name: 'type', value: 'email' }],
  'input[type="file"]': [{ name: 'type', value: 'file' }],
  'input[type="image"]': [{ name: 'type', value: 'image' }],
  'input[type="month"]': [{ name: 'type', value: 'month' }],
  'input[type="number"]': [{ name: 'type', value: 'number' }],
  'input[type="password"]': [{ name: 'type', value: 'password' }],
  'input[type="radio"]': [{ name: 'type', value: 'radio' }],
  'input[type="range"]': [{ name: 'type', value: 'range' }],
  'input[type="reset"]': [{ name: 'type', value: 'reset' }],
  'input[type="search"]': [{ name: 'type', value: 'search' }],
  'input[type="submit"]': [{ name: 'type', value: 'submit' }],
  'input[type="tel"]': [{ name: 'type', value: 'tel' }],
  'input[type="text"]': [{ name: 'type', value: 'text' }],
  'input[type="time"]': [{ name: 'type', value: 'time' }],
  'input[type="url"]': [{ name: 'type', value: 'url' }],
  'input[type="week"]': [{ name: 'type', value: 'week' }],
  menuitem: [],
  option: [],
  select: [],
  summary: [],
  td: [],
  th: [],
  tr: [],
  textarea: [],
  video: [],
};

const nonInteractiveElementsMap: Record<string, AttrSpec[]> = {
  abbr: [],
  address: [],
  article: [],
  aside: [],
  blockquote: [],
  br: [],
  caption: [],
  code: [],
  dd: [],
  del: [],
  details: [],
  dfn: [],
  dialog: [],
  dir: [],
  dl: [],
  dt: [],
  em: [],
  fieldset: [],
  figcaption: [],
  figure: [],
  footer: [],
  form: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  hr: [],
  html: [],
  iframe: [],
  img: [],
  ins: [],
  label: [],
  legend: [],
  li: [],
  main: [],
  mark: [],
  marquee: [],
  menu: [],
  meter: [],
  nav: [],
  ol: [],
  optgroup: [],
  output: [],
  p: [],
  pre: [],
  progress: [],
  ruby: [],
  'section[aria-label]': [{ name: 'aria-label' }],
  'section[aria-labelledby]': [{ name: 'aria-labelledby' }],
  strong: [],
  sub: [],
  sup: [],
  table: [],
  tbody: [],
  tfoot: [],
  thead: [],
  time: [],
  ul: [],
};

const indeterminantInteractiveElementsMap: Record<string, AttrSpec[]> = Object.fromEntries(
  domElements.map(name => [name, [] as AttrSpec[]]),
);

for (const name of [
  ...Object.keys(interactiveElementsMap),
  ...Object.keys(nonInteractiveElementsMap),
]) {
  Reflect.deleteProperty(indeterminantInteractiveElementsMap, name);
}

const abstractRoles = roleNames.filter(role => {
  const definition = roles.get(role);
  return hasValue(definition) && definition.abstract;
});

const nonAbstractRoles = roleNames.filter(role => {
  const definition = roles.get(role);
  return !(isNil(definition) || definition.abstract);
});

const interactiveRoles = [...roleNames, 'toolbar'].filter(role => {
  const definition = roles.get(role as never);
  return isNil(definition) || definition.abstract ? false : definition.superClass.some(klasses => klasses.includes('widget'));
});

const nonInteractiveRoles = roleNames.filter(role => {
  const definition = roles.get(role);
  return isNil(definition) || definition.abstract ? false : (
    definition.superClass.every(klasses => !klasses.includes('widget')) && role !== 'toolbar'
  );
});

/**
 * Parses a map entry into a JSX element.
 * @param elementSymbol - Tag name, optionally with `[attr]` suffix for lookup only.
 * @param attributes - Attribute specs.
 * @returns Parsed JSX element.
 */
function elementFromMap(elementSymbol: string, attributes: AttrSpec[]): JSXElement {
  const bracketIndex = elementSymbol.indexOf('[');
  const name = bracketIndex === -1 ? elementSymbol : elementSymbol.slice(0, bracketIndex);
  return parseJSXElement(jsxElementSource(name, attributes));
}

/**
 * Human-readable element symbol for assertion messages.
 * @param openingElement - Opening element node.
 * @returns Symbol string.
 */
export function genElementSymbol(openingElement: JSXOpeningElement): string {
  const name = openingElement.name.type === 'JSXIdentifier' ? openingElement.name.name : 'unknown';
  if (openingElement.attributes.length === 0) {
    return name;
  }

  const attrs = openingElement.attributes
    .map(attr => {
      if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') {
        return '';
      }
      return hasValue(attr.value) && attr.value.type === 'Literal'
        ? `[${attr.name.name}="${String(attr.value.value)}"]`
        : `[${attr.name.name}]`;
    })
    .join('');

  return `${name}${attrs}`;
}

/**
 * Interactive DOM elements used by interactive-element util tests.
 * @returns Parsed JSX elements.
 */
export function genInteractiveElements(): JSXElement[] {
  return Object.entries(interactiveElementsMap).map(([symbol, value]) =>
    elementFromMap(symbol, value ?? []),
  );
}

/**
 * Elements with interactive roles.
 * @returns Parsed JSX elements.
 */
export function genInteractiveRoleElements(): JSXElement[] {
  return [...interactiveRoles, 'button article', 'fakerole button article'].map(value =>
    parseJSXElement(jsxElementSource('div', [{ name: 'role', value }])),
  );
}

/**
 * Non-interactive DOM elements.
 * @returns Parsed JSX elements.
 */
export function genNonInteractiveElements(): JSXElement[] {
  return Object.entries(nonInteractiveElementsMap).map(([symbol, value]) =>
    elementFromMap(symbol, value ?? []),
  );
}

/**
 * Elements with non-interactive roles.
 * @returns Parsed JSX elements.
 */
export function genNonInteractiveRoleElements(): JSXElement[] {
  return [...nonInteractiveRoles, 'article button', 'fakerole article button'].map(value =>
    parseJSXElement(jsxElementSource('div', [{ name: 'role', value }])),
  );
}

/**
 * Elements with abstract roles.
 * @returns Parsed JSX elements.
 */
export function genAbstractRoleElements(): JSXElement[] {
  return abstractRoles.map(value =>
    parseJSXElement(jsxElementSource('div', [{ name: 'role', value }])),
  );
}

/**
 * Elements with non-abstract roles.
 * @returns Parsed JSX elements.
 */
export function genNonAbstractRoleElements(): JSXElement[] {
  return nonAbstractRoles.map(value =>
    parseJSXElement(jsxElementSource('div', [{ name: 'role', value }])),
  );
}

/**
 * Elements that are neither inherently interactive nor non-interactive.
 * @returns Parsed JSX elements.
 */
export function genIndeterminantInteractiveElements(): JSXElement[] {
  return Object.entries(indeterminantInteractiveElementsMap).map(([name, value]) =>
    elementFromMap(name, value ?? []),
  );
}
