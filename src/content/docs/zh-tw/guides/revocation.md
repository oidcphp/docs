---
title: Token Revocation
description: 撤銷 access token 或 refresh token。
---

`Client::revoke()` 通知 Provider 某個 token 已經不再需要（[RFC 7009](https://www.rfc-editor.org/rfc/rfc7009.html)）。使用者登出時使用。

```php
$client->revoke($tokenSet->refreshToken());

// 加上 token type hint
$client->revoke($tokenSet->accessToken(), [
    'token_type_hint' => 'access_token',
]);
```

請求會送到 Provider metadata 的 `revocation_endpoint`，並使用與 token endpoint 相同的 [client authentication](/zh-tw/guides/client-authentication/)。

回傳錯誤或 HTTP 請求失敗時，會丟出 `OAuth2ServerException`。
