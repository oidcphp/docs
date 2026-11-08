---
title: 概觀
description: Authorization Code Flow，以及參與其中的類別。
---

OpenID Connect 在 OAuth 2.0 之上加了一層身分驗證。參與的角色有三個：

- **End-User**：登入的人。
- **Relying Party（RP）**：你的應用程式，也就是使用這個函式庫的一方。
- **OpenID Provider（OP）**：驗證 End-User 身分並發出 token 的伺服器。

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

| 步驟 | 對應的 API |
| --- | --- |
| 讀取 Provider 設定 | [`Issuer::discover()`](/zh-tw/guides/discovery/) |
| 2、3 | [`Client::initAuthorizationParameters()`、`Client::createAuthorizeRedirectResponse()`](/zh-tw/guides/authentication-request/) |
| 5 到 8 | [`Client::handleCallback()`](/zh-tw/guides/callback/) |

## 主要類別

| 類別 | 用途 |
| --- | --- |
| `OpenIDConnect\Issuer` | 在建立 client 之前與 Provider 溝通：Discovery 與 Dynamic Client Registration |
| `OpenIDConnect\Metadata\ProviderMetadata` | Provider 設定與它的 JWKS |
| `OpenIDConnect\Metadata\ClientMetadata` | 你的 client：`client_id`、`client_secret`、`redirect_uris` 等 |
| `OpenIDConnect\Config` | 包含一個 `ProviderMetadata` 與一個 `ClientMetadata` |
| `OpenIDConnect\Client` | 產生 Authentication Request、處理 callback、呼叫 token 與 revocation endpoint |
| `OpenIDConnect\TokenSet` | token response，包含 access token、refresh token 與 ID Token |
| `OpenIDConnect\Jwt\Claims` | 驗證過的 ID Token 裡的 Claim |

## 跨請求保存的狀態

redirect 到 Provider 之後，這次 HTTP 請求就結束了，所以第 3 步的 `Client` 物件到了第 5 步已經不在。callback 需要的值要由你的應用程式保存，通常放在 session：

- `state`：確認 callback 是回應你自己發出的請求（防範 CSRF）
- `nonce`：確認 ID Token 是為這次請求發出的（防範重送）
- 送出的 `redirect_uri`：token request 必須送出相同的值

函式庫不碰 session，這樣才能不依賴任何框架。
