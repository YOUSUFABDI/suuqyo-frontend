'use client';

import { CONFIG } from 'src/global-config';

import { UseAssignedOrders } from 'src/sections/delivery-user/assigned-deliveries/hooks';
import { AssignedDeliveryDetailsView } from 'src/sections/delivery-user/assigned-deliveries/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { assignedOrders } = UseAssignedOrders();
  const { id } = params;

  const currentAssignedOrders = assignedOrders.find((order) => Number(order.id) === Number(id));

  return <AssignedDeliveryDetailsView order={currentAssignedOrders} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
