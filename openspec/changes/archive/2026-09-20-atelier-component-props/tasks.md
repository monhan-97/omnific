## 1. 调整 Button 公开类型

- [x] 1.1 为 `@omnific/atelier` 添加 `@omnific/types` workspace 依赖。
- [x] 1.2 将 `ButtonProps` 改为 `Override<ComponentPropsWithRef<'button'>, ButtonOwnProps>`。

## 2. 验证

- [x] 2.1 在根目录运行 `pnpm typecheck`。
- [x] 2.2 在根目录运行 `pnpm lint:fix`。
- [x] 2.3 运行 `packages/atelier/button/__test__/Button.test.tsx`。
- [x] 2.4 运行 `graphify update .`。
