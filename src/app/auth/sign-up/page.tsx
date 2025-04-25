import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SignUpView } from 'src/sections/auth/view/auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign up | ${CONFIG.appName}` };

export default function Page() {
  return <SignUpView />;
}
