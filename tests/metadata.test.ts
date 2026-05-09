import { describe, expect, it } from "vitest";
import {
  createEmptySnapshot,
  isInternalMetadataPath,
  SNAPSHOT_PATH,
} from "../src/sync-core";

describe("metadata model", () => {
  it("creates an empty schema v1 vault snapshot", () => {
    const snapshot = createEmptySnapshot({
      id: "vault-a",
      name: "Vault A",
      rootPath: "/vault-a",
      deviceId: "device-a",
    });

    expect(snapshot.schemaVersion).toBe(1);
    expect(snapshot.vault.id).toBe("vault-a");
    expect(snapshot.files).toEqual([]);
    expect(Date.parse(snapshot.generatedAt)).not.toBeNaN();
  });

  it("identifies plugin-internal metadata paths", () => {
    expect(SNAPSHOT_PATH).toBe(".local-vault-sync/snapshot.json");
    expect(isInternalMetadataPath(".local-vault-sync")).toBe(true);
    expect(isInternalMetadataPath(".local-vault-sync/snapshot.json")).toBe(true);
    expect(isInternalMetadataPath("Notes/.local-vault-sync.md")).toBe(false);
  });
});
