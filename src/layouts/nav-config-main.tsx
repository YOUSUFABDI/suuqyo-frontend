import { Iconify } from 'src/components/iconify';

import type { NavMainProps } from './main/nav/types';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Shops',
    path: paths.customer.shops.root,
    icon: <Iconify width={22} icon="maki:shop" />,
  },
];
