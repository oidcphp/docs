# AGENTS.md

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html) [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174.html) when, and only when, they appear in all capitals, as shown here.

## Purpose

This repository is the user documentation of [`oidc/core`](https://github.com/oidcphp/core), built with [Starlight](https://starlight.astro.build/) and published to GitHub Pages at https://oidcphp.oauth2.tw/ (custom domain, no base path).

## Source of truth

- The documentation MUST describe the behavior of the latest release line of `oidc/core` (currently `0.x`). Changes in open pull requests of `oidcphp/core` MUST NOT be documented before they are merged.
- Every code example MUST match the current public API. Signatures, defaults, and thrown exceptions MUST be checked against the source code of `oidcphp/core`, not guessed.
- Classes and methods marked `@internal` MUST NOT be documented as something users can depend on.
- Where `oidc/core` does not follow a specification yet, the page SHOULD say so and link the issue in `oidcphp/core`. Such gaps MUST also be listed in `src/content/docs/reference/known-issues.md`.
- When a pull request to `oidcphp/core` changes the public API or user-visible behavior, a pull request to this repository MUST update the affected pages. When an issue listed in Known Issues is fixed, the entry MUST be removed.

## Layout

| Path | Description |
| --- | --- |
| `astro.config.mjs` | Site config and sidebar. A new page MUST be added to the sidebar |
| `src/content/docs/` | English pages (default locale) |
| `src/content/docs/zh-tw/` | Traditional Chinese pages, mirroring the English paths |
| `src/scripts/language-detect.js` | Redirects to `zh-tw` by browser language, inlined into every page head |
| `src/pages/404.astro` | The 404 page, in both languages since GitHub Pages serves one `404.html` |
| `src/content/i18n/` | Overrides of the Starlight UI strings per locale |
| `public/` | Static files |

## Writing

- Every page MUST exist in both English (`src/content/docs/`) and Traditional Chinese (`src/content/docs/zh-tw/`) with the same path. A change to one MUST be made to the other in the same pull request.
- Chinese pages MUST use Taiwanese terms, and MUST put a space between CJK characters and half-width letters or digits. Specification terms such as Relying Party, End-User, Authentication Request, and Claim stay in English. Internal links MUST point to `/zh-tw/...` pages.
- Visitors whose browser prefers Chinese are redirected to `zh-tw` by `src/scripts/language-detect.js`, unless they picked a language with the language picker.
- Each page SHOULD start with a short paragraph, then use H2 sections. Prefer code examples over prose.
- Specification terms MUST follow the specification, such as Relying Party, OpenID Provider, End-User, Authentication Request, and Claim.
- Specifications MUST be linked to the section anchor. RFCs MUST be linked to `https://www.rfc-editor.org/rfc/rfcNNNN.html#section-X.Y`, and `tools.ietf.org` MUST NOT be used.
- Internal links MUST be absolute paths from the site root, such as `/guides/callback/`.
- Files MUST end with a single newline.

## Commands

```sh
npm install
npm run dev
npm run build   # MUST pass before committing
```

- Commit messages, issues, and pull requests MUST be written in English.
