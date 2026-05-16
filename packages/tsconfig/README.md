# @omnific/tsconfig

Shared TypeScript configuration presets for Omnific packages.

## Presets

- `@omnific/tsconfig/node.json`
- `@omnific/tsconfig/web.json`
- `@omnific/tsconfig/bundler.json`

## Notes

- Projects that extend `@omnific/tsconfig/node.json` should install `@types/node` in the consuming workspace.
- `@omnific/tsconfig/web.json` provides Web platform globals without static asset module declarations.
- `@omnific/tsconfig/bundler.json` adds ambient declarations for static asset imports such as `*.css` and `*.svg`.
- If a preset references additional entries in `compilerOptions.types`, the consuming project is responsible for providing those packages.

## Example

```json
{
  "extends": "@omnific/tsconfig/web.json",
  "include": ["./**/*.ts"],
  "exclude": ["./dist"]
}
```
