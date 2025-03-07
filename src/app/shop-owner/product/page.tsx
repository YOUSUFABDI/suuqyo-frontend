import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ProductListView } from 'src/sections/shop-owner/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Product list | Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <ProductListView />;
}
