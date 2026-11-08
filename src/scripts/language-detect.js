// Redirect visitors whose browser prefers Chinese to the zh-tw pages,
// unless they chose a language with the language picker before.
(() => {
  const KEY = 'oidcphp-docs-lang';
  const ZH = '/zh-tw';

  // Remember the choice made with the language picker of Starlight
  document.addEventListener(
    'change',
    (event) => {
      const target = event.target;
      if (target instanceof HTMLSelectElement && target.closest('starlight-lang-select')) {
        try {
          localStorage.setItem(KEY, target.value.startsWith(ZH + '/') ? 'zh-tw' : 'en');
        } catch {}
      }
    },
    true,
  );

  const path = location.pathname;
  if (path === ZH || path.startsWith(ZH + '/')) return;

  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {}
  if (saved) return;

  const languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const language of languages) {
    const tag = (language || '').toLowerCase();
    if (tag.startsWith('en')) return;
    if (tag.startsWith('zh')) {
      location.replace(ZH + path + location.search + location.hash);
      return;
    }
  }
})();
