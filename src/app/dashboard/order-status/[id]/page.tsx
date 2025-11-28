'use client';

import { CONFIG } from 'src/global-config';
import { UseOrderStatus } from 'src/sections/admin/order-status/hooks/use-order-status';
import { OrderStatusDetailsView } from 'src/sections/admin/order-status/view/order-status-details-view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: number };
};

export default function Page({ params }: Props) {
  const { id } = params;
  const { OneOrderStatus } = UseOrderStatus(id);
  // console.log('OneOrderStatus', OneOrderStatus);

  return <OrderStatusDetailsView order={OneOrderStatus} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
