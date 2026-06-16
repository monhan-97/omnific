## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## validation

After generating or modifying code, run these root commands before finishing:
- `pnpm typecheck`
- `pnpm lint:fix`

## code style

- Do not write reverse `hasValue` checks like `!hasValue(value)`. Use `isNil(value)` or a more specific predicate for nullish/absence checks.

## release

When preparing a release:

- Check whether the local package versions already exist on npm before publishing.
- Use Changesets for version bumps and changelog generation.
- Add release notes only for packages with publishable changes.
- Keep changelog entries focused on functional changes, dependency impact, or breaking changes.
- Run validation before publishing:
  - `CI=true pnpm test`
  - `pnpm build`
- Commit changes by package first, then commit shared release/tooling changes separately.
- Publish changed packages one by one with:
  - `pnpm publish --access public --no-git-checks`
- If npm requires authentication, use the interactive browser/QR flow when non-interactive OTP does not work.
- Verify published versions with:
  - `pnpm view <package> version`

## commit message shortcut

When the user types `/cm`, `cm`, or `commit msg`, treat it as:

> Generate Conventional Commit messages from the current staged changes, split commits by package when possible, then commit the staged changes package by package. Do not push.

Rules:
- Inspect `git diff --cached` and `git diff --cached --stat`.
- If there are no staged changes, inspect `git status --short` and ask the user to stage files or say whether unstaged changes should be used.
- Group staged files by `packages/<name>/...` first. Create one commit per package when a package has publishable or package-owned changes.
- Put root/shared files such as `package.json`, `pnpm-lock.yaml`, `.changeset/*`, `AGENTS.md`, root config files, and cross-package tooling changes in a separate shared/tooling commit unless they are clearly part of exactly one package change.
- Return the recommended commit messages before committing, in the order they will be created.
- Commit each group from the staged set only. Do not include unstaged changes.
- Prefer English Conventional Commits, for example `feat(request): add abort signal composition`.
- Use package scopes from directory names, for example `feat(store): ...`, `fix(request): ...`, `chore(tsconfig): ...`, or `chore(repo): ...` for shared/root-only changes.
- Include a short Chinese explanation only when it helps clarify the choice.
- Do not run `git push` unless the user explicitly asks to push.
