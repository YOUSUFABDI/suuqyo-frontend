import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ShopListView } from 'src/sections/shop-owner/shop/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Shop | Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <ShopListView />;
}
