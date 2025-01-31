import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SignInView } from 'src/sections/auth/view/auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign in | ${CONFIG.appName}` };

export default function Page() {
  return <SignInView />;
}
