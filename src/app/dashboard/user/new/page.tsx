import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { UserCreateView } from 'src/sections/admin/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Create a new user | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <UserCreateView />;
}
