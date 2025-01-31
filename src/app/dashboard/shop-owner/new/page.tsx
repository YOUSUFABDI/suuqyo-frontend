import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ShopOwnerCreateView } from 'src/sections/admin/shop-owner/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new shop owner | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <ShopOwnerCreateView />;
}
