# DEV-21 Obsidian Mobile Plugin 能力驗證

此文件記錄 DEV-21 的 feasibility 結論：`local-vault-sync` 是否能在 Obsidian desktop、Android、iOS plugin 內直接完成 local network sync。

## 結論

MVP 不應承諾「mobile Obsidian plugin 直接完成完整 LAN sync」。

目前可以合理採用的 MVP 邊界是：

- **Desktop Obsidian plugin-first**：作為主要可驗證執行環境。
- **Mobile Obsidian plugin 支援 vault 掃描、metadata、hash、preview 等非破壞性 sync-core 行為**：可逐步驗證。
- **LAN discovery、長時間 peer connection、背景同步、大檔傳輸**：不放進 mobile plugin MVP 承諾。
- **Mobile sync fallback**：先設計成手動觸發、短連線、使用者在前景等待，或改由 desktop/host device/companion app 承擔網路傳輸。

原因是 Obsidian plugin API 有跨平台 vault 讀寫能力，但 mobile app 執行在 Capacitor 環境，不等同 desktop Electron/Node 環境。plugin API 沒有提供內建 LAN peer discovery、背景常駐 server、Bonjour/mDNS 或長時間傳輸保證。

## 依據

本次檢查依據目前 repo 鎖定的 `obsidian` package 型別與公開 Obsidian plugin API 方向：

- `node_modules/obsidian/obsidian.d.ts` 有 `Vault` API，可列出、讀取、建立、修改 vault 內檔案。
- `node_modules/obsidian/obsidian.d.ts` 有 `DataAdapter` 介面，支援 `exists`、`stat`、`list`、`read`、`readBinary`、`write`、`writeBinary` 等檔案操作。
- `node_modules/obsidian/obsidian.d.ts` 有 `CapacitorAdapter`，標示為 mobile devices 的 vault adapter。
- `node_modules/obsidian/obsidian.d.ts` 有 `Platform.isDesktop`、`Platform.isMobile`、`Platform.isDesktopApp`、`Platform.isMobileApp` 可分辨執行環境。
- `node_modules/obsidian/obsidian.d.ts` 有 `requestUrl()`，可發 HTTP/HTTPS request，但這是 request helper，不是 LAN discovery 或 server API。

## 能力矩陣

| 能力 | Desktop Obsidian | Android Obsidian | iOS Obsidian | MVP 判斷 |
| --- | --- | --- | --- | --- |
| Plugin 載入與 command/settings UI | 支援 | 需真機驗證 | 需真機驗證 | 可做，但 mobile UI 要保守 |
| 列出 vault 檔案 | `Vault.getFiles()` / `getMarkdownFiles()` 可用 | API 型別支援，需真機驗證 | API 型別支援，需真機驗證 | 可作為 DEV-7 scanner 基礎 |
| 讀取 Markdown 內容 | `Vault.read()` / `cachedRead()` 可用 | API 型別支援，需真機驗證 | API 型別支援，需真機驗證 | 可用於 hash/change detection |
| 讀取 binary attachment | `Vault.readBinary()` 可用 | API 型別支援，需真機驗證 | API 型別支援，需真機驗證 | 可做，但大型檔案要限制 |
| 寫入 plugin state | `Plugin.saveData()` 可用 | 需真機驗證 | 需真機驗證 | 可用於 snapshot/settings，但需 probe |
| Web Crypto SHA-256 | desktop WebView 應可用 | 需真機驗證 | 需真機驗證 | hash 實作應優先用 `crypto.subtle`，避免 Node-only `crypto` |
| Node.js filesystem / `fs` | desktop Electron 可能可用但不應依賴 | 不可當成可用 | 不可當成可用 | sync-core 不依賴 Node `fs` |
| HTTP client request | `requestUrl()` 可用 | 需真機驗證 local IP / HTTP 限制 | 需真機驗證 local network permission / ATS 限制 | 只可用於短連線 probe |
| LAN discovery / mDNS / Bonjour | 無 Obsidian plugin API 保證 | 無 Obsidian plugin API 保證 | 無 Obsidian plugin API 保證 | 不放進 plugin-only MVP |
| Plugin 內開 peer server | desktop 可研究，但不是 Obsidian API 保證 | 不承諾 | 不承諾 | 不作為 MVP mobile 方案 |
| 背景同步與長時間傳輸 | desktop 可行性較高 | mobile 不承諾 | mobile 不承諾 | MVP 使用前景手動同步或 host device |

