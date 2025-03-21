import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/shop-owner/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account general settings | Shop owner - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountGeneralView />;
}
