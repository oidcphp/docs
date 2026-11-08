---
title: RP-Initiated Logout
description: 讓使用者在 Provider 登出。
---

從你的應用程式登出，並不會讓使用者從 Provider 登出。[OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) 會把使用者送到 Provider 的 `end_session_endpoint`。

```php
$response = $client->initiateLogoutRedirectResponse([
    'id_token_hint' => $idToken,
    'post_logout_redirect_uri' => 'https://app.example.com/signed-out',
    'state' => $logoutState,
]);
```

和 Authentication Request 一樣，結果是 `302` 的 PSR-7 response。`initiateLogoutFormPostResponse()` 則會產生以 POST 送出相同參數的 HTML 表單。這個表單目前不會跳脫參數，請見 [oidcphp/core#43](https://github.com/oidcphp/core/issues/43)。

參數會原樣送出。建議使用的參數：

| 參數 | 說明 |
| --- | --- |
| `id_token_hint` | 你收到的 ID Token，讓 Provider 知道要結束哪個 session |
| `post_logout_redirect_uri` | Provider 之後要把使用者送去的位置，必須（MUST）事先註冊 |
| `state` | 會帶回 `post_logout_redirect_uri`，用來確認這次 redirect 是回應你的請求 |
| `client_id` | 識別你的 client。沒有提供 `id_token_hint` 時建議加上 |

Provider metadata 必須（MUST）有 `end_session_endpoint`。請把 ID Token 存起來（例如放在 session），才能當作 `id_token_hint` 送出。
