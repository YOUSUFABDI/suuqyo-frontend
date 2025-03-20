import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { DeliveryUserCreateView } from 'src/sections/shop-owner/delivery-user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new delivery user | Shop owner - ${CONFIG.appName}`,
};

export default function Page() {
  return <DeliveryUserCreateView />;
}
