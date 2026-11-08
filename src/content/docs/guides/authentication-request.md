---
title: Authentication Request
description: Send the user to the authorization endpoint.
---

An [Authentication Request](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) is an OAuth 2.0 Authorization Request with OpenID Connect extensions. The library builds it as a PSR-7 response that you return to the browser.

## Redirect

```php
$client->initAuthorizationParameters();

$session->put('oidc', [
    'state' => $client->getState(),
    'nonce' => $client->getNonce(),
]);

$response = $client->createAuthorizeRedirectResponse([
    'redirect_uri' => 'https://app.example.com/callback',
    'scope' => ['openid', 'profile', 'email'],
    'nonce' => $client->getNonce(),
]);
```

The result is a `302` response with the `Location` header set to the `authorization_endpoint` of the provider. Return it from your controller, or emit it yourself.

## Form post

`createAuthorizeFormPostResponse()` takes the same parameters, and returns a `200` response with an HTML form that posts the parameters to the authorization endpoint ([Core 1.0 section 3.1.2.1](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) allows both `GET` and `POST`).

```php
$response = $client->createAuthorizeFormPostResponse([
    'redirect_uri' => 'https://app.example.com/callback',
    'nonce' => $client->getNonce(),
]);
```

:::danger
The generated HTML does not escape the parameters yet ([oidcphp/core#43](https://github.com/oidcphp/core/issues/43)). Until it is fixed, do not pass user input as a parameter, or use the redirect variant.
:::

## Parameters

| Parameter | Behavior |
| --- | --- |
| `redirect_uri` | Required. An `OAuth2ClientException` is thrown when it is missing |
| `scope` | String or array. Defaults to `openid` |
| `response_type` | Defaults to `code` |
| `state` | Always set to `getState()` |
| `client_id` | Always set from the client metadata |
| `nonce` | Not added automatically. Pass `getNonce()` |

Any other parameter is sent as it is, for example the optional parameters of [Core 1.0 section 3.1.2.1](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest):

```php
$response = $client->createAuthorizeRedirectResponse([
    'redirect_uri' => 'https://app.example.com/callback',
    'nonce' => $client->getNonce(),
    'prompt' => 'login',
    'max_age' => 3600,
    'ui_locales' => 'zh-TW en',
    'login_hint' => 'user@example.com',
]);
```

## state and nonce

`initAuthorizationParameters()` generates a random `state` and `nonce` of 32 hexadecimal characters. You can give your own values:

```php
$client->initAuthorizationParameters([
    'state' => $myState,
    'nonce' => $myNonce,
]);
```

Your own values MUST be unguessable. `state` protects the callback from CSRF ([RFC 6749 section 10.12](https://www.rfc-editor.org/rfc/rfc6749.html#section-10.12)), and `nonce` binds the ID Token to this request ([Core 1.0 section 15.5.2](https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes)).

:::note
`createAuthorize*Response()` calls `initAuthorizationParameters()` itself, so a `state` or `nonce` in its parameters is used too. Call `initAuthorizationParameters()` first anyway, so that you can store the values before building the response.
:::
