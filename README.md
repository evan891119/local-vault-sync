# local-vault-sync

[繁體中文說明](README.zh-TW.md)

`local-vault-sync` is an Obsidian plugin-first MVP for syncing Obsidian-style Markdown vaults across devices on the same local network.

## MVP goals

- Keep vault data local-first.
- Sync only over the local network (no cloud dependency).
- Preserve plain Markdown files and folder structures.

## Project structure

- `src/main.ts` – Obsidian plugin entry point.
- `src/settings.ts` – plugin settings model.
- `src/sync-core/` – TypeScript sync-core contracts and future engine logic.
- `sync-core/` – sync-core documentation and JSON Schema contracts.
- `ui/` – future Obsidian UI components if they outgrow the plugin entry point.
- `platform-adapters/` – future platform-specific integration layers.
- `tests/` – TypeScript tests for sync core and plugin-safe logic.

## Sync metadata model

The initial sync-core data model is documented in `sync-core/README.md`.
The serializable vault snapshot schema lives in `sync-core/vault-metadata.schema.json`.
It defines vault identity, vault-relative file metadata, content hash fields, deletion tombstones, and sync state values for later scanner and diff logic.

## Setup

This repository is now scaffolded as an Obsidian plugin TypeScript project.

1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev` for watch builds or `npm run build` for a production bundle.
4. For local Obsidian development, place or symlink this repository into a vault plugin folder such as `.obsidian/plugins/local-vault-sync/`.
5. Enable the plugin in Obsidian community plugin settings.

## Scripts

- `npm run dev` – build `main.js` in watch mode.
- `npm run build` – type-check and bundle the plugin.
- `npm test` – run sync-core tests.

## Current status

The repository has the Obsidian plugin manifest, TypeScript entry point, settings skeleton, esbuild bundling, and Vitest test harness.
Scanner, hashing, sync preview, conflict detection, LAN transport, and manual sync execution are intentionally left for follow-up issues.

## Mobile support status

Mobile Obsidian plugin filesystem and networking capabilities are still a high-risk area. The DEV-21 feasibility note is documented in `docs/design/mobile-plugin-capability-validation.zh-TW.md`: the MVP should not promise full LAN sync directly inside mobile plugins until real-device probes confirm filesystem, local networking, and foreground transfer behavior.
