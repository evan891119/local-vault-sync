# Codex Project Instructions

## Project

- Repository: `local-vault-sync`
- Product: local-first MVP for syncing Obsidian-style Markdown vaults across devices on the same local network.
- Linear project: `Obsidian Sync App MVP`
- Linear team: `Development`
- Linear issue prefix: `DEV-*`

## Product Scope

- Keep data local-first.
- Sync only over the local network.
- Preserve plain Markdown files and folder structure.
- Do not add cloud storage dependencies unless a later issue explicitly asks for it.
- Keep MVP issues small and focused.

## Repository Layout

- `sync-core/`: sync engine logic, including vault models, scanning, diffing, preview, and conflict detection.
- `ui/`: user-facing interface code.
- `platform-adapters/`: platform-specific filesystem and network integration.
- `tests/`: sync-core and adapter tests.
- `README.md`, `README.zh-TW.md`, and `TASKS.md`: project documentation and planning.

## Language

- Prefer Traditional Chinese for Linear issue descriptions, progress comments, user-facing planning docs, and README additions.
- English is acceptable for code identifiers, technical terms, API names, commit messages, and existing English documentation.
- When updating an existing English file, keep the surrounding style unless the task asks for Traditional Chinese.

## Linear Workflow

- Before implementing a `DEV-*` issue, read the Linear issue description, acceptance criteria, comments, status, and project context.
- Implement against the local repository using the issue scope as the boundary.
- After completing a `DEV-*` issue, leave a Linear comment summarizing:
  - implementation summary
  - main files or modules changed
  - tests or verification run
  - remaining risks, limitations, or follow-up work
- Do not automatically move the issue to Done unless the user explicitly asks.
- Do not change assignee, priority, labels, cycle, or project unless the user explicitly asks.

## Engineering Defaults

- Follow the existing repository structure.
- Keep changes scoped to the active issue.
- Prefer simple, testable sync-core logic before UI or platform-specific behavior.
- Add tests when implementing core behavior that affects data safety, change detection, sync preview, or conflict detection.
- Avoid implementing unrelated features while completing an issue.

## Safety

- Treat vault contents as user data.
- Avoid destructive file operations unless the issue explicitly requires them and tests cover the behavior.
- Dry-run or preview behavior must not write files or mutate sync state.
- Conflict detection should prevent unsafe overwrite behavior in MVP flows.
