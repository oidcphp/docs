---
title: 參與貢獻
description: 各個 repo 如何搭配，以及如何讓文件保持最新。
---

## Repo

| Repo | 用途 |
| --- | --- |
| [oidcphp/core](https://github.com/oidcphp/core) | 函式庫本身，Packagist 上的 `oidc/core` |
| [oidcphp/certification](https://github.com/oidcphp/certification) | 對 `oidc/core` 執行 OpenID 認證的 RP 測試 |
| [oidcphp/docs](https://github.com/oidcphp/docs) | 這份文件 |

## 讓文件保持同步

對 `oidcphp/core` 的 pull request 如果改變了公開 API 或使用者看得到的行為，要同時對 `oidcphp/docs` 開 pull request。這條規則寫在各 repo 的 `AGENTS.md`。

文件描述的是最新的 release 版本。標記為 `@internal` 的類別與方法不會寫進文件。

文件以英文為主，繁體中文翻譯放在 `src/content/docs/zh-tw/`，路徑與英文頁面相同。修改英文頁面時，請一併更新對應的中文頁面。

## 在本機執行

```sh title="Terminal"
npm install
npm run dev
```

網站使用 [Starlight](https://starlight.astro.build/) 建置，頁面是 `src/content/docs/` 下的 Markdown 檔案。
