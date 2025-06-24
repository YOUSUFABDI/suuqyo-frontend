import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { ContactView } from 'src/sections/home/contact/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Contact us - ${CONFIG.appName}` };

export default function Page() {
  return <ContactView />;
}
