import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OrderListView } from 'src/sections/shop-owner/order/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Order list | Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <OrderListView />;
}
