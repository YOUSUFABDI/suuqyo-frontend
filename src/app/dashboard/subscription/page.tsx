import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SubscriptionListView } from 'src/sections/admin/subscription/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Subscription list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SubscriptionListView />;
}
