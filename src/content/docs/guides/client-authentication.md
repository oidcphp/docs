---
title: Client Authentication
description: Authenticate to the token and revocation endpoints.
---

The token endpoint and the revocation endpoint require the client to authenticate ([RFC 6749 section 2.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)). The library uses `client_id` and `client_secret` of the client metadata.

## client_secret_basic (default)

The credentials are sent in the `Authorization` header with HTTP Basic authentication ([RFC 6749 section 2.3.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3.1)). Nothing needs to be configured.

## client_secret_post

The credentials are sent in the request body:

```php
use OpenIDConnect\Http\Authentication\ClientSecretPost;

$client->setClientAuthentication(new ClientSecretPost(
    $clientMetadata->id(),
    $clientMetadata->secret(),
));
```

Use the method your client registered as `token_endpoint_auth_method`, and that the provider lists in `token_endpoint_auth_methods_supported`.

## Custom methods

Implement `OpenIDConnect\Contracts\ClientAuthentication`. It receives the PSR-7 request and returns the authenticated request:

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

`client_id` and `client_secret` are still required in the client metadata, even with a custom method.

`private_key_jwt` and `client_secret_jwt` ([Core 1.0 section 9](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)) are not provided yet.
