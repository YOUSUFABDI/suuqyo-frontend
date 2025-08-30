// ----------------------------------------------------------------------

export const fallbackLng = 'so'; // Default language set to Somali
export const languages = ['so', 'en']; // Available languages, with Somali first
export const defaultNS = 'common';
export const cookieName = 'i18next';

export type LanguageValue = (typeof languages)[number];

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  so: {
    success: 'Luuqada waa la badalay!',
    error: 'Cilad ayaa ka dhacday bedelida luuqada!',
    loading: 'Waa la soo shubayaa...',
  },
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
};
