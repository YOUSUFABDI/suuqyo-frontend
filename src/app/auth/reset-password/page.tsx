import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ResetPasswordView } from 'src/sections/auth/view/auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Reset password | ${CONFIG.appName}` };

export default function Page() {
  return <ResetPasswordView />;
}
