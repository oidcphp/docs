---
title: TokenSet and Claims
description: Read tokens and ID Token Claims.
---

`Client::handleCallback()` returns a `TokenSet`, built from the [token response](https://www.rfc-editor.org/rfc/rfc6749.html#section-5.1).

## TokenSet

```php
$tokenSet->accessToken();  // string, throws when missing
$tokenSet->refreshToken(); // ?string
$tokenSet->expiresIn();    // ?int, lifetime of the access token in seconds
$tokenSet->scope();        // ?array<string>, the granted scopes
$tokenSet->idToken();      // ?string, the raw ID Token (JWT)
$tokenSet->idTokenClaims(); // Claims

// Any other value of the token response
$tokenSet->get('token_type');
$tokenSet->toArray();
```

## Claims

`idTokenClaims()` returns the Claims of the ID Token. When the `TokenSet` comes from `handleCallback()`, the ID Token has already been [validated](/guides/id-token-validation/).

:::caution
`idTokenClaims()` only decodes the token, it does not verify it again. Do not use it on a `TokenSet` that you built yourself from untrusted data.
:::

```php
$claims = $tokenSet->idTokenClaims();

$claims->iss();      // Issuer Identifier
$claims->sub();      // Subject Identifier, the stable ID of the user at this issuer
$claims->aud();      // Audience, string or array
$claims->exp();      // Expiration time
$claims->iat();      // Issued at
$claims->authTime(); // ?int
$claims->nonce();    // ?string
$claims->acr();      // ?string
$claims->azp();      // ?string

// Any other Claim, such as the standard Claims of the profile and email scopes
$claims->claim('email');
$claims->claim('name', 'Anonymous');
$claims->all();
```

:::tip
Identify the user by the pair of `iss` and `sub`. `sub` is only unique within one issuer, and `email` may change or be reused.
:::
