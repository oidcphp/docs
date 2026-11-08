---
title: Client Authentication
description: 向 token endpoint 與 revocation endpoint 驗證 client 身分。
---

token endpoint 與 revocation endpoint 都要求 client 驗證身分（[RFC 6749 section 2.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)）。函式庫使用 client metadata 裡的 `client_id` 與 `client_secret`。

## client_secret_basic（預設）

credentials 以 HTTP Basic authentication 放在 `Authorization` header 送出（[RFC 6749 section 2.3.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3.1)）。不需要任何設定。

## client_secret_post

credentials 放在 request body 送出：

```php
use OpenIDConnect\Http\Authentication\ClientSecretPost;

$client->setClientAuthentication(new ClientSecretPost(
    $clientMetadata->id(),
    $clientMetadata->secret(),
));
```

請使用 client 註冊時的 `token_endpoint_auth_method`，而且是 Provider 的 `token_endpoint_auth_methods_supported` 有列出的方法。

## 自訂方法

實作 `OpenIDConnect\Contracts\ClientAuthentication`。它接收 PSR-7 request，回傳加上驗證資訊的 request：

```php
use OpenIDConnect\Contracts\ClientAuthentication;
use Psr\Http\Message\RequestInterface;

final class MyAuthentication implements ClientAuthentication
{
    public function processRequest(RequestInterface $request): RequestInterface
    {
        return $request->withHeader('Authorization', 'Bearer ...');
    }
}

$client->setClientAuthentication(new MyAuthentication());
```

即使使用自訂方法，client metadata 裡仍然必須有 `client_id` 與 `client_secret`。

目前還沒有提供 `private_key_jwt` 與 `client_secret_jwt`（[Core 1.0 section 9](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)）。
