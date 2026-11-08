---
title: ID Token Validation
description: What the library checks in an ID Token.
---

`handleCallback()` validates the ID Token by the rules of [Core 1.0 section 3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) before returning it. You do not need to call a verifier yourself.

## Checks

| Check | Rule |
| --- | --- |
| Signature | Verified with the keys of the provider JWKS. Only algorithms listed in `id_token_signing_alg_values_supported` of the provider metadata are accepted |
| `iss` | MUST exactly match the `issuer` of the provider metadata (step 2) |
| `aud` | MUST contain your `client_id` (step 3) |
| `exp` | The current time MUST be before it (step 9) |
| `iat` | MUST NOT be in the future, within the clock tolerance (step 10) |
| `nonce` | When a `nonce` was given to `handleCallback()`, the Claim MUST be present and equal (step 11) |
| Required Claims | `iss`, `sub`, `aud`, `exp` and `iat` MUST be present |

## Clock tolerance

Servers do not have perfectly synchronized clocks. `exp` and `iat` are checked with a tolerance of 10 seconds by default. To change it:

```php
$client->setClockTolerance(30); // seconds
```

## Unsigned ID Tokens

ID Tokens with `alg=none` are always rejected, even when the client registered `id_token_signed_response_alg=none` ([oidcphp/core#14](https://github.com/oidcphp/core/issues/14)).
