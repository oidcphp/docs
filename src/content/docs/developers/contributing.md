---
title: Contributing
description: How the repositories work together, and how to keep this documentation up to date.
---

## Repositories

| Repository | Purpose |
| --- | --- |
| [oidcphp/core](https://github.com/oidcphp/core) | The library, `oidc/core` on Packagist |
| [oidcphp/certification](https://github.com/oidcphp/certification) | Runs the OpenID certification RP tests against `oidc/core` |
| [oidcphp/docs](https://github.com/oidcphp/docs) | This documentation |

## Keeping the documentation in sync

A pull request to `oidcphp/core` that changes the public API or user-visible behavior comes with a pull request to `oidcphp/docs`. The rule is written in the `AGENTS.md` of each repository.

The documentation describes the latest release line. Classes and methods marked `@internal` are not documented.

The documentation is written in English and Traditional Chinese. The Chinese pages live in `src/content/docs/zh-tw/` with the same paths. Update both when you change a page.

## Running the site locally

```sh title="Terminal"
npm install
npm run dev
```

The site is built with [Starlight](https://starlight.astro.build/). Pages are Markdown files in `src/content/docs/`.
