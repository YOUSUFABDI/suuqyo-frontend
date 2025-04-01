import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AssignedDeliveryListView } from 'src/sections/delivery-user/assigned-deliveries/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Assigned delivery list | Delivery - ${CONFIG.appName}`,
};

export default function Page() {
  return <AssignedDeliveryListView />;
}
