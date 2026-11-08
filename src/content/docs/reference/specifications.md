---
title: Specifications
description: The specifications implemented by oidc/core, and how far.
---

| Specification | Status |
| --- | --- |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | Authorization Code Flow, ID Token validation, Refresh Token |
| [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) | Provider configuration and JWKS, see [Discovery](/guides/discovery/) |
| [OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html) | Client registration request, see [Dynamic Client Registration](/guides/registration/) |
| [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) | Logout request, see [RP-Initiated Logout](/guides/logout/) |
| [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html) | Authorization code, refresh token, client credentials and password grants. `client_secret_basic` and `client_secret_post` |
| [RFC 7009 - OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009.html) | Revocation request, see [Token Revocation](/guides/revocation/) |
| [RFC 7591 - OAuth 2.0 Dynamic Client Registration Protocol](https://www.rfc-editor.org/rfc/rfc7591.html) | Client metadata |
| [RFC 8414 - OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414.html) | Provider metadata |

Not supported yet:

- Implicit Flow and Hybrid Flow, the callback only reads `code` from the query
- PKCE ([RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.html)) as a built-in feature
- `private_key_jwt` and `client_secret_jwt` client authentication
- UserInfo Endpoint as a `Client` method

Conformance is checked against the OpenID certification RP tests in [oidcphp/certification](https://github.com/oidcphp/certification).
