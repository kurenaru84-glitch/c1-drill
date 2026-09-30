# C1 Drill

Goethe / telc C1 形式の問題をセクションごとに、スマホの隙間時間で練習できる PWA です。

## 機能

- セクション別ドリル（1問ずつ回答 → 即時フィードバック + 詳しい解説）
- 聴解はトランスクリプト + Google Cloud TTS 再生
- 進捗はブラウザの localStorage に保存

## セットアップ

```bash
cd c1-drill
npm install
cp .env.local.example .env.local   # GOOGLE_APPLICATION_CREDENTIALS_JSON を設定
npm run dev
```

`read-along` と同じ `.env.local`（Google TTS 認証）を流用できます。

## コンテンツ追加

`src/data/sections/` に TypeScript モジュールを追加し、`index.ts` に登録してください。

### Deutsch mit Schmidt（NVV）

```bash
node scripts/import-schmidt.mjs "/path/to/Deutsch mit Schmidttxt"
```

市販書籍の全文を **公開リポジトリに載せない** よう注意（個人学習・非公開デプロイ推奨）。
