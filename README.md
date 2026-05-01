# local-vault-sync

[繁體中文說明](README.zh-TW.md)

`local-vault-sync` is an MVP for syncing Obsidian-style Markdown vaults across devices on the same local network.

## MVP goals

- Keep vault data local-first.
- Sync only over the local network (no cloud dependency).
- Preserve plain Markdown files and folder structures.

## Initial project structure

- `sync-core/` – future sync engine logic (discovery, diffing, transfer, conflict handling).
- `ui/` – future user interface code.
- `platform-adapters/` – future platform-specific integration layers.
- `tests/` – test suites for sync core and adapters.

## Sync metadata model

The initial sync-core data model is documented in `sync-core/README.md`.
The serializable vault snapshot schema lives in `sync-core/vault-metadata.schema.json`.
It defines vault identity, vault-relative file metadata, content hash fields, deletion tombstones, and sync state values for later scanner and diff logic.

## Setup

This repository is currently in initial scaffolding state.

1. Clone the repository.
2. Review `TASKS.md` for MVP implementation steps.
3. Add the chosen runtime/tooling stack in a follow-up issue.

## Current status

Only repository structure and planning docs are included in this change.
No sync functionality is implemented yet.
