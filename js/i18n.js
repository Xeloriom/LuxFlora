let translations = {}; // stocke les traductions globalement

export async function loadTranslations() {
  const res = await fetch('../translations.json');
  const data = await res.json();

  const lang = navigator.language.slice(0,2) || 'en'; // ex: "fr" ou "en"
  translations = data[lang] || data['en']; // fallback anglais

  return translations;
}

// Traduire un élément ou toute la page
export function translatePage(rootEl) {
  if(!translations) return;

  rootEl.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.dataset.i18n.split('.');
    let value = translations;
    keys.forEach(k => { if(value) value = value[k]; });
    if(value) el.textContent = value;
  });
}
