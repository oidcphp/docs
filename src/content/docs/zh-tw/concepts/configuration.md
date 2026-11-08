---
title: Provider 與 Client Metadata
description: ProviderMetadata、ClientMetadata 與 Config。
---

`Client` 由 `Config` 建立，`Config` 包含兩組 metadata：

```php
use OpenIDConnect\Client;
use OpenIDConnect\Config;

$client = new Client(new Config($providerMetadata, $clientMetadata), $httpClient);
```

## ProviderMetadata

描述 OpenID Provider，定義在 [OpenID Connect Discovery 1.0 section 3](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata) 與 [RFC 8414 section 2](https://www.rfc-editor.org/rfc/rfc8414.html#section-2)。通常來自 [Discovery](/zh-tw/guides/discovery/)，也可以自己建立：

```php
use OpenIDConnect\Metadata\ProviderMetadata;

$providerMetadata = new ProviderMetadata(
    [
        'issuer' => 'https://op.example.com',
        'authorization_endpoint' => 'https://op.example.com/authorize',
        'token_endpoint' => 'https://op.example.com/token',
        'jwks_uri' => 'https://op.example.com/jwks',
        'id_token_signing_alg_values_supported' => ['RS256'],
    ],
    $jwks // jwks_uri 解碼後的 JSON，['keys' => [...]]
);
```

用 `get()`、`has()`、`require()` 或 camel case 方法讀取：

```php
$providerMetadata->get('token_endpoint');
$providerMetadata->tokenEndpoint();
$providerMetadata->require('issuer'); // 缺少時丟出 DomainException
```

camel case 方法在缺少該值時會丟出 `BadMethodCallException`，選填的值請用 `get()`。

會用到的值：

| Key | 用途 |
| --- | --- |
| `issuer` | ID Token 驗證（`iss`） |
| `authorization_endpoint` | Authentication Request |
| `token_endpoint` | Token request |
| `id_token_signing_alg_values_supported` | 接受的 ID Token 簽章演算法 |
| `revocation_endpoint` | [Token Revocation](/zh-tw/guides/revocation/) |
| `end_session_endpoint` | [RP-Initiated Logout](/zh-tw/guides/logout/) |
| `registration_endpoint` | [Dynamic Client Registration](/zh-tw/guides/registration/) |

## ClientMetadata

描述你的 client，定義在 [RFC 7591 section 2](https://www.rfc-editor.org/rfc/rfc7591.html#section-2)：

```php
use OpenIDConnect\Metadata\ClientMetadata;

$clientMetadata = new ClientMetadata([
    'client_id' => 'my-client',
    'client_secret' => 'my-secret',
    'redirect_uris' => ['https://app.example.com/callback'],
]);

$clientMetadata->id();     // 'my-client'
$clientMetadata->secret(); // 'my-secret'
```

`client_id` 與 `client_secret` 是必填。在伺服器上執行的 PHP 應用程式屬於 confidential client，所以函式庫一定會用 secret 向 token endpoint 驗證身分，請見 [Client Authentication](/zh-tw/guides/client-authentication/)。

## 快取 metadata

Discovery 會發出兩個 HTTP 請求。要避免每次請求都重做，可以把陣列存起來，之後再建立物件：

```php
// Discovery 之後
$cache->set('oidc.provider', [
    'metadata' => $providerMetadata->toArray(),
    'jwks' => $providerMetadata->jwkSet()->toArray(),
]);

// 之後
$cached = $cache->get('oidc.provider');
$providerMetadata = new ProviderMetadata($cached['metadata'], $cached['jwks']);
```

:::caution
Provider 會輪替簽章金鑰。快取存放較久時，遇到 ID Token 簽章驗證失敗就要重新取得。
:::
