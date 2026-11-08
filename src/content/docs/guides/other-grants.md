---
title: Refresh Token and Other Grants
description: Use Client::token() with the refresh_token, client_credentials and password grants.
---

`Client::token()` sends a token request with any grant type. `handleCallback()` uses it with the authorization code grant.

```php
public function token(array $parameters = [], array $checks = [], ?GrantType $grant = null): array
```

It returns the decoded token response as an array. Unlike `handleCallback()`, it does not validate an ID Token in the response.

## Refresh Token

```php
use OpenIDConnect\OAuth2\Grant\RefreshToken;

$response = $client->token([
    'refresh_token' => $tokenSet->refreshToken(),
], [], new RefreshToken());

$response['access_token'];
```

See [RFC 6749 section 6](https://www.rfc-editor.org/rfc/rfc6749.html#section-6) and [Core 1.0 section 12](https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens). To request a smaller scope, add `scope`.

## Client Credentials

For machine to machine access, without an End-User ([RFC 6749 section 4.4](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4)):

```php
use OpenIDConnect\OAuth2\Grant\ClientCredentials;

$response = $client->token(['scope' => 'api.read'], [], new ClientCredentials());
```

## Resource Owner Password Credentials

```php
use OpenIDConnect\OAuth2\Grant\Password;

$response = $client->token([
    'username' => $username,
    'password' => $password,
], [], new Password());
```

:::danger
This grant gives the user's password to your application. [OAuth 2.0 Security Best Current Practice (RFC 9700) section 2.4](https://www.rfc-editor.org/rfc/rfc9700.html#section-2.4) says it MUST NOT be used. It is only kept for legacy systems.
:::

## Errors

A missing required parameter throws `InvalidArgumentException`. An error from the token endpoint throws `OAuth2ServerException`.
