'use client';

import { Box } from '@mui/material';
import { CONFIG } from 'src/global-config';

import { UseShopOwners } from 'src/sections/admin/shop-owner/hooks';
// import { ShopOwnerEditView } from 'src/sections/admin/shop-owner/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { shopOwners } = UseShopOwners();
  const { id } = params;

  const currentUser = shopOwners.find((user) => Number(user.id) === Number(id));

  // return <ShopOwnerEditView user={currentUser} />;
  return <Box>edit</Box>;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
