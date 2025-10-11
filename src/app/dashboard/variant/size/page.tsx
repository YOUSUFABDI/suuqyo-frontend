import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SizeListView } from 'src/sections/admin/variant/size/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Size list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SizeListView />;
}
