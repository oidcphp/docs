---
title: Dynamic Client Registration
description: Register a client at the provider with Issuer::register().
---

Some providers let a client register itself at runtime, as defined in [RFC 7591](https://www.rfc-editor.org/rfc/rfc7591.html) and [OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html).

```php
use OpenIDConnect\Issuer;
use OpenIDConnect\Metadata\ClientMetadata;

$issuer = new Issuer($httpClient);

$providerMetadata = $issuer->discover('https://op.example.com/.well-known/openid-configuration');

$registered = $issuer->register($providerMetadata, new ClientMetadata([
    'redirect_uris' => ['https://app.example.com/callback'],
    'contacts' => ['admin@example.com'],
]));

$registered->id();     // the issued client_id
$registered->secret(); // the issued client_secret
```

`register()` sends the client metadata as JSON to the `registration_endpoint`, and returns a new `ClientMetadata` that merges your metadata with the response.

Store the result. The provider issues a new client on every call.

```php
$storage->save('oidc.client', $registered->toArray());

// Later
$clientMetadata = new ClientMetadata($storage->load('oidc.client'));
```

## Errors

| Situation | Exception |
| --- | --- |
| The provider has no `registration_endpoint` | `OpenIDConnect\Exceptions\RelyingPartyException` |
| The response status is not 2xx | `OpenIDConnect\Exceptions\OpenIDProviderException` |
