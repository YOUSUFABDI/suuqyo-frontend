import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ShopCategoryListView } from 'src/sections/admin/category/shop-category/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Shop category list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ShopCategoryListView />;
}
