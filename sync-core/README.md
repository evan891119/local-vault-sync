# sync-core

`sync-core` contains the local-first sync model and future sync engine logic for `local-vault-sync`.

## Vault Metadata

The MVP metadata format is defined in [`vault-metadata.schema.json`](vault-metadata.schema.json).
It describes one scanned vault snapshot and is intentionally independent from UI and platform adapters.

Recommended local storage path:

```text
.local-vault-sync/snapshot.json
```

The `.local-vault-sync/` directory is internal application state and should not be synced as vault content.

## Snapshot Shape

A vault snapshot contains:

- `schemaVersion`: currently `1`.
- `generatedAt`: UTC timestamp for the scan.
- `vault`: stable vault identity and local root path.
- `files`: vault-relative file metadata entries.

Each file entry records:

- `relativePath`: POSIX-style path relative to the vault root.
- `kind`: `markdown`, `asset`, or `directory`.
- `sizeBytes`: file size in bytes.
- `modifiedAt`: filesystem modified time in UTC.
- `contentHash`: SHA-256 content hash for files, or `null` when not applicable.
- `deleted`: deletion tombstone flag.
- `syncState`: `untracked`, `unchanged`, `added`, `modified`, `deleted`, `conflicted`, or `ignored`.

## MVP Limits

- This issue only defines the serializable data model.
- Scanner, hashing, diffing, sync preview, network transfer, and conflict resolution are implemented in later issues.
- Paths are stored as vault-relative paths for file entries. Absolute filesystem paths only appear in `vault.rootPath`.
