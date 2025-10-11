import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { OrderStatusListView } from 'src/sections/admin/order-status/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Order status list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrderStatusListView />;
}
