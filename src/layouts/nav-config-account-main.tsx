import { Iconify } from 'src/components/iconify';

import type { AccountDrawerProps } from './components/account-drawer';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  {
    label: 'General',
    href: paths.customer.account.root,
    icon: <Iconify width={24} icon="mdi:settings" />,
  },
  {
    label: 'Profile',
    href: paths.customer.account.root,
    icon: <Iconify icon="mdi:account-circle" />,
  },
  {
    label: 'Order history',
    href: paths.customer.account.orderHistory,
    icon: <Iconify width={24} icon="ic:round-history" />,
  },
  {
    label: 'Security',
    href: paths.customer.account.changePassword,
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
  },
];
