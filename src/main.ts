import { Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import {
  createEmptySnapshot,
  SNAPSHOT_PATH,
  type VaultSnapshot,
} from "./sync-core";
import { DEFAULT_SETTINGS, type LocalVaultSyncSettings } from "./settings";

export default class LocalVaultSyncPlugin extends Plugin {
  settings: LocalVaultSyncSettings = DEFAULT_SETTINGS;
  statusBarItem?: HTMLElement;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addSettingTab(new LocalVaultSyncSettingTab(this));

    this.statusBarItem = this.addStatusBarItem();
    this.renderStatusBar("Local sync idle");

    this.addCommand({
      id: "show-local-vault-sync-status",
      name: "Show local vault sync status",
      callback: () => {
        const snapshot = this.createCurrentVaultSnapshotStub();
        new Notice(
          `Local Vault Sync is ready. Metadata will be stored at ${SNAPSHOT_PATH}. Files tracked: ${snapshot.files.length}.`,
        );
        this.renderStatusBar("Local sync ready");
      },
    });
  }

  onunload(): void {
    this.statusBarItem = undefined;
  }

  async loadSettings(): Promise<void> {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(await this.loadData()),
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  createCurrentVaultSnapshotStub(): VaultSnapshot {
    const vaultName = this.app.vault.getName();

    return createEmptySnapshot({
      id: this.settings.vaultId || vaultName,
      name: vaultName,
      rootPath: vaultName,
      deviceId: this.settings.deviceId || undefined,
    });
  }

  renderStatusBar(label: string): void {
    this.statusBarItem?.setText(`Local Vault Sync: ${label}`);
  }
}

class LocalVaultSyncSettingTab extends PluginSettingTab {
  constructor(private readonly plugin: LocalVaultSyncPlugin) {
    super(plugin.app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Local Vault Sync" });
    containerEl.createEl("p", {
      cls: "local-vault-sync-muted",
      text: `Plugin metadata path: ${SNAPSHOT_PATH}`,
    });

    new Setting(containerEl)
      .setName("Vault ID")
      .setDesc("Stable local identifier used in sync snapshots.")
      .addText((text) =>
        text
          .setPlaceholder(this.app.vault.getName())
          .setValue(this.plugin.settings.vaultId)
          .onChange(async (value) => {
            this.plugin.settings.vaultId = value.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Device ID")
      .setDesc("Optional stable identifier for this device.")
      .addText((text) =>
        text
          .setPlaceholder("my-laptop")
          .setValue(this.plugin.settings.deviceId)
          .onChange(async (value) => {
            this.plugin.settings.deviceId = value.trim();
            await this.plugin.saveSettings();
          }),
      );
  }
}
