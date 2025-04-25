import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { UpdatePasswordView } from 'src/sections/auth/view/auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Update password | ${CONFIG.appName}`,
};

export default function Page() {
  return <UpdatePasswordView />;
}
