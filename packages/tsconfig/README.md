# @omnific/tsconfig

Shared TypeScript configuration presets for Omnific packages.

## Presets

- `@omnific/tsconfig/browser.json`
- `@omnific/tsconfig/node.json`

## Notes

- `@omnific/tsconfig/browser.json` does not require extra global type packages.
- Projects that extend `@omnific/tsconfig/node.json` should install `@types/node` in the consuming workspace.
- If a preset references additional entries in `compilerOptions.types`, the consuming project is responsible for providing those packages.

## Example

```json
{
  "extends": "@omnific/tsconfig/browser.json",
  "include": ["./**/*.ts"],
  "exclude": ["./dist"]
}
```
