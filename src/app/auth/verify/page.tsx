import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { VerifyView } from 'src/sections/auth/view/auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Verify | Account - ${CONFIG.appName}` };

export default function Page() {
  return <VerifyView />;
}
