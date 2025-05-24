import { Iconify } from 'src/components/iconify';

import type { NavMainProps } from './main/nav/types';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Products',
    path: paths.customer.product.root,
    icon: <Iconify width={22} icon="maki:shop" />,
  },
  {
    title: 'Shops',
    path: paths.customer.shop.root,
    icon: <Iconify width={22} icon="maki:shop" />,
  },
];
