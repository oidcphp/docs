---
title: ID Token 驗證
description: 函式庫會檢查 ID Token 的哪些項目。
---

`handleCallback()` 會依 [Core 1.0 section 3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) 的規則驗證 ID Token 後才回傳。你不需要自己呼叫 verifier。

## 檢查項目

| 項目 | 規則 |
| --- | --- |
| 簽章 | 用 Provider JWKS 裡的金鑰驗證。只接受 Provider metadata 的 `id_token_signing_alg_values_supported` 列出的演算法 |
| `iss` | 必須（MUST）與 Provider metadata 的 `issuer` 完全相同（step 2） |
| `aud` | 必須（MUST）包含你的 `client_id`（step 3） |
| `exp` | 目前時間必須（MUST）早於它（step 9） |
| `iat` | 不得（MUST NOT）晚於目前時間，容許 clock tolerance 的誤差（step 10） |
| `nonce` | 有傳入 `nonce` 給 `handleCallback()` 時，Claim 必須（MUST）存在且相同（step 11） |
| 必要的 Claim | `iss`、`sub`、`aud`、`exp` 與 `iat` 必須（MUST）存在 |

## Clock tolerance

伺服器之間的時鐘不會完全同步。`exp` 與 `iat` 預設容許 10 秒誤差。要調整的話：

```php
$client->setClockTolerance(30); // 秒
```

## 未簽章的 ID Token

`alg=none` 的 ID Token 一律會被拒絕，即使 client 註冊時指定了 `id_token_signed_response_alg=none`（[oidcphp/core#14](https://github.com/oidcphp/core/issues/14)）。
