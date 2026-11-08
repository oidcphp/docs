---
title: 錯誤處理
description: 函式庫會丟出的例外，以及它們代表的意思。
---

函式庫丟出的例外分成兩類，方便判斷是哪一方的問題。

| 介面 | 例外 | 意義 |
| --- | --- | --- |
| `OpenIDConnect\Contracts\OAuth2Exception` | `OAuth2ClientException` | 你的應用程式產生的請求無效，例如缺少 `redirect_uri` 或 `state` 不相符 |
| | `OAuth2ServerException` | token 或 revocation endpoint 回傳錯誤，或無法連線 |
| `OpenIDConnect\Contracts\OpenIDConnectException` | `RelyingPartyException` | Relying Party 端的檢查失敗，例如 ID Token 的 Claim 無效 |
| | `OpenIDProviderException` | Provider 回傳的內容無效，例如 Discovery 回應不是 2xx，或 ID Token 簽章無效 |

它們都在 `OpenIDConnect\Exceptions` namespace 下，並繼承 `RuntimeException`。`OpenIDConnectException` 繼承 `OAuth2Exception`，所以 catch `OAuth2Exception` 就能抓到這四種。部分無效的參數會丟出 PHP 的 `InvalidArgumentException`。

## 在 callback 中

```php
use OpenIDConnect\Contracts\OAuth2Exception;

try {
    $tokenSet = $client->handleCallback($query, $checks);
} catch (OAuth2Exception | InvalidArgumentException $e) {
    // 不要讓使用者登入。記錄 $e->getMessage()，並顯示一般性的錯誤訊息。
}
```

:::caution
不要把例外訊息顯示給 End-User。訊息裡可能含有請求的值，例如預期的 `state`。
:::
