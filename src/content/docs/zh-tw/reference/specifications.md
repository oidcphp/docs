---
title: 規範
description: oidc/core 實作的規範與實作範圍。
---

| 規範 | 狀態 |
| --- | --- |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | Authorization Code Flow、ID Token 驗證、Refresh Token |
| [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) | Provider 設定與 JWKS，請見 [Discovery](/zh-tw/guides/discovery/) |
| [OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-registration-1_0.html) | client 註冊請求，請見 [Dynamic Client Registration](/zh-tw/guides/registration/) |
| [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) | 登出請求，請見 [RP-Initiated Logout](/zh-tw/guides/logout/) |
| [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html) | authorization code、refresh token、client credentials 與 password grant。`client_secret_basic` 與 `client_secret_post` |
| [RFC 7009 - OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009.html) | 撤銷請求，請見 [Token Revocation](/zh-tw/guides/revocation/) |
| [RFC 7591 - OAuth 2.0 Dynamic Client Registration Protocol](https://www.rfc-editor.org/rfc/rfc7591.html) | Client metadata |
| [RFC 8414 - OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414.html) | Provider metadata |

尚未支援：

- Implicit Flow 與 Hybrid Flow，callback 只會從 query 讀取 `code`
- 內建的 PKCE（[RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.html)）
- `private_key_jwt` 與 `client_secret_jwt` client authentication
- 以 `Client` 方法呼叫 UserInfo Endpoint

規範符合度由 [oidcphp/certification](https://github.com/oidcphp/certification) 以 OpenID 認證的 RP 測試檢查。
