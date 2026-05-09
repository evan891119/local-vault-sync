export const SNAPSHOT_SCHEMA_VERSION = 1;

export const METADATA_DIRECTORY = ".local-vault-sync";
export const SNAPSHOT_FILENAME = "snapshot.json";
export const SNAPSHOT_PATH = `${METADATA_DIRECTORY}/${SNAPSHOT_FILENAME}`;

export type FileKind = "markdown" | "asset" | "directory";

export type SyncState =
  | "untracked"
  | "unchanged"
  | "added"
  | "modified"
  | "deleted"
  | "conflicted"
  | "ignored";

export interface ContentHash {
  algorithm: "sha256";
  value: string;
}

export interface VaultIdentity {
  id: string;
  name: string;
  rootPath: string;
  deviceId?: string;
}

export interface FileMetadata {
  relativePath: string;
  kind: FileKind;
  sizeBytes: number;
  modifiedAt: string;
  contentHash: ContentHash | null;
  deleted: boolean;
  syncState: SyncState;
}

export interface VaultSnapshot {
  schemaVersion: typeof SNAPSHOT_SCHEMA_VERSION;
  generatedAt: string;
  vault: VaultIdentity;
  files: FileMetadata[];
}

export function isInternalMetadataPath(relativePath: string): boolean {
  return (
    relativePath === METADATA_DIRECTORY ||
    relativePath.startsWith(`${METADATA_DIRECTORY}/`)
  );
}

export function createEmptySnapshot(vault: VaultIdentity): VaultSnapshot {
  return {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    vault,
    files: [],
  };
}
