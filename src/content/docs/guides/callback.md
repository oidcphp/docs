---
title: Handling the Callback
description: Exchange the authorization code and validate the result with handleCallback().
---

After the End-User signs in, the provider redirects back to your `redirect_uri` with `code` and `state` in the query ([Core 1.0 section 3.1.2.5](https://openid.net/specs/openid-connect-core-1_0.html#AuthResponse)).

```php
$stored = $session->pull('oidc');

$tokenSet = $client->handleCallback($request->getQueryParams(), [
    'state' => $stored['state'],
    'nonce' => $stored['nonce'],
    'redirect_uri' => 'https://app.example.com/callback',
]);
```

The first argument is the query of the callback. The second argument holds the values you stored before the redirect, and the `redirect_uri` that was used in the Authentication Request.

## What it does

1. **Checks `code`.** It must be present in the callback.
2. **Checks `state`.** When the callback has a `state`, the stored `state` must be given and equal to it. When you give a stored `state`, the callback must have one.
3. **Requests the token endpoint** with `grant_type=authorization_code`, `code` and `redirect_uri` ([RFC 6749 section 4.1.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3)), authenticated as described in [Client Authentication](/guides/client-authentication/).
4. **Validates the ID Token** when the response has one, see [ID Token Validation](/guides/id-token-validation/). When `nonce` is given, the ID Token must have a `nonce` Claim with the same value.
5. Returns a [`TokenSet`](/concepts/token-set/).

## Use the same redirect_uri

The `redirect_uri` of the token request MUST be identical to the one of the Authentication Request ([RFC 6749 section 4.1.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3)). Use a constant or store it with `state`, instead of rebuilding it from the current request.

## Pull, do not get

Remove `state` and `nonce` from the session when you read them. A value that can be used only once cannot be replayed.

## Error responses

When the End-User denies the request, or the provider fails, the callback has `error` instead of `code` ([RFC 6749 section 4.1.2.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1)). `handleCallback()` then throws `InvalidArgumentException` with `'code' missing from the response`. To show a useful message, check for `error` before calling it:

```php
$query = $request->getQueryParams();

if (isset($query['error'])) {
    // Only trust the error after checking state
    if (!hash_equals($stored['state'], (string)($query['state'] ?? ''))) {
        throw new RuntimeException('Invalid state');
    }

    throw new RuntimeException('Sign in failed: ' . $query['error']);
}

$tokenSet = $client->handleCallback($query, [/* ... */]);
```

## Exceptions

| Situation | Exception |
| --- | --- |
| `code` is missing | `InvalidArgumentException` |
| The callback has `state` but no stored `state` is given | `InvalidArgumentException` |
| `state` is missing or does not match | `OAuth2ClientException` |
| The token endpoint returns an error, or cannot be reached | `OAuth2ServerException` |
| The ID Token signature is invalid | `OpenIDProviderException` |
| An ID Token Claim is invalid, for example `nonce` | `RelyingPartyException` |

See [Error Handling](/guides/errors/).

:::caution
Only give `state`, `nonce` and `redirect_uri` as the second argument. In the current version, the values of both arguments, except `nonce`, are also sent to the token endpoint and copied into the `TokenSet` ([oidcphp/core#15](https://github.com/oidcphp/core/issues/15)).
:::
