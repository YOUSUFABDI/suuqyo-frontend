import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ProductCreateView } from 'src/sections/shop-owner/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new product | Shop owner - ${CONFIG.appName}`,
};

export default function Page() {
  return <ProductCreateView />;
}
