'use client';

import { useOneProduct } from 'src/sections/home/product/hooks';

import { CONFIG } from 'src/global-config';

import { ProductShopDetailsView } from 'src/sections/home/product/product-shop-details-view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;
  const { product, isLoading } = useOneProduct(Number(id));
  // console.log('product', product);

  return <ProductShopDetailsView product={product} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
