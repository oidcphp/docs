---
title: Discovery
description: Read the OpenID Provider configuration with Issuer::discover().
---

[OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig) lets a client read the provider configuration from a well-known URL.

```php
use OpenIDConnect\Issuer;

$issuer = new Issuer($httpClient);

$providerMetadata = $issuer->discover('https://accounts.google.com/.well-known/openid-configuration');

$providerMetadata->get('authorization_endpoint');
$providerMetadata->jwkSet()->toArray(); // the keys from jwks_uri
```

`discover()` sends two requests:

1. `GET` the given URL, and decode the provider configuration.
2. `GET` its `jwks_uri`, and keep the keys in `ProviderMetadata::jwkSet()`.

## Pass the full URL

`discover()` requests the URL as it is. It does not append `/.well-known/openid-configuration` to an Issuer Identifier.

```php
// Correct
$issuer->discover('https://op.example.com/.well-known/openid-configuration');

// Wrong: requests https://op.example.com itself
$issuer->discover('https://op.example.com');
```

See [oidcphp/core#16](https://github.com/oidcphp/core/issues/16).

## Errors

| Situation | Exception |
| --- | --- |
| The response status is not 2xx | `OpenIDConnect\Exceptions\OpenIDProviderException` |
| The HTTP request fails | `Psr\Http\Client\ClientExceptionInterface` from your HTTP client |

:::caution
`discover()` does not check yet that the `issuer` in the configuration matches the URL it came from ([oidcphp/core#21](https://github.com/oidcphp/core/issues/21)). Only discover providers you trust, from a URL you configured yourself.
:::

## Without Discovery

When a provider does not support Discovery, build `ProviderMetadata` by hand, see [Provider and Client Metadata](/concepts/configuration/).
