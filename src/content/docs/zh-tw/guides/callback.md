---
title: 處理 Callback
description: 用 handleCallback() 交換 authorization code 並驗證結果。
---

End-User 登入後，Provider 會 redirect 回你的 `redirect_uri`，query 裡帶著 `code` 與 `state`（[Core 1.0 section 3.1.2.5](https://openid.net/specs/openid-connect-core-1_0.html#AuthResponse)）。

```php
$stored = $session->pull('oidc');

$tokenSet = $client->handleCallback($request->getQueryParams(), [
    'state' => $stored['state'],
    'nonce' => $stored['nonce'],
    'redirect_uri' => 'https://app.example.com/callback',
]);
```

第一個參數是 callback 的 query。第二個參數是 redirect 之前存下的值，以及 Authentication Request 用的 `redirect_uri`。

## 執行步驟

1. **檢查 `code`。** callback 裡必須有 `code`。
2. **檢查 `state`。** callback 有 `state` 時，必須傳入存下的 `state` 而且兩者相同。傳入了存下的 `state` 時，callback 必須有 `state`。
3. **請求 token endpoint**，帶上 `grant_type=authorization_code`、`code` 與 `redirect_uri`（[RFC 6749 section 4.1.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3)），並依 [Client Authentication](/zh-tw/guides/client-authentication/) 驗證身分。
4. **驗證 ID Token**（response 裡有 ID Token 時），請見 [ID Token 驗證](/zh-tw/guides/id-token-validation/)。傳入 `nonce` 時，ID Token 必須有相同值的 `nonce` Claim。
5. 回傳 [`TokenSet`](/zh-tw/concepts/token-set/)。

## 使用相同的 redirect_uri

token request 的 `redirect_uri` 必須（MUST）與 Authentication Request 的完全相同（[RFC 6749 section 4.1.3](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.3)）。請用常數，或與 `state` 一起存起來，不要從目前的請求重新組出來。

## 用 pull，不要用 get

從 session 讀出 `state` 與 `nonce` 時就把它們移除。只能用一次的值就無法被重送。

## 錯誤回應

End-User 拒絕授權或 Provider 發生錯誤時，callback 會帶 `error` 而不是 `code`（[RFC 6749 section 4.1.2.1](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1)）。這時 `handleCallback()` 會丟出訊息為 `'code' missing from the response` 的 `InvalidArgumentException`。要顯示有用的訊息，請在呼叫前先檢查 `error`：

```php
$query = $request->getQueryParams();

if (isset($query['error'])) {
    // 確認 state 之後才能相信這個錯誤
    if (!hash_equals($stored['state'], (string)($query['state'] ?? ''))) {
        throw new RuntimeException('Invalid state');
    }

    throw new RuntimeException('Sign in failed: ' . $query['error']);
}

$tokenSet = $client->handleCallback($query, [/* ... */]);
```

## 例外

| 情況 | 例外 |
| --- | --- |
| 缺少 `code` | `InvalidArgumentException` |
| callback 有 `state`，但沒有傳入存下的 `state` | `InvalidArgumentException` |
| 缺少 `state` 或不相符 | `OAuth2ClientException` |
| token endpoint 回傳錯誤，或無法連線 | `OAuth2ServerException` |
| ID Token 簽章無效 | `OpenIDProviderException` |
| ID Token 的 Claim 無效，例如 `nonce` | `RelyingPartyException` |

請見[錯誤處理](/zh-tw/guides/errors/)。

:::caution
第二個參數只傳 `state`、`nonce` 與 `redirect_uri`。目前版本中，兩個參數裡除了 `nonce` 以外的值，都會一併送到 token endpoint，並複製到 `TokenSet`（[oidcphp/core#15](https://github.com/oidcphp/core/issues/15)）。
:::
