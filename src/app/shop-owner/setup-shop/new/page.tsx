import { Box } from '@mui/material';
import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

// import { ShopOwnerCreateView } from 'src/sections/admin/shop-owner/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Setup shop | Shop owner - ${CONFIG.appName}`,
};

export default function Page() {
  // return <ShopOwnerCreateView />;
  return <Box>create</Box>;
}
