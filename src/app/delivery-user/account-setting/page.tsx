import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/delivery-user/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account general settings | Delivery - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountGeneralView />;
}
