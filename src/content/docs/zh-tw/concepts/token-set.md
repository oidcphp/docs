---
title: TokenSet 與 Claims
description: 讀取 token 與 ID Token 的 Claim。
---

`Client::handleCallback()` 回傳 `TokenSet`，內容來自 [token response](https://www.rfc-editor.org/rfc/rfc6749.html#section-5.1)。

## TokenSet

```php
$tokenSet->accessToken();  // string，缺少時丟出例外
$tokenSet->refreshToken(); // ?string
$tokenSet->expiresIn();    // ?int，access token 的有效秒數
$tokenSet->scope();        // ?array<string>，取得授權的 scope
$tokenSet->idToken();      // ?string，原始的 ID Token（JWT）
$tokenSet->idTokenClaims(); // Claims

// token response 裡的其他值
$tokenSet->get('token_type');
$tokenSet->toArray();
```

## Claims

`idTokenClaims()` 回傳 ID Token 的 Claim。`TokenSet` 來自 `handleCallback()` 時，ID Token 已經[驗證過](/zh-tw/guides/id-token-validation/)。

:::caution
`idTokenClaims()` 只做解碼，不會再驗證一次。不要用在你自己從不可信資料建立的 `TokenSet` 上。
:::

```php
$claims = $tokenSet->idTokenClaims();

$claims->iss();      // Issuer Identifier
$claims->sub();      // Subject Identifier，使用者在這個 issuer 的固定 ID
$claims->aud();      // Audience，字串或陣列
$claims->exp();      // 過期時間
$claims->iat();      // 發出時間
$claims->authTime(); // ?int
$claims->nonce();    // ?string
$claims->acr();      // ?string
$claims->azp();      // ?string

// 其他 Claim，例如 profile 與 email scope 的標準 Claim
$claims->claim('email');
$claims->claim('name', 'Anonymous');
$claims->all();
```

:::tip
用 `iss` 加 `sub` 的組合識別使用者。`sub` 只在同一個 issuer 內唯一，而 `email` 可能變更或被重複使用。
:::
