// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

const languageDetect = readFileSync(new URL('./src/scripts/language-detect.js', import.meta.url), 'utf-8');

export default defineConfig({
  site: 'https://oidcphp.oauth2.tw',
  integrations: [
    starlight({
      title: 'oidcphp',
      description: 'OpenID Connect Relying Party library for PHP',
      // The 404 page is src/pages/404.astro, in both languages
      disable404Route: true,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/oidcphp/core' },
      ],
      head: [
        { tag: 'script', content: languageDetect },
      ],
      editLink: {
        baseUrl: 'https://github.com/oidcphp/docs/edit/main/',
      },
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        'zh-tw': { label: '繁體中文', lang: 'zh-TW' },
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: { 'zh-TW': '開始使用' },
          items: [
            'getting-started/introduction',
            'getting-started/installation',
            'getting-started/quick-start',
          ],
        },
        {
          label: 'Concepts',
          translations: { 'zh-TW': '概念' },
          items: [
            'concepts/overview',
            'concepts/configuration',
            'concepts/token-set',
          ],
        },
        {
          label: 'Guides',
          translations: { 'zh-TW': '指南' },
          items: [
            'guides/discovery',
            'guides/registration',
            'guides/authentication-request',
            'guides/callback',
            'guides/id-token-validation',
            'guides/client-authentication',
            'guides/other-grants',
            'guides/revocation',
            'guides/logout',
            'guides/errors',
          ],
        },
        {
          label: 'Reference',
          translations: { 'zh-TW': '參考' },
          items: [
            'reference/specifications',
            'reference/known-issues',
          ],
        },
        {
          label: 'Developers',
          translations: { 'zh-TW': '開發者' },
          items: [
            'developers/contributing',
          ],
        },
      ],
    }),
  ],
});
