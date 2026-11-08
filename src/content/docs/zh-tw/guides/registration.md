---
title: Dynamic Client Registration
description: 用 Issuer::register() 在 Provider 註冊 client。
---

有些 Provider 允許 client 在執行時自行註冊，定義在 [RFC 7591](https://www.rfc-editor.org/rfc/rfc7591.html) 與 [OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html)。

```php
use OpenIDConnect\Issuer;
use OpenIDConnect\Metadata\ClientMetadata;

$issuer = new Issuer($httpClient);

$providerMetadata = $issuer->discover('https://op.example.com/.well-known/openid-configuration');

$registered = $issuer->register($providerMetadata, new ClientMetadata([
    'redirect_uris' => ['https://app.example.com/callback'],
    'contacts' => ['admin@example.com'],
]));

$registered->id();     // 發出的 client_id
$registered->secret(); // 發出的 client_secret
```

`register()` 會把 client metadata 以 JSON 送到 `registration_endpoint`，回傳合併了原本 metadata 與回應內容的新 `ClientMetadata`。

請把結果存起來。每呼叫一次，Provider 就會發出一個新的 client。

```php
$storage->save('oidc.client', $registered->toArray());

// 之後
$clientMetadata = new ClientMetadata($storage->load('oidc.client'));
```

## 錯誤

| 情況 | 例外 |
| --- | --- |
| Provider 沒有 `registration_endpoint` | `OpenIDConnect\Exceptions\RelyingPartyException` |
| 回應的狀態碼不是 2xx | `OpenIDConnect\Exceptions\OpenIDProviderException` |
