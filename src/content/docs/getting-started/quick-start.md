---
title: Quick Start
description: Sign a user in with the Authorization Code Flow in plain PHP.
---

This page signs a user in with the [Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth). It uses plain PHP and `$_SESSION` so that every step is visible. With a framework, the steps are the same, see [Concepts](/concepts/overview/).

You need a client registered at your provider, with:

- a `client_id` and a `client_secret`
- a redirect URI, here `https://app.example.com/callback.php`

## 1. Create the client

```php title="bootstrap.php"
<?php

use GuzzleHttp\Client as GuzzleClient;
use MilesChou\Psr\Http\Client\HttpClientManager;
use OpenIDConnect\Client;
use OpenIDConnect\Config;
use OpenIDConnect\Issuer;
use OpenIDConnect\Metadata\ClientMetadata;

require __DIR__ . '/vendor/autoload.php';

session_start();

const REDIRECT_URI = 'https://app.example.com/callback.php';

$httpClient = new HttpClientManager(new GuzzleClient());

// The full URL of the provider configuration, including the well-known path
$provider = (new Issuer($httpClient))
    ->discover('https://accounts.google.com/.well-known/openid-configuration');

$clientMetadata = new ClientMetadata([
    'client_id' => getenv('OIDC_CLIENT_ID'),
    'client_secret' => getenv('OIDC_CLIENT_SECRET'),
    'redirect_uris' => [REDIRECT_URI],
]);

$client = new Client(new Config($provider, $clientMetadata), $httpClient);
```

`Issuer::discover()` downloads the provider configuration and its JSON Web Key Set (JWKS), which is used later to verify the ID Token signature.

## 2. Send the user to the provider

```php title="login.php"
<?php

require __DIR__ . '/bootstrap.php';

// Generate a random state and nonce
$client->initAuthorizationParameters();

// Keep them for the callback, the client object does not survive the redirect
$_SESSION['oidc'] = [
    'state' => $client->getState(),
    'nonce' => $client->getNonce(),
];

$response = $client->createAuthorizeRedirectResponse([
    'redirect_uri' => REDIRECT_URI,
    'scope' => ['openid', 'profile', 'email'],
    // The nonce is not added automatically, pass it explicitly
    'nonce' => $client->getNonce(),
]);

// $response is a PSR-7 302 response
header('Location: ' . $response->getHeaderLine('Location'), true, 302);
```

The request uses `response_type=code` and, when `scope` is not given, `scope=openid`. `state` and `client_id` are always added.

## 3. Handle the callback

```php title="callback.php"
<?php

require __DIR__ . '/bootstrap.php';

$stored = $_SESSION['oidc'] ?? [];
unset($_SESSION['oidc']);

$tokenSet = $client->handleCallback($_GET, [
    'state' => $stored['state'] ?? null,
    'nonce' => $stored['nonce'] ?? null,
    'redirect_uri' => REDIRECT_URI,
]);

$claims = $tokenSet->idTokenClaims();

echo 'Hello, ' . $claims->sub();
```

`handleCallback()`:

1. checks that the `state` in the callback equals the stored one,
2. exchanges the `code` for tokens at the token endpoint,
3. validates the ID Token: signature, `iss`, `aud`, `exp`, `iat`, and `nonce`.

If anything fails, an exception is thrown, see [Error Handling](/guides/errors/).

:::caution
Always pass the stored `state` and `nonce`. Without them, `handleCallback()` cannot protect you from CSRF and replay attacks.
:::

## Next Steps

- [Concepts](/concepts/overview/): how the pieces fit together
- [Handling the Callback](/guides/callback/): the details of `handleCallback()`
- [Known Issues](/reference/known-issues/): behaviors that do not follow the specification yet
