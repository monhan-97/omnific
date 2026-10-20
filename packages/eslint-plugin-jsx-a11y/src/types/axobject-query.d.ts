/**
 * Ambient types for `axobject-query`.
 *
 * Maintained in-repo because npm has no `@types/axobject-query`.
 * Covers only the four Map-like collections used by this plugin.
 */
declare module 'axobject-query' {
  /**
  HTML concept key used by AXObject element maps.
  */
  export type AXConcept = {
    /**
    HTML element name.
    */
    name: string;
    /**
    Optional attribute constraints for the concept.
    */
    attributes?: ReadonlyArray<{
      /**
      Attribute name.
      */
      name: string;
      /**
      Attribute value when constrained.
      */
      value?: string | number | boolean;
    }>;
  };

  /**
  Role concept key used by AXObject role maps.
  */
  export type AXRoleConcept = {
    /**
    ARIA role name.
    */
    name: string;
  };

  /**
  AXObject definition entry stored in `AXObjects`.
  */
  export type AXObjectDefinition = {
    /**
    Related HTML / ARIA concepts for this AXObject.
    */
    relatedConcepts: ReadonlyArray<{
      /**
      Concept module (`HTML` or `ARIA`).
      */
      module: string;
      /**
      Related concept payload.
      */
      concept?: AXConcept | AXRoleConcept;
    }>;
    /**
    AXObject type classification.
    */
    type: string;
  };

  /**
   * Map-like collection over AXObject query tables.
   * @typeParam K - Key type.
   * @typeParam V - Value type.
   */
  export interface AXObjectMapLike<K, V> {
    /**
    Number of entries.
    */
    readonly size: number;
    /**
     * Returns the value for `key`, or `undefined` when absent.
     * @param key - Lookup key.
     */
    get(key: K): V | undefined;
    /**
     * Returns whether `key` exists.
     * @param key - Lookup key.
     */
    has(key: K): boolean;
    /**
    Iterates keys.
    */
    keys(): IteratorObject<K, undefined, unknown>;
    /**
    Iterates values.
    */
    values(): IteratorObject<V, undefined, unknown>;
    /**
    Iterates `[key, value]` pairs.
    */
    entries(): IteratorObject<[K, V], undefined, unknown>;
    /**
     * Invokes `callback` for each entry.
     * @param callback - Visitor receiving value then key.
     */
    forEach(callback: (value: V, key: K, map: AXObjectMapLike<K, V>) => void): void;
    /**
    Default iterator over entries.
    */
    [Symbol.iterator](): IteratorObject<[K, V], undefined, unknown>;
  }

  /**
  AXObject name → definition.
  */
  export const AXObjects: AXObjectMapLike<string, AXObjectDefinition>;

  /**
  HTML concept → related AXObject names.
  */
  export const elementAXObjects: AXObjectMapLike<AXConcept, readonly string[]>;

  /**
  AXObject name → related ARIA role concepts.
  */
  export const AXObjectRoles: AXObjectMapLike<string, readonly AXRoleConcept[]>;

  /**
  AXObject name → related HTML concepts.
  */
  export const AXObjectElements: AXObjectMapLike<string, readonly AXConcept[]>;
}
