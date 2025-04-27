import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountChangePasswordView } from 'src/sections/user/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account change password settings | ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountChangePasswordView />;
}
