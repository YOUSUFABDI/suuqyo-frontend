import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { PrivacyView } from 'src/sections/home/privacy/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Privacy note - ${CONFIG.appName}` };

export default function Page() {
  return <PrivacyView />;
}
