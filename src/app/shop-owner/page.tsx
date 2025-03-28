import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OverviewAnalyticsView } from 'src/sections/shop-owner/analytics/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Shop owner - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAnalyticsView />;
}
