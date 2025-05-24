import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ShopView } from 'src/sections/home/shop/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Shops - ${CONFIG.appName}` };

export default async function Page() {
  return <ShopView />;
}
