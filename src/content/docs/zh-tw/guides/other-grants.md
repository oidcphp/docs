---
title: Refresh Token 與其他 Grant
description: 用 Client::token() 搭配 refresh_token、client_credentials 與 password grant。
---

`Client::token()` 可以用任何 grant type 發出 token request。`handleCallback()` 就是用它搭配 authorization code grant。

```php
public function token(array $parameters = [], array $checks = [], ?GrantType $grant = null): array
```

它回傳解碼後的 token response 陣列。與 `handleCallback()` 不同，它不會驗證 response 裡的 ID Token。

## Refresh Token

```php
use OpenIDConnect\OAuth2\Grant\RefreshToken;

$response = $client->token([
    'refresh_token' => $tokenSet->refreshToken(),
], [], new RefreshToken());

$response['access_token'];
```

請見 [RFC 6749 section 6](https://www.rfc-editor.org/rfc/rfc6749.html#section-6) 與 [Core 1.0 section 12](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens)。要縮小 scope，可以加上 `scope`。

## Client Credentials

用於沒有 End-User 參與的服務對服務存取（[RFC 6749 section 4.4](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4)）：

```php
use OpenIDConnect\OAuth2\Grant\ClientCredentials;

$response = $client->token(['scope' => 'api.read'], [], new ClientCredentials());
```

## Resource Owner Password Credentials

```php
use OpenIDConnect\OAuth2\Grant\Password;

$response = $client->token([
    'username' => $username,
    'password' => $password,
], [], new Password());
```

:::danger
這個 grant 會讓你的應用程式拿到使用者的密碼。[OAuth 2.0 Security Best Current Practice（RFC 9700）section 2.4](https://www.rfc-editor.org/rfc/rfc9700.html#section-2.4) 規定不得（MUST NOT）使用。保留它只是為了舊系統。
:::

## 錯誤

缺少必要參數時丟出 `InvalidArgumentException`。token endpoint 回傳錯誤時丟出 `OAuth2ServerException`。
