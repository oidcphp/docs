---
title: Installation
description: Install oidc/core and the PSR implementations it needs.
---

Install the library with Composer:

```sh title="Terminal"
composer require oidc/core
```

## HTTP client and factories

`oidc/core` sends HTTP requests to the provider (Discovery, token endpoint, and so on), so it needs a PSR-18 client and PSR-17 factories. The library does not pick one for you.

The quickest setup is Guzzle, which brings both:

```sh title="Terminal"
composer require guzzlehttp/guzzle
```

Every API of the library takes a `MilesChou\Psr\Http\Client\HttpClientInterface`. It is one object that is both the PSR-18 client and the PSR-17 factories. Wrap your PSR-18 client with `HttpClientManager`:

```php
use GuzzleHttp\Client as GuzzleClient;
use MilesChou\Psr\Http\Client\HttpClientManager;

$httpClient = new HttpClientManager(new GuzzleClient());
```

`HttpClientManager` looks for a PSR-17 factory in this order: `laminas/laminas-diactoros`, `nyholm/psr7`, then `guzzlehttp/psr7`.

:::note
`MilesChou\Psr` comes from the `mileschou/psr` package, which is installed as a dependency of `oidc/core`.
:::

## JWT library

`oidc/core` verifies JWTs with `web-token/jwt-library`, which is installed as a dependency. Both `^3.3` and `^4.2` are supported, so `oidc/core` can be installed next to an application that already uses either version.

## Verify Installation

```php
require __DIR__ . '/vendor/autoload.php';

var_dump(class_exists(\OpenIDConnect\Client::class)); // bool(true)
```
