import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { MyShopView } from 'src/sections/shop-owner/shop/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `My shop | Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <MyShopView />;
}
