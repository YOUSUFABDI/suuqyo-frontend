import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ShopwOwnerListView } from 'src/sections/admin/shop-owner/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Shop owner list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ShopwOwnerListView />;
}
