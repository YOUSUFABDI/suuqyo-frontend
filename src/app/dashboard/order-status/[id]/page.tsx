'use client';

import { CONFIG } from 'src/global-config';
// import { OrderStatusDetailsView } from 'src/sections/admin/order-status/view';

import { UseOrders } from 'src/sections/shop-owner/order/hooks';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { orders } = UseOrders();
  const { id } = params;

  const currentOrder = orders.find((order) => Number(order.id) === Number(id));

  return <div></div>;
  // return <OrderStatusDetailsView order={currentOrder} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
