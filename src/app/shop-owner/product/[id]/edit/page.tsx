'use client';

import { CONFIG } from 'src/global-config';
import { UseProducts } from 'src/sections/shop-owner/product/hooks';

import { ProductEditView } from 'src/sections/shop-owner/product/view';
import { useGetProductsQuery } from 'src/store/shop-owner/product';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // const { product } = UseGetProduct(Number(id));
  const { products } = UseProducts();

  const currentProduct = products.find((product) => Number(product.id) === Number(id));
  console.log('currentProduct-----', currentProduct);

  return <ProductEditView product={currentProduct} />;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
