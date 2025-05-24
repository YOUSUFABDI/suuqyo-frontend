'use client';

import { CONFIG } from 'src/global-config';
import { useShopInfo } from 'src/sections/home/shop/hooks';
import { ShopDetailsView } from 'src/sections/home/shop/view';
import { deslugify } from 'src/utils/deslugify';

// ----------------------------------------------------------------------

type Props = {
  params: { slug: string };
};

export default function Page({ params }: Props) {
  const { slug } = params;
  const { shop, isLoading, errorMessage } = useShopInfo(deslugify(slug));
  console.log('shop page::', shop);

  return <ShopDetailsView shop={shop} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
