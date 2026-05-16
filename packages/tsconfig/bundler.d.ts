declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';

declare module '*.scss' {
  const content: Record<string, string>;
  export = content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export = content;
}

declare module '*.less' {
  const content: Record<string, string>;
  export = content;
}
