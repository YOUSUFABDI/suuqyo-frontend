import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { TrashProductListView } from 'src/sections/shop-owner/product/view/trash-product-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Product trash list | Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <TrashProductListView />;
}
