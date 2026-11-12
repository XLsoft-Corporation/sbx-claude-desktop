# sbx-claude-desktop

Express と `node:sqlite` で作ったベーシックな TODO アプリです。

## 必要環境

- Node.js 22.13 以上(`node:sqlite` を使用)

## 起動

```bash
npm install
npm start
```

http://localhost:3000 を開きます。`PORT` でポート、`DB_PATH` で SQLite ファイルの場所を変更できます(既定: `todos.db`)。

## API

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/api/todos` | 一覧 |
| POST | `/api/todos` | 追加(`{"title": "..."}`) |
| PATCH | `/api/todos/:id` | 更新(`title` / `done`) |
| DELETE | `/api/todos/:id` | 削除 |
