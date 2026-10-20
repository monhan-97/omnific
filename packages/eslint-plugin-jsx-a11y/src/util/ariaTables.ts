/**
 * Shared ARIA / AXObject lookup tables derived once from `aria-query` /
 * `axobject-query`. Kept here so interactive / non-interactive helpers do not
 * rebuild identical Sets and schema lists.
 */

import { hasValue } from '@omnific/utils';
import { elementRoles, roles } from 'aria-query';
import type { ARIARoleDefinitionKey, ARIARoleRelationConcept } from 'aria-query';
import { AXObjects, elementAXObjects } from 'axobject-query';

import type { BaseAttribute } from './attributesComparator';

/**
 * Element concept schema from aria-query / axobject-query.
 */
export type ElementSchema = {
  /** Element / concept name. */
  name: string;
  /** Optional attribute constraints. */
  attributes?: readonly BaseAttribute[];
};

type RoleName = ARIARoleDefinitionKey;

/**
 * All concrete role keys from aria-query.
 */
export const roleKeys = roles.keys() as RoleName[];

const elementRoleEntries = [
  ...(elementRoles as unknown as Iterable<[ARIARoleRelationConcept, readonly RoleName[]]>),
] as Array<[ElementSchema, readonly RoleName[]]>;

/**
 * Returns whether a concrete role descends from `widget`.
 * @param name - Role name.
 * @returns `true` when the role is a non-abstract widget descendant.
 */
function descendsFromWidget(name: RoleName): boolean {
  const role = roles.get(name);
  return hasValue(role) && !role.abstract && role.superClass.some(classes => classes.includes('widget'));
}

/**
 * Returns whether a concrete role does not descend from `widget`.
 * @param name - Role name.
 * @returns `true` when the role is non-abstract and non-widget.
 */
function doesNotDescendFromWidget(name: RoleName): boolean {
  const role = roles.get(name);
  return hasValue(role) && !role.abstract && role.superClass.every(classes => !classes.includes('widget'));
}

/**
 * Builds a role set from a predicate plus optional extras.
 * @param predicate - Filter over `roleKeys`.
 * @param extras - Roles forced into the set (e.g. toolbar / progressbar quirks).
 * @returns Role set.
 */
function roleSet(predicate: (name: RoleName) => boolean, extras: readonly RoleName[] = []): Set<RoleName> {
  return new Set([...roleKeys.filter(name => predicate(name)), ...extras]);
}

/**
 * Roles for `isInteractiveRole` (widget descendants + toolbar).
 * `progressbar` stays included because it descends from widget.
 */
export const interactiveRolesForRoleAttr = roleSet(descendsFromWidget, ['toolbar']);

/**
 * Roles for `isNonInteractiveRole` (non-widget only; no element special cases).
 */
export const nonInteractiveRolesForRoleAttr = roleSet(doesNotDescendFromWidget);

// Element-schema role sets: progressbar is treated as non-interactive in practice;
// toolbar is treated as interactive despite not descending from widget;
// generic is excluded for non-interactive element matching.
// @see https://www.w3.org/TR/wai-aria-1.2/#generic
const interactiveRolesForInteractiveElement = roleSet(
  name => name !== 'progressbar' && descendsFromWidget(name),
  ['toolbar'],
);

const nonInteractiveRolesForInteractiveElement = roleSet(
  name => name !== 'toolbar' && doesNotDescendFromWidget(name),
  ['progressbar'],
);

const interactiveRolesForNonInteractiveElement = roleSet(
  name => name !== 'progressbar' && name !== 'generic' && descendsFromWidget(name),
  ['toolbar'],
);

const nonInteractiveRolesForNonInteractiveElement = roleSet(
  name => name !== 'toolbar' && name !== 'generic' && doesNotDescendFromWidget(name),
  ['progressbar'],
);

/**
 * Indexes element schemas by `name` for O(1) tag lookups.
 * @param schemas - Flat schema list.
 * @returns Map from element name to matching schemas.
 */
function indexByName(schemas: readonly ElementSchema[]): Map<string, ElementSchema[]> {
  const map = new Map<string, ElementSchema[]>();
  for (const schema of schemas) {
    const list = map.get(schema.name);
    if (hasValue(list)) {
      list.push(schema);
    } else {
      map.set(schema.name, [schema]);
    }
  }
  return map;
}

/**
 * Collects element schemas whose role list matches `test`.
 * @param roleNames - Candidate role set.
 * @param test - `some` or `every` membership check.
 * @returns Matching schemas.
 */
function elementSchemasForRoles(
  roleNames: Set<RoleName>,
  test: 'some' | 'every',
): ElementSchema[] {
  return elementRoleEntries.flatMap(([schema, rolesArr]) =>
    rolesArr[test](role => roleNames.has(role)) ? [schema] : [],
  );
}

/**
 * Collects AXObject element schemas whose AX list is covered by `axNames`.
 * @param axNames - Candidate AXObject name set.
 * @returns Matching schemas.
 */
function axObjectSchemas(axNames: Set<string>): ElementSchema[] {
  return [...elementAXObjects].flatMap(([schema, axList]) =>
    axList.every(role => axNames.has(role)) ? [schema as ElementSchema] : [],
  );
}

const interactiveAXObjects = new Set(
  AXObjects.keys().filter(name => {
    const axObject = AXObjects.get(name);
    return hasValue(axObject) && axObject.type === 'widget';
  }),
);

const nonInteractiveAXObjects = new Set(
  AXObjects.keys().filter(name => {
    const axObject = AXObjects.get(name);
    return hasValue(axObject) && (axObject.type === 'window' || axObject.type === 'structure');
  }),
);

/** `isInteractiveElement`: interactive elementRoles schemas by tag. */
export const interactiveElementRoleSchemasByNameForIE = indexByName(
  elementSchemasForRoles(interactiveRolesForInteractiveElement, 'some'),
);

/** `isInteractiveElement`: non-interactive elementRoles schemas by tag. */
export const nonInteractiveElementRoleSchemasByNameForIE = indexByName(
  elementSchemasForRoles(nonInteractiveRolesForInteractiveElement, 'every'),
);

/** `isInteractiveElement`: interactive AXObject schemas by tag. */
export const interactiveElementAXObjectSchemasByName = indexByName(axObjectSchemas(interactiveAXObjects));

/** `isNonInteractiveElement`: interactive elementRoles schemas by tag. */
export const interactiveElementRoleSchemasByNameForNIE = indexByName(
  elementSchemasForRoles(interactiveRolesForNonInteractiveElement, 'some'),
);

/** `isNonInteractiveElement`: non-interactive elementRoles schemas by tag. */
export const nonInteractiveElementRoleSchemasByNameForNIE = indexByName(
  elementSchemasForRoles(nonInteractiveRolesForNonInteractiveElement, 'every'),
);

/** `isNonInteractiveElement`: non-interactive AXObject schemas by tag. */
export const nonInteractiveElementAXObjectSchemasByName = indexByName(
  axObjectSchemas(nonInteractiveAXObjects),
);
