---
title: Authentication Request
description: 把使用者送到 authorization endpoint。
---

[Authentication Request](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) 是加上 OpenID Connect 擴充的 OAuth 2.0 Authorization Request。函式庫會把它產生成 PSR-7 response，由你回傳給瀏覽器。

## Redirect

```php
$client->initAuthorizationParameters();

$session->put('oidc', [
    'state' => $client->getState(),
    'nonce' => $client->getNonce(),
]);

$response = $client->createAuthorizeRedirectResponse([
    'redirect_uri' => 'https://app.example.com/callback',
    'scope' => ['openid', 'profile', 'email'],
    'nonce' => $client->getNonce(),
]);
```

結果是 `302` response，`Location` header 指向 Provider 的 `authorization_endpoint`。從 controller 回傳它，或自己輸出。

## Form post

`createAuthorizeFormPostResponse()` 接受相同的參數，回傳 `200` response，內容是把參數 POST 到 authorization endpoint 的 HTML 表單（[Core 1.0 section 3.1.2.1](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) 允許 `GET` 與 `POST`）。

```php
$response = $client->createAuthorizeFormPostResponse([
    'redirect_uri' => 'https://app.example.com/callback',
    'nonce' => $client->getNonce(),
]);
```

:::danger
目前產生的 HTML 不會跳脫參數（[oidcphp/core#43](https://github.com/oidcphp/core/issues/43)）。修正之前，不要把使用者輸入當成參數傳入，或改用 redirect 版本。
:::

## 參數

| 參數 | 行為 |
| --- | --- |
| `redirect_uri` | 必填。缺少時丟出 `OAuth2ClientException` |
| `scope` | 字串或陣列。預設為 `openid` |
| `response_type` | 預設為 `code` |
| `state` | 一律設為 `getState()` |
| `client_id` | 一律從 client metadata 取得 |
| `nonce` | 不會自動加入，請傳入 `getNonce()` |

其他參數會原樣送出，例如 [Core 1.0 section 3.1.2.1](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) 的選填參數：

```php
$response = $client->createAuthorizeRedirectResponse([
    'redirect_uri' => 'https://app.example.com/callback',
    'nonce' => $client->getNonce(),
    'prompt' => 'login',
    'max_age' => 3600,
    'ui_locales' => 'zh-TW en',
    'login_hint' => 'user@example.com',
]);
```

## state 與 nonce

`initAuthorizationParameters()` 會產生 32 個十六進位字元的隨機 `state` 與 `nonce`。也可以自己指定：

```php
$client->initAuthorizationParameters([
    'state' => $myState,
    'nonce' => $myNonce,
]);
```

自己指定的值必須（MUST）無法被猜到。`state` 保護 callback 不受 CSRF 攻擊（[RFC 6749 section 10.12](https://www.rfc-editor.org/rfc/rfc6749.html#section-10.12)），`nonce` 把 ID Token 綁定到這次請求（[Core 1.0 section 15.5.2](https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes)）。

:::note
`createAuthorize*Response()` 內部也會呼叫 `initAuthorizationParameters()`，所以參數裡的 `state` 或 `nonce` 也會生效。不過還是請先呼叫 `initAuthorizationParameters()`，才能在產生 response 之前把值存起來。
:::
