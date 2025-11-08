import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ProductCategoryListView } from 'src/sections/admin/category/product-category/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Product category list | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <ProductCategoryListView />;
}
