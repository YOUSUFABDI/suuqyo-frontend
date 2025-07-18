'use client';

import { CONFIG } from 'src/global-config';

import { useSubscription } from 'src/sections/admin/subscription/hooks';
import { SubscriptionEditView } from 'src/sections/admin/subscription/view/subscription-edit-view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;
  const { subscription } = useSubscription(Number(id));

  return <SubscriptionEditView subscription={subscription} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
