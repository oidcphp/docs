---
title: Overview
description: The Authorization Code Flow and the classes that take part in it.
---

OpenID Connect adds an identity layer on top of OAuth 2.0. Three parties take part:

- **End-User**: the person who signs in.
- **Relying Party (RP)**: your application, which uses this library.
- **OpenID Provider (OP)**: the server that authenticates the End-User and issues tokens.

## Authorization Code Flow

```
End-User          Relying Party (your app)                OpenID Provider
   |                       |                                     |
   |  1. click "Sign in"   |                                     |
   |---------------------->|                                     |
   |                       |  2. store state / nonce in session  |
   |  3. redirect to the authorization endpoint                  |
   |<----------------------|                                     |
   |------------------------------------------------------------>|
   |                       |          4. authenticate, consent   |
   |  5. redirect back with code and state                       |
   |<------------------------------------------------------------|
   |---------------------->|                                     |
   |                       |  6. token request (code)            |
   |                       |------------------------------------>|
   |                       |  7. access token, ID Token          |
   |                       |<------------------------------------|
   |                       |  8. validate state and ID Token     |
```

| Step | Library API |
| --- | --- |
| Read the provider configuration | [`Issuer::discover()`](/guides/discovery/) |
| 2, 3 | [`Client::initAuthorizationParameters()`, `Client::createAuthorizeRedirectResponse()`](/guides/authentication-request/) |
| 5 to 8 | [`Client::handleCallback()`](/guides/callback/) |

## Main classes

| Class | Role |
| --- | --- |
| `OpenIDConnect\Issuer` | Talks to the provider before a client exists: Discovery and Dynamic Client Registration |
| `OpenIDConnect\Metadata\ProviderMetadata` | The provider configuration and its JWKS |
| `OpenIDConnect\Metadata\ClientMetadata` | Your client: `client_id`, `client_secret`, `redirect_uris`, and so on |
| `OpenIDConnect\Config` | Holds one `ProviderMetadata` and one `ClientMetadata` |
| `OpenIDConnect\Client` | Builds Authentication Requests, handles callbacks, calls the token and revocation endpoints |
| `OpenIDConnect\TokenSet` | The token response, with access token, refresh token and ID Token |
| `OpenIDConnect\Jwt\Claims` | The Claims of a validated ID Token |

## State between requests

The redirect to the provider ends the HTTP request, so the `Client` object of step 3 is gone in step 5. Your application keeps what the callback needs, usually in the session:

- `state`, to check that the callback answers your own request (CSRF protection)
- `nonce`, to check that the ID Token was issued for this request (replay protection)
- the `redirect_uri` that was sent, because the token request must send the same value

The library does not touch the session. This keeps it independent of any framework.
