---
title: RP-Initiated Logout
description: Sign the user out at the provider.
---

Signing out of your application does not sign the user out of the provider. [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) sends the user to the `end_session_endpoint` of the provider.

```php
$response = $client->initiateLogoutRedirectResponse([
    'id_token_hint' => $idToken,
    'post_logout_redirect_uri' => 'https://app.example.com/signed-out',
    'state' => $logoutState,
]);
```

Like the Authentication Request, the result is a `302` PSR-7 response. `initiateLogoutFormPostResponse()` builds an HTML form that posts the same parameters instead. The form does not escape the parameters yet, see [oidcphp/core#43](https://github.com/oidcphp/core/issues/43).

The parameters are sent as they are. Recommended ones:

| Parameter | Description |
| --- | --- |
| `id_token_hint` | The ID Token you received, so that the provider knows which session to end |
| `post_logout_redirect_uri` | Where the provider sends the user afterwards. It MUST be registered |
| `state` | Returned to `post_logout_redirect_uri`, to check that the redirect answers your request |
| `client_id` | Identifies your client. Recommended when `id_token_hint` is not given |

The provider metadata MUST have `end_session_endpoint`. Keep the ID Token, for example in the session, to send it as `id_token_hint`.
