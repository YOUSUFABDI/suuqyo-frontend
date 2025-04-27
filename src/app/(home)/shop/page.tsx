import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { getProducts } from 'src/actions/product-ssr';

import { ShopView } from 'src/sections/home/shop/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Product shop - ${CONFIG.appName}` };

export default async function Page() {
  const { products } = await getProducts();

  return <ShopView products={products} />;
}
