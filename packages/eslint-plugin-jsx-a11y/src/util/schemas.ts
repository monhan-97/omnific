/**
 * JSON Schema fragments shared by rule option schemas.
 */

/**
 * JSON schema that accepts an array of unique strings.
 */
export const arraySchema = {
  type: 'array',
  items: {
    type: 'string',
  },
  uniqueItems: true,
  additionalItems: false,
} as const;

/**
 * Builds a JSON schema for an array of unique strings drawn from an enum list.
 * @param enumeratedList - Allowed string values.
 * @param minItems - Minimum number of items.
 * @returns JSON schema object.
 */
export function enumArraySchema(enumeratedList: readonly string[] = [], minItems = 0) {
  return {
    ...arraySchema,
    items: {
      type: 'string',
      enum: enumeratedList,
    },
    minItems,
  };
}

/**
 * Builds an object JSON schema with the given properties and required keys.
 * @param properties - Property schemas keyed by name.
 * @param required - Required property names.
 * @returns JSON schema object.
 */
export function generateObjSchema(
  properties: Record<string, unknown> = {},
  required?: readonly string[],
) {
  return {
    type: 'object',
    properties,
    required,
  };
}
