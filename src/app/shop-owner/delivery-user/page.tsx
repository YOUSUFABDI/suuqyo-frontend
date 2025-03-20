import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DeliveryUserListView } from 'src/sections/shop-owner/delivery-user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Delivery list | Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <DeliveryUserListView />;
}
