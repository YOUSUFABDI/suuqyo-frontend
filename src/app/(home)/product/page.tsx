import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ProductListView } from 'src/sections/home/product/product-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Products - ${CONFIG.appName}` };

export default async function Page() {
  return <ProductListView />;
}
