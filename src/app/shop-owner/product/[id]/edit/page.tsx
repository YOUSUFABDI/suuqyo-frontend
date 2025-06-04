'use client';

import { CONFIG } from 'src/global-config';
import { UseGetProduct } from 'src/sections/shop-owner/product/hooks';

import { ProductEditView } from 'src/sections/shop-owner/product/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const { product } = UseGetProduct(Number(id));

  return <ProductEditView product={product} />;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
