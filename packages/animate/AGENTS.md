# @omnific/animate

- 本包提供基于 WAAPI 的迷你动画能力（`useAnimate`）。
- `ValueKeyframe` 为 `string | number | null`；`ResolvedValueKeyframe` 为 `Exclude<ValueKeyframe, null>`。
- 依赖 `@omnific/hooks` 的 `useUnmount`，以及 `@omnific/utils` 谓词。
- 修改后在仓库根目录运行 `pnpm typecheck` 与 `pnpm lint:fix`；本包另有 `pnpm --filter @omnific/animate build`。
