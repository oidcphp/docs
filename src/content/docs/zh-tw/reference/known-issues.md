---
title: Known Issues
description: 目前尚未符合規範的行為。
---

函式庫的目標是完全遵循規範。目前版本有以下不符合的行為，都已經開 issue 追蹤。

| Issue | 行為 | 目前的做法 |
| --- | --- | --- |
| [#14](https://github.com/oidcphp/core/issues/14) | `alg=none` 的 ID Token 會被拒絕，即使 client 註冊時指定了 `none` | 使用有簽章的 ID Token |
| [#15](https://github.com/oidcphp/core/issues/15) | 傳給 `handleCallback()` 的值（`nonce` 除外）會送到 token endpoint，並複製到 `TokenSet` | 只傳 `state`、`nonce` 與 `redirect_uri` |
| [#16](https://github.com/oidcphp/core/issues/16) | `Issuer::discover()` 不會加上 well-known 路徑 | 傳入完整的 `/.well-known/openid-configuration` 網址 |
| [#18](https://github.com/oidcphp/core/issues/18) | `LogoutTokenVerifier` 不會驗證 `exp` | |
| [#21](https://github.com/oidcphp/core/issues/21) | `Issuer::discover()` 不會驗證設定裡的 `issuer` | 只從你自己設定的網址對信任的 Provider 做 Discovery |
| [#20](https://github.com/oidcphp/core/issues/20) | `client_secret_basic` 沒有對 credentials 做 form-urlencode | `client_id` 與 `client_secret` 避免特殊字元，或改用 `client_secret_post` |
| [#22](https://github.com/oidcphp/core/issues/22) | `client_secret_post` 會在 request body 結尾加上 NUL 字元 | |
| [#23](https://github.com/oidcphp/core/issues/23) | 表單 body 使用 RFC 3986 編碼，而不是 `application/x-www-form-urlencoded` | |
| [#43](https://github.com/oidcphp/core/issues/43) | `createAuthorizeFormPostResponse()` 與 `initiateLogoutFormPostResponse()` 產生的 HTML 沒有跳脫參數 | 改用 redirect 版本，或不要把使用者輸入當成參數 |

另外請注意：

- `initAuthorizationParameters()` 會產生 `nonce`，但不會加進 Authentication Request。請自己傳入 `'nonce' => $client->getNonce()`。
- callback 收到錯誤回應時，會丟出 `'code' missing from the response`，請見[處理 Callback](/zh-tw/guides/callback/#錯誤回應)。

所有[未解決的 issue](https://github.com/oidcphp/core/issues)。
