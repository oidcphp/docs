---
title: Discovery
description: 用 Issuer::discover() 讀取 OpenID Provider 的設定。
---

[OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig) 讓 client 從 well-known 網址讀取 Provider 設定。

```php
use OpenIDConnect\Issuer;

$issuer = new Issuer($httpClient);

$providerMetadata = $issuer->discover('https://accounts.google.com/.well-known/openid-configuration');

$providerMetadata->get('authorization_endpoint');
$providerMetadata->jwkSet()->toArray(); // 來自 jwks_uri 的金鑰
```

`discover()` 會發出兩個請求：

1. `GET` 傳入的網址，解碼 Provider 設定。
2. `GET` 設定裡的 `jwks_uri`，把金鑰存在 `ProviderMetadata::jwkSet()`。

## 傳入完整網址

`discover()` 會直接請求傳入的網址，不會在 Issuer Identifier 後面加上 `/.well-known/openid-configuration`。

```php
// 正確
$issuer->discover('https://op.example.com/.well-known/openid-configuration');

// 錯誤：會直接請求 https://op.example.com
$issuer->discover('https://op.example.com');
```

請見 [oidcphp/core#16](https://github.com/oidcphp/core/issues/16)。

## 錯誤

| 情況 | 例外 |
| --- | --- |
| 回應的狀態碼不是 2xx | `OpenIDConnect\Exceptions\OpenIDProviderException` |
| HTTP 請求失敗 | 由你的 HTTP client 丟出的 `Psr\Http\Client\ClientExceptionInterface` |

:::caution
`discover()` 目前還不會檢查設定裡的 `issuer` 是否與來源網址相符（[oidcphp/core#21](https://github.com/oidcphp/core/issues/21)）。只對你信任的 Provider 做 Discovery，而且網址要由你自己設定。
:::

## 不使用 Discovery

Provider 不支援 Discovery 時，請自己建立 `ProviderMetadata`，見 [Provider 與 Client Metadata](/zh-tw/concepts/configuration/)。
