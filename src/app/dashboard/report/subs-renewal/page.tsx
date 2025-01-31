import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SubscriptionRenewalListView } from 'src/sections/admin/report/subscription-renewal/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Subscription renewal list | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <SubscriptionRenewalListView />;
}
