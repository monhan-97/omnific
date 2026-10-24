# package-publish 规范

## Purpose

定义 Omnific pnpm workspace 向 npm 发布可发布包时的命令、依赖改写与发布后校验要求，避免 `workspace:` 协议泄漏到 registry。

## Requirements

### Requirement: 必须使用 pnpm 发布

发布任意 `@omnific/*` 包时，维护者与自动化 MUST 使用 `pnpm publish`（或 `pnpm --filter <package> publish`），MUST NOT 使用 `npm publish`、`yarn npm publish` 或其他会跳过 pnpm 发布打包改写的命令。仓库内约定命令为：

```text
pnpm publish --access public --no-git-checks
```

需要一次性密码时 MUST 将 OTP 传给同一条 `pnpm publish` 命令（例如 `--otp=<code>`），MUST NOT 为了传 OTP 改回 `npm publish`。

#### Scenario: 正常发布

- **WHEN** 维护者发布某个已 bump 版本的 workspace 包
- **THEN** 实际执行的是 `pnpm publish`（可带 `--filter`）且带 `--access public`
- **AND** 不存在对该包目录执行的 `npm publish`

#### Scenario: 需要 OTP

- **WHEN** registry 要求 authenticator OTP
- **THEN** 仍使用 `pnpm publish ... --otp=<code>` 完成发布
- **AND** 不改用 `npm publish --otp`

### Requirement: 发布产物不得含有 workspace 协议

pnpm 在发布时 MUST 把 `package.json` 中 `dependencies`、`optionalDependencies`、`peerDependencies` 与 `devDependencies`（若被打入发布元数据）里的 `workspace:` 协议改写为具体版本或兼容范围。已发布到 npm 的包元数据 MUST NOT 包含 `workspace:*`、`workspace:^` 或其他 `workspace:` 字面量。

源码仓库内的 `package.json` MAY 继续使用 `workspace:*` 引用同仓库包；该约束仅作用于 registry 上的已发布元数据。

#### Scenario: 发布后检查依赖字段

- **WHEN** 某个包刚发布完成
- **THEN** `pnpm view <package>@<version> dependencies`（以及存在时的 `peerDependencies` / `optionalDependencies`）中没有任何以 `workspace:` 开头的取值

#### Scenario: 误用 npm publish 后的拒绝标准

- **WHEN** 已发布版本的依赖字段仍含有 `workspace:`
- **THEN** 该版本视为发布失败，MUST 用 `pnpm publish` 以新版本（通常为 patch）重新发布并再次校验
- **AND** MUST NOT 将含有 `workspace:` 的版本标为可用发布结果

### Requirement: 发布后确认 registry 版本

每个包发布后 MUST 用 `pnpm view <package> version`（或 `pnpm view <package>@<version>`）确认目标版本已出现在 registry。新包首次发布若短暂 404，MAY 短暂重试，但最终 MUST 在确认可见且依赖字段无 `workspace:` 后才结束发布流程。

#### Scenario: 确认最新版本

- **WHEN** 维护者完成某包的 `pnpm publish`
- **THEN** `pnpm view <package> version` 等于本次发布的版本号
- **AND** 该版本的依赖字段通过「不得含有 workspace 协议」检查
