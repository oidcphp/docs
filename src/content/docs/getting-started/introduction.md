---
title: Introduction
description: What oidcphp is and what it implements.
---

**oidcphp** (`oidc/core` on Packagist) is a PHP library for the **Relying Party** (RP) side of [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html). Your application is the Relying Party: it sends the user to an **OpenID Provider** (OP), such as Google or your own identity server, and gets back tokens that tell who the user is.

## Philosophy

- **The specification is the source of truth.** Every MUST requirement is meant to be implemented, and a validation step is never skipped for convenience. Where the library does not follow the specification yet, the gap is listed in [Known Issues](/reference/known-issues/).
- **Security second.** When the specification leaves a choice open, the safer behavior is the default.
- **Framework agnostic.** The library only speaks [PSR-7](https://www.php-fig.org/psr/psr-7/) messages, so it fits any framework or plain PHP.

## What it does

- Reads the provider configuration with [Discovery](/guides/discovery/).
- Registers a client with [Dynamic Client Registration](/guides/registration/).
- Builds the [Authentication Request](/guides/authentication-request/) that sends the user to the provider.
- [Handles the callback](/guides/callback/), exchanges the authorization code for tokens, and [validates the ID Token](/guides/id-token-validation/).
- Refreshes and [revokes](/guides/revocation/) tokens, and starts [RP-Initiated Logout](/guides/logout/).

See [Specifications](/reference/specifications/) for the full list.

## Requirements

- PHP 8.2 or later
- A [PSR-18](https://www.php-fig.org/psr/psr-18/) HTTP client, such as Guzzle
- A [PSR-7](https://www.php-fig.org/psr/psr-7/) and [PSR-17](https://www.php-fig.org/psr/psr-17/) implementation, such as `guzzlehttp/psr7`, `laminas/laminas-diactoros` or `nyholm/psr7`

## Next Steps

- [Installation](/getting-started/installation/)
- [Quick Start](/getting-started/quick-start/)