## 最小 Capability Probe 計畫

後續可新增一個 developer-only command，例如 `Run Local Vault Sync Capability Probe`，只做讀取、短寫入測試與網路短連線，不做正式同步。

Probe 應輸出 JSON 結果，方便使用者從 desktop、Android、iOS 貼回 issue。

建議欄位：

```json
{
  "platform": {
    "isDesktop": false,
    "isMobile": true,
    "isDesktopApp": false,
    "isMobileApp": true
  },
  "vault": {
    "canListFiles": true,
    "canReadMarkdown": true,
    "canReadBinary": true,
    "canSavePluginState": true
  },
  "crypto": {
    "hasSubtleCrypto": true,
    "canSha256SmallText": true
  },
  "network": {
    "canRequestHttpLocalIp": false,
    "canRequestHttpsLocalIp": false,
    "notes": "manual result"
  }
}
```

Probe 行為限制：

- 不掃描整個大型 vault；只取少量檔案。
- 不修改使用者筆記內容。
- 寫入測試只使用 plugin private data 或 `.local-vault-sync/capability-probe.json`。
- 若寫入 vault 內測試檔，必須讓使用者明確觸發，並在 UI 說明路徑。
- 網路測試只打使用者輸入的 local endpoint，例如 `http://192.168.x.x:PORT/health`。

## 對後續 Issues 的影響

### DEV-7 Vault scanner

可以繼續實作，但 scanner 應只依賴 Obsidian `Vault` / `TFile` / `TFolder` API，不使用 Node `fs`。

### DEV-8 Hash/change detection

hash 應使用 Web Crypto `crypto.subtle.digest("SHA-256", data)` 或可在 browser/WebView 執行的 fallback，不使用 Node-only `crypto`。

### DEV-9 Sync preview

可以實作成純 sync-core 邏輯。dry-run 必須不寫 vault、不更新遠端、不更新 snapshot。

### DEV-10 Conflict detection

可以實作成純 snapshot 比對。這不依賴 mobile network 能力。

### LAN sync protocol

在 mobile 能力被真機確認前，不應把 LAN sync protocol 設計成「每台 mobile 都可被 discovery、可被連入、可背景接收檔案」。

較務實的方案：

1. Desktop/host device 做 peer server 或 sync coordinator。
2. Mobile plugin 只在前景手動連到 host device。
3. 先用 explicit pairing endpoint / QR code / token，不先做 mDNS。
4. 大檔案與長時間傳輸放到 companion app 或 desktop-only MVP。

## MVP 支援範圍建議

短期 README / issue wording 應採用：

- Desktop Obsidian plugin MVP。
- Mobile plugin support is experimental until capability probe passes on real devices.
- Mobile can run safe local scan/preview logic if Obsidian APIs behave consistently.
- Full mobile LAN sync is not committed until local networking and foreground transfer behavior are verified.

不應採用：

- iOS/Android plugin 可完整自動背景同步。
- mobile plugin 可被其他裝置直接 discovery 並連入。
- plugin-only 架構一定能取代 companion app。

## 未完成真機驗證

以下仍需使用實機補證據：

- Android Obsidian 是否可穩定 `saveData()`、`Vault.readBinary()`、Web Crypto SHA-256。
- iOS Obsidian 是否可穩定 `saveData()`、`Vault.readBinary()`、Web Crypto SHA-256。
- iOS 對 local HTTP endpoint 的 permission / App Transport Security / local network prompt 行為。
- Android 對 local HTTP endpoint、不同 Wi-Fi 網段與防火牆情境的行為。
- Obsidian mobile plugin 在 app 切到背景時，中斷或暫停傳輸的實際行為。

