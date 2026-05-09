export interface LocalVaultSyncSettings {
  deviceId: string;
  vaultId: string;
}

export const DEFAULT_SETTINGS: LocalVaultSyncSettings = {
  deviceId: "",
  vaultId: "",
};
