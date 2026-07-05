const uniqueIdCounter = {
  value: 0,
};

/**
 * Generates a unique ID.
 *
 * If `prefix` is provided, the generated ID is appended to it.
 *
 * @param {string} prefix - The value to prefix the generated ID with.
 * @returns {string} Returns the unique ID.
 *
 * @example
 * uniqueId(); // '1'
 * uniqueId('contact_'); // 'contact_2'
 * uniqueId('contact_'); // 'contact_3'
 */
export function uniqueId(prefix = ''): string {
  const id = ++uniqueIdCounter.value;

  return `${prefix}${id}`;
}
