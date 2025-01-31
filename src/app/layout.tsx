import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { CONFIG } from 'src/global-config';
import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { detectLanguage } from 'src/locales/server';
import { themeConfig, ThemeProvider } from 'src/theme';
import { primary } from 'src/theme/core/palette';

import { MotionLazy } from 'src/components/animate/motion-lazy';
import { ProgressBar } from 'src/components/progress-bar';
import { defaultSettings, SettingsDrawer, SettingsProvider } from 'src/components/settings';
import { detectSettings } from 'src/components/settings/server';
import { Snackbar } from 'src/components/snackbar';

import StoreProvider from 'src/store/store-provider';
import { RootConnectionWrapper } from 'src/layouts/root-connection-wrapper';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      lang: 'en',
      i18nLang: undefined,
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [lang, settings] = await Promise.all([detectLanguage(), detectSettings()]);

    return {
      lang: lang ?? 'en',
      i18nLang: lang ?? 'en',
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={themeConfig.defaultMode}
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
        />

        <StoreProvider>
          <I18nProvider lang={appConfig.i18nLang}>
            <SettingsProvider
              cookieSettings={appConfig.cookieSettings}
              defaultSettings={defaultSettings}
            >
              <LocalizationProvider>
                <AppRouterCacheProvider options={{ key: 'css' }}>
                  <ThemeProvider
                    defaultMode={themeConfig.defaultMode}
                    modeStorageKey={themeConfig.modeStorageKey}
                  >
                    <RootConnectionWrapper>
                      <MotionLazy>
                        <Snackbar />
                        <ProgressBar />
                        <SettingsDrawer defaultSettings={defaultSettings} />
                        {children}
                      </MotionLazy>
                    </RootConnectionWrapper>
                  </ThemeProvider>
                </AppRouterCacheProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
