---
title: Token Revocation
description: Revoke an access token or a refresh token.
---

`Client::revoke()` tells the provider that a token is no longer needed ([RFC 7009](https://www.rfc-editor.org/rfc/rfc7009.html)). Use it when the user signs out.

```php
$client->revoke($tokenSet->refreshToken());

// With a token type hint
$client->revoke($tokenSet->accessToken(), [
    'token_type_hint' => 'access_token',
]);
```

The request goes to the `revocation_endpoint` of the provider metadata, with the same [client authentication](/guides/client-authentication/) as the token endpoint.

An error response, or a failed HTTP request, throws `OAuth2ServerException`.
