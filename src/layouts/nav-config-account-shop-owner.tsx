import { Iconify } from 'src/components/iconify';

import type { AccountDrawerProps } from './components/account-drawer';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  {
    label: 'Account settings',
    href: paths.shopOwner.account.root,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
];
