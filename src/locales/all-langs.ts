'use client';

// core (MUI)
// NOTE: MUI does not have a built-in locale for Somali (so), so we don't import one.
// We will rely on the default English fallbacks for core components.

// date pickers (MUI)
import { enUS as enUSDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { enUS as enUSDataGrid } from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'so',
    label: 'Somali',
    countryCode: 'SO',
    adapterLocale: 'so', // Assuming you have a date-fns locale for 'so'
    numberFormat: { code: 'so-SO', currency: 'SOS' },
    // MUI does not have built-in Somali translations.
    // For full translation, you would need to create a custom locale object here.
    // The components will fall back to English by default.
    systemValue: {
      components: {},
    },
  },
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
