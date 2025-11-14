import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { NotificationListView } from 'src/sections/admin/notification/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Notification list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <NotificationListView />;
}
