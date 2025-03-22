'use client';

import { CONFIG } from 'src/global-config';

import { UseDeliveryUsers } from 'src/sections/shop-owner/delivery-user/hooks';
import { DeliveryUserEditView } from 'src/sections/shop-owner/delivery-user/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { deliveryUsers } = UseDeliveryUsers();
  const { id } = params;

  const currentUser = deliveryUsers.find((user) => Number(user.userId) === Number(id));

  return <DeliveryUserEditView user={currentUser} />;
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
