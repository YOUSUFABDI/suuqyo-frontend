import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SizeCreateView } from 'src/sections/admin/variant/size/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new size | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <SizeCreateView />;
}
