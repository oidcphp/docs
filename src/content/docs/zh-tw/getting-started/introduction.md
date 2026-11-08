---
title: 簡介
description: oidcphp 是什麼，以及實作了哪些規範。
---

**oidcphp**（Packagist 上的 `oidc/core`）是實作 [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) **Relying Party**（RP）端的 PHP 函式庫。你的應用程式就是 Relying Party：它把使用者送到 **OpenID Provider**（OP），例如 Google 或你自己的身分伺服器，再取回能證明使用者身分的 token。

## 理念

- **規範就是標準答案。** 每一條 MUST 都應該實作，也不會為了方便而省略驗證步驟。尚未符合規範的地方，都列在 [Known Issues](/zh-tw/reference/known-issues/)。
- **其次是安全性。** 規範留給實作決定的地方，預設採用較安全的行為。
- **不綁定框架。** 函式庫只使用 [PSR-7](https://www.php-fig.org/psr/psr-7/) 的訊息物件，可以用在任何框架或純 PHP。

## 功能

- 以 [Discovery](/zh-tw/guides/discovery/) 讀取 Provider 設定。
- 以 [Dynamic Client Registration](/zh-tw/guides/registration/) 註冊 client。
- 產生把使用者送到 Provider 的 [Authentication Request](/zh-tw/guides/authentication-request/)。
- [處理 callback](/zh-tw/guides/callback/)：用 authorization code 換取 token，並[驗證 ID Token](/zh-tw/guides/id-token-validation/)。
- 更新與[撤銷](/zh-tw/guides/revocation/) token，以及發起 [RP-Initiated Logout](/zh-tw/guides/logout/)。

完整清單請見[規範](/zh-tw/reference/specifications/)。

## 需求

- PHP 8.2 以上
- [PSR-18](https://www.php-fig.org/psr/psr-18/) HTTP client，例如 Guzzle
- [PSR-7](https://www.php-fig.org/psr/psr-7/) 與 [PSR-17](https://www.php-fig.org/psr/psr-17/) 的實作，例如 `guzzlehttp/psr7`、`laminas/laminas-diactoros` 或 `nyholm/psr7`

## 下一步

- [安裝](/zh-tw/getting-started/installation/)
- [快速開始](/zh-tw/getting-started/quick-start/)
