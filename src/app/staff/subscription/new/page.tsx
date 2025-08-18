import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SubscriptionCreateView } from 'src/sections/admin/subscription/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new subscription | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <SubscriptionCreateView />;
}
