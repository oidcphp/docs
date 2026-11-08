---
title: 快速開始
description: 用純 PHP 以 Authorization Code Flow 讓使用者登入。
---

這一頁用 [Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth) 讓使用者登入。範例使用純 PHP 與 `$_SESSION`，讓每個步驟都看得到。使用框架時步驟相同，請見[概念](/zh-tw/concepts/overview/)。

你需要先在 Provider 註冊一個 client，並取得：

- `client_id` 與 `client_secret`
- 一個 redirect URI，這裡用 `https://app.example.com/callback.php`

## 1. 建立 client

```php title="bootstrap.php"
<?php

use GuzzleHttp\Client as GuzzleClient;
use MilesChou\Psr\Http\Client\HttpClientManager;
use OpenIDConnect\Client;
use OpenIDConnect\Config;
use OpenIDConnect\Issuer;
use OpenIDConnect\Metadata\ClientMetadata;

require __DIR__ . '/vendor/autoload.php';

session_start();

const REDIRECT_URI = 'https://app.example.com/callback.php';

$httpClient = new HttpClientManager(new GuzzleClient());

// Provider 設定的完整網址，包含 well-known 路徑
$provider = (new Issuer($httpClient))
    ->discover('https://accounts.google.com/.well-known/openid-configuration');

$clientMetadata = new ClientMetadata([
    'client_id' => getenv('OIDC_CLIENT_ID'),
    'client_secret' => getenv('OIDC_CLIENT_SECRET'),
    'redirect_uris' => [REDIRECT_URI],
]);

$client = new Client(new Config($provider, $clientMetadata), $httpClient);
```

`Issuer::discover()` 會下載 Provider 設定與它的 JSON Web Key Set（JWKS），之後用來驗證 ID Token 的簽章。

## 2. 把使用者送到 Provider

```php title="login.php"
<?php

require __DIR__ . '/bootstrap.php';

// 產生隨機的 state 與 nonce
$client->initAuthorizationParameters();

// 存起來給 callback 用，client 物件不會留到 redirect 之後
$_SESSION['oidc'] = [
    'state' => $client->getState(),
    'nonce' => $client->getNonce(),
];

$response = $client->createAuthorizeRedirectResponse([
    'redirect_uri' => REDIRECT_URI,
    'scope' => ['openid', 'profile', 'email'],
    // nonce 不會自動加入，要明確傳入
    'nonce' => $client->getNonce(),
]);

// $response 是 PSR-7 的 302 response
header('Location: ' . $response->getHeaderLine('Location'), true, 302);
```

請求會使用 `response_type=code`，沒有指定 `scope` 時使用 `scope=openid`。`state` 與 `client_id` 一定會加入。

## 3. 處理 callback

```php title="callback.php"
<?php

require __DIR__ . '/bootstrap.php';

$stored = $_SESSION['oidc'] ?? [];
unset($_SESSION['oidc']);

$tokenSet = $client->handleCallback($_GET, [
    'state' => $stored['state'] ?? null,
    'nonce' => $stored['nonce'] ?? null,
    'redirect_uri' => REDIRECT_URI,
]);

$claims = $tokenSet->idTokenClaims();

echo 'Hello, ' . $claims->sub();
```

`handleCallback()` 會：

1. 檢查 callback 的 `state` 與存下來的值相同，
2. 到 token endpoint 用 `code` 換取 token，
3. 驗證 ID Token：簽章、`iss`、`aud`、`exp`、`iat` 與 `nonce`。

任何一步失敗都會丟出例外，請見[錯誤處理](/zh-tw/guides/errors/)。

:::caution
一定要傳入存下來的 `state` 與 `nonce`。少了它們，`handleCallback()` 就無法防範 CSRF 與重送攻擊。
:::

## 下一步

- [概念](/zh-tw/concepts/overview/)：各個元件如何組合
- [處理 Callback](/zh-tw/guides/callback/)：`handleCallback()` 的細節
- [Known Issues](/zh-tw/reference/known-issues/)：目前尚未符合規範的行為
