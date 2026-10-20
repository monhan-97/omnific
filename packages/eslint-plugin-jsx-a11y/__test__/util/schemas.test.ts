import { describe, expect, test } from 'vitest';

import { arraySchema, enumArraySchema, generateObjSchema } from '../../src/util/schemas';

describe('schemas', () => {
  test('arraySchema', () => {
    expect(arraySchema.type).toBe('array');
    expect(arraySchema.uniqueItems).toBe(true);
  });

  test('enumArraySchema', () => {
    const schema = enumArraySchema(['a', 'b'], 1);
    expect(schema.minItems).toBe(1);
    expect(schema.items.enum).toEqual(['a', 'b']);
  });

  test('generateObjSchema', () => {
    const schema = generateObjSchema({ foo: arraySchema }, ['foo']);
    expect(schema.type).toBe('object');
    expect(schema.required).toEqual(['foo']);
  });
});
