---
title: 安裝
description: 安裝 oidc/core 以及它需要的 PSR 實作。
---

用 Composer 安裝：

```sh title="Terminal"
composer require oidc/core
```

## HTTP client 與 factory

`oidc/core` 需要對 Provider 發送 HTTP 請求（Discovery、token endpoint 等），所以需要 PSR-18 client 與 PSR-17 factory。函式庫不會替你挑選。

最快的做法是安裝 Guzzle，它兩者都有：

```sh title="Terminal"
composer require guzzlehttp/guzzle
```

函式庫的所有 API 都接受 `MilesChou\Psr\Http\Client\HttpClientInterface`，它同時是 PSR-18 client 與 PSR-17 factory。用 `HttpClientManager` 包裝你的 PSR-18 client：

```php
use GuzzleHttp\Client as GuzzleClient;
use MilesChou\Psr\Http\Client\HttpClientManager;

$httpClient = new HttpClientManager(new GuzzleClient());
```

`HttpClientManager` 會依序尋找 PSR-17 factory：`laminas/laminas-diactoros`、`nyholm/psr7`，最後是 `guzzlehttp/psr7`。

:::note
`MilesChou\Psr` 來自 `mileschou/psr` 套件，安裝 `oidc/core` 時會一併安裝。
:::

## JWT 函式庫

`oidc/core` 使用 `web-token/jwt-library` 驗證 JWT，安裝 `oidc/core` 時會一併安裝。`^3.3` 與 `^4.2` 都支援，所以應用程式已經使用其中任一版本時，也能安裝 `oidc/core`。

## 確認安裝

```php
require __DIR__ . '/vendor/autoload.php';

var_dump(class_exists(\OpenIDConnect\Client::class)); // bool(true)
```
