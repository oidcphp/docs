---
title: Error Handling
description: The exceptions thrown by the library and what they mean.
---

The library throws exceptions in two families, so you can tell who is at fault.

| Interface | Exception | Meaning |
| --- | --- | --- |
| `OpenIDConnect\Contracts\OAuth2Exception` | `OAuth2ClientException` | The request built by your application is invalid, for example a missing `redirect_uri` or a `state` mismatch |
| | `OAuth2ServerException` | The token or revocation endpoint returned an error, or could not be reached |
| `OpenIDConnect\Contracts\OpenIDConnectException` | `RelyingPartyException` | A check on the Relying Party side failed, for example an invalid ID Token Claim |
| | `OpenIDProviderException` | The provider returned something invalid, for example a non 2xx Discovery response or an ID Token with an invalid signature |

All of them are in the `OpenIDConnect\Exceptions` namespace and extend `RuntimeException`. `OpenIDConnectException` extends `OAuth2Exception`, so catching `OAuth2Exception` catches all four. Some invalid arguments throw PHP's `InvalidArgumentException`.

## In a callback

```php
use OpenIDConnect\Contracts\OAuth2Exception;

try {
    $tokenSet = $client->handleCallback($query, $checks);
} catch (OAuth2Exception | InvalidArgumentException $e) {
    // Do not sign the user in. Log $e->getMessage() and show a generic error.
}
```

:::caution
Do not show exception messages to the End-User. They can contain values of the request, such as the expected `state`.
:::
