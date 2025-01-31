import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { TransactionListView } from 'src/sections/admin/report/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Transaction list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <TransactionListView />;
}
