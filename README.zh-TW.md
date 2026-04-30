# local-vault-sync

`local-vault-sync` 是一個 MVP（最小可行產品），目標是在同一個區域網路中，於多台裝置之間同步 Obsidian 風格的 Markdown vault。

## MVP 目標

- 維持資料 local-first（以本地資料為主）。
- 僅透過區域網路同步（不依賴雲端服務）。
- 保留純 Markdown 檔案與資料夾結構。

## 初始專案結構

- `sync-core/`：未來放置同步核心邏輯（裝置探索、差異比對、檔案傳輸、衝突處理）。
- `ui/`：未來放置使用者介面程式碼。
- `platform-adapters/`：未來放置平台相關整合層。
- `tests/`：同步核心與平台整合層的測試。

## 設定方式

此 repository 目前仍處於初始腳手架（scaffolding）階段。

1. Clone 此 repository。
2. 先閱讀 `TASKS.md`，了解 MVP 的實作步驟。
3. 在後續 issue 中加入選定的 runtime / tooling 技術棧。

## 目前狀態

本次變更僅包含 repository 結構與規劃文件。
尚未實作任何同步功能。
