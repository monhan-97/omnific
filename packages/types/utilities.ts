/**
 * Thenable 类型
 * 表示一个值可能是普通值，也可能是一个 Promise。
 * 通常用于兼容同步或异步返回值的场景。
 */
export type Thenable<T> = T | Promise<T>;

/**
 * Nullable 类型
 * 表示一个值可以是指定类型，也可以是 null 或 undefined。
 * 常用于表示可选或可能为空的变量。
 */
export type Nullable<T> = T | null | undefined;

/**
 * AwaitedType 类型
 * 用于提取 Promise 内部的值类型。
 * 如果传入的是 Promise<T>，则返回 T；
 * 否则直接返回原类型。
 */
export type AwaitedType<T> = T extends Promise<infer U> ? U : T;

/**
 * Override 类型
 * 用于覆盖原有类型中的部分字段。
 * - 从原类型 T 中排除掉在 P 中定义的字段；
 * - 然后将 P 中的字段添加回去（即使用新的定义覆盖旧的）。
 *
 * 示例：
 * ```ts
 * type A = { name: string; age: number };
 * type B = { age: string };
 * type C = Override<A, B>; // 结果: { name: string; age: string }
 * ```
 */
export type Override<T, P = {}> = Pick<T, Exclude<keyof T, keyof P>> & P;
