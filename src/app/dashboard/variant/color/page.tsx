import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ColorListView } from 'src/sections/admin/variant/color/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Color list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ColorListView />;
}
