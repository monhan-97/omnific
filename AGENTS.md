## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## commit message shortcut

When the user types `/cm`, `cm`, or `commit msg`, treat it as:

> Generate a Conventional Commit message from the current staged changes, then commit the staged changes with that message. Do not push.

Rules:
- Inspect `git diff --cached` and `git diff --cached --stat`.
- If there are no staged changes, inspect `git status --short` and ask the user to stage files or say whether unstaged changes should be used.
- Return one recommended commit message first, then run `git commit` with that message.
- Prefer English Conventional Commits, for example `feat(request): add abort signal composition`.
- Include a short Chinese explanation only when it helps clarify the choice.
- Do not run `git push` unless the user explicitly asks to push.
