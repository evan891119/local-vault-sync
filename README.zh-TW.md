# local-vault-sync

`local-vault-sync` 是一個 Obsidian plugin-first MVP（最小可行產品），目標是在同一個區域網路中，於多台裝置之間同步 Obsidian 風格的 Markdown vault。

## MVP 目標

- 維持資料 local-first（以本地資料為主）。
- 僅透過區域網路同步（不依賴雲端服務）。
- 保留純 Markdown 檔案與資料夾結構。

## 專案結構

- `src/main.ts`：Obsidian plugin 入口。
- `src/settings.ts`：plugin 設定資料模型。
- `src/sync-core/`：TypeScript sync-core 契約與後續同步核心邏輯。
- `sync-core/`：sync-core 文件與 JSON Schema 契約。
- `ui/`：若後續 Obsidian UI 元件變多，可放在此處。
- `platform-adapters/`：未來放置平台相關整合層。
- `tests/`：sync-core 與 plugin-safe 邏輯的 TypeScript 測試。

## 同步中繼資料模型

初始 sync-core 資料模型記錄在 `sync-core/README.md`。
可序列化的 vault snapshot schema 位於 `sync-core/vault-metadata.schema.json`。
此 schema 定義 vault identity、vault-relative file metadata、content hash 欄位、刪除 tombstone，以及供後續掃描與差異比對使用的 sync state。

## 設定方式

此 repository 目前已建立 Obsidian plugin TypeScript 專案骨架。

1. Clone 此 repository。
2. 執行 `npm install`。
3. 開發時執行 `npm run dev`，正式建置執行 `npm run build`。
4. 本機 Obsidian 開發時，可將此 repository 放入或 symlink 到 vault 的 `.obsidian/plugins/local-vault-sync/`。
5. 在 Obsidian community plugin settings 啟用此外掛。

## 指令

- `npm run dev`：watch mode 建置 `main.js`。
- `npm run build`：型別檢查並 bundle plugin。
- `npm test`：執行 sync-core 測試。

## 目前狀態

目前已具備 Obsidian plugin manifest、TypeScript 入口、settings 骨架、esbuild bundle 設定與 Vitest 測試架構。
Vault scanner、hashing、sync preview、conflict detection、區網傳輸與手動同步執行仍保留給後續 issues。
