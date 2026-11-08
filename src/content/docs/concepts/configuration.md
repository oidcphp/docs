---
title: Provider and Client Metadata
description: ProviderMetadata, ClientMetadata, and Config.
---

A `Client` is built from a `Config`, which holds two sets of metadata:

```php
use OpenIDConnect\Client;
use OpenIDConnect\Config;

$client = new Client(new Config($providerMetadata, $clientMetadata), $httpClient);
```

## ProviderMetadata

Describes the OpenID Provider, as defined in [OpenID Connect Discovery 1.0 section 3](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata) and [RFC 8414 section 2](https://www.rfc-editor.org/rfc/rfc8414.html#section-2). Usually it comes from [Discovery](/guides/discovery/), but it can also be built by hand:

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
    $jwks // the decoded JSON of jwks_uri, ['keys' => [...]]
);
```

Values are read with `get()`, `has()` and `require()`, or with camel case accessors:

```php
$providerMetadata->get('token_endpoint');
$providerMetadata->tokenEndpoint();
$providerMetadata->require('issuer'); // throws DomainException when missing
```

The camel case accessors throw `BadMethodCallException` when the key is missing, so use `get()` for optional values.

Which values are used:

| Key | Used by |
| --- | --- |
| `issuer` | ID Token validation (`iss`) |
| `authorization_endpoint` | Authentication Request |
| `token_endpoint` | Token request |
| `id_token_signing_alg_values_supported` | Accepted ID Token signing algorithms |
| `revocation_endpoint` | [Token Revocation](/guides/revocation/) |
| `end_session_endpoint` | [RP-Initiated Logout](/guides/logout/) |
| `registration_endpoint` | [Dynamic Client Registration](/guides/registration/) |

## ClientMetadata

Describes your client, as defined in [RFC 7591 section 2](https://www.rfc-editor.org/rfc/rfc7591.html#section-2):

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

`client_id` and `client_secret` are required. A PHP application on a server is a confidential client, so the library always authenticates to the token endpoint with the secret, see [Client Authentication](/guides/client-authentication/).

## Caching the metadata

Discovery sends two HTTP requests. To avoid them on every request, store the arrays and build the objects again:

```php
// After discovery
$cache->set('oidc.provider', [
    'metadata' => $providerMetadata->toArray(),
    'jwks' => $providerMetadata->jwkSet()->toArray(),
]);

// Later
$cached = $cache->get('oidc.provider');
$providerMetadata = new ProviderMetadata($cached['metadata'], $cached['jwks']);
```

:::caution
Providers rotate their signing keys. When the cache lives long, refresh it when an ID Token signature cannot be verified.
:::
