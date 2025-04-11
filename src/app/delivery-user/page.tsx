import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OverviewAnalyticsView } from 'src/sections/delivery-user/analytics/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Delivery analytics- ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAnalyticsView />;
}
