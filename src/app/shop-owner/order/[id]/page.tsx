'use client';

import { CONFIG } from 'src/global-config';

import { UseOrders } from 'src/sections/shop-owner/order/hooks';
import { OrderDetailsView } from 'src/sections/shop-owner/order/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { orders } = UseOrders();
  const { id } = params;

  const currentOrder = orders.find((order) => Number(order.id) === Number(id));

  return <OrderDetailsView order={currentOrder} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
