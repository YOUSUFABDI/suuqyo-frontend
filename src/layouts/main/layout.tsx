'use client';

import type { Breakpoint } from '@mui/material/styles';

import { useBoolean } from 'minimal-shared/hooks';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { usePathname } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';

import { MenuButton } from '../components/menu-button';
import { SettingsButton } from '../components/settings-button';
import { SignInButton } from '../components/sign-in-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { MainSection } from '../core/main-section';
import { navData as mainNavData } from '../nav-config-main';
import { Footer, HomeFooter } from './footer';
import { NavDesktop } from './nav/desktop';
import { NavMobile } from './nav/mobile';

import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';
import type { MainSectionProps } from '../core/main-section';
import type { FooterProps } from './footer';
import type { NavMainProps } from './nav/types';
import { _account } from '../nav-config-account-main';
import { AccountDrawer } from '../components/account-drawer';
import { useAuth } from 'src/sections/auth/hooks';
import { useEffect, useState } from 'react';
import { LanguagePopover } from '../components/language-popover';
import { allLangs } from 'src/locales';
// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps['data'];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: MainLayoutProps) {
  const pathname = usePathname();
  const { authenticated, role } = useAuth();
  const [mounted, setMounted] = useState(false);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const isHomePage = pathname === '/';

  const navData = slotProps?.nav?.data ?? mainNavData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      rightArea: (
        <>
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
            })}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            {/** @slot Language popover */}
            <LanguagePopover data={allLangs} />

            {/** @slot Settings button */}
            <SettingsButton />

            {mounted && ( // Only render after hydration
              <>
                {authenticated && role === 'CUSTOMER' ? (
                  <AccountDrawer data={_account} />
                ) : (
                  <SignInButton />
                )}
              </>
            )}
          </Box>
        </>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => (
    // isHomePage ? (
    //   <HomeFooter sx={slotProps?.footer?.sx} />
    // ) : (
    //   <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />
    // );
    <HomeFooter sx={slotProps?.footer?.sx} />
  );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
