import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ShopView } from 'src/sections/shop-owner/account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Account change password settings | Shop owner - ${CONFIG.appName}`,
};

export default function Page() {
  return <ShopView />;
}
