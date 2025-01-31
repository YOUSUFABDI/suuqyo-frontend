'use client';

import { CONFIG } from 'src/global-config';

import { UseShopOwners } from 'src/sections/admin/shop-owner/hooks';
import { ShopOwnerEditView } from 'src/sections/admin/shop-owner/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { shopOwners } = UseShopOwners();
  const { id } = params;

  const currentUser = shopOwners.find((user) => Number(user.id) === Number(id));

  return <ShopOwnerEditView user={currentUser} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
