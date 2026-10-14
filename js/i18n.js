/**
 * PMQ Services - i18n Translation & Bi-Directional Engine
 * Supports French (fr, default), English (en), Arabic (ar, RTL).
 */

const SUPPORTED_LANGS = ['fr', 'en', 'ar'];
const DEFAULT_LANG = 'fr';
const STORAGE_KEY = 'pmq_lang';
const PHONE_INT = '213564866940';

let translations = {};
let currentLang = DEFAULT_LANG;

/**
 * Fetch language JSON dictionary
 */
async function loadTranslation(lang) {
  try {
    const res = await fetch(`i18n/${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[i18n] Failed to load ${lang}.json:`, err);
    return null;
  }
}

/**
 * Resolve nested object key like "hero.title_part1"
 */
function getNestedValue(obj, keyPath) {
  if (!obj || !keyPath) return null;
  return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
}

/**
 * Update all DOM elements with data-i18n
 */
function applyTranslations(dict) {
  if (!dict) return;

  // Update Page Title & Description
  if (dict.meta?.title) {
    document.title = dict.meta.title;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.meta?.description) {
    metaDesc.setAttribute('content', dict.meta.description);
  }

  // Update Elements with data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(dict, key);
    if (value !== null && value !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Update Dynamic WhatsApp links with localized prefilled message
  const generalMsg = encodeURIComponent(dict.whatsapp_message?.general || 'Bonjour PMQ Services, demande de devis.');
  const productMsg = encodeURIComponent(dict.whatsapp_message?.product || 'Bonjour PMQ Services, devis thermo-hygromètres.');

  document.querySelectorAll('a[data-wa-type="general"]').forEach((link) => {
    link.href = `https://wa.me/${PHONE_INT}?text=${generalMsg}`;
  });

  document.querySelectorAll('a[data-wa-type="product"]').forEach((link) => {
    link.href = `https://wa.me/${PHONE_INT}?text=${productMsg}`;
  });

  // Update Language switcher buttons active state
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

/**
 * Switch language and apply RTL if needed
 */
export async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    /* ignore storage quota/security error */
  }

  // Update <html> & <body> lang and dir attributes
  const html = document.documentElement;
  const isRtl = lang === 'ar';
  html.setAttribute('lang', lang);
  html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  if (document.body) {
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }

  // Load translations if not cached
  if (!translations[lang]) {
    translations[lang] = await loadTranslation(lang);
  }

  applyTranslations(translations[lang]);

  // Dispatch event for other modules (simulator, animations, etc.)
  window.dispatchEvent(new CustomEvent('pmq-lang-changed', { detail: { lang } }));
}

/**
 * Initialize i18n
 * Prioritizes: 1. URL ?lang= parameter, 2. Explicitly saved user choice in localStorage, 3. Default to 'fr' (French)
 */
export async function initI18n() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryLang = urlParams.get('lang');
  let savedLang = null;
  try {
    savedLang = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* ignore */
  }

  // Always default to French ('fr') for PMQ Services
  const initialLang = (queryLang && SUPPORTED_LANGS.includes(queryLang)) 
    ? queryLang 
    : (savedLang && SUPPORTED_LANGS.includes(savedLang) ? savedLang : DEFAULT_LANG);

  // Setup click listeners for language buttons across header and mobile drawer
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== currentLang) {
        setLanguage(targetLang);
      }
    });
  });

  await setLanguage(initialLang);
}

export function getCurrentLang() {
  return currentLang;
}
