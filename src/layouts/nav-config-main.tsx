import { Iconify } from 'src/components/iconify';

import type { NavMainProps } from './main/nav/types';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="tabler:home" /> },
  {
    title: 'Products',
    path: paths.customer.product.root,
    icon: <Iconify width={22} icon="fluent:box-20-filled" />,
  },
  {
    title: 'Shops',
    path: paths.customer.shop.root,
    icon: <Iconify width={22} icon="material-symbols:storefront-rounded" />,
  },
  {
    title: 'Pricing',
    path: paths.customer.pricing,
    icon: <Iconify width={22} icon="fluent:money-20-filled" />,
  },
  {
    title: 'Contact us',
    path: paths.customer.contact,
    icon: <Iconify width={22} icon="ic:round-support-agent" />,
  },
  {
    title: 'About us',
    path: paths.customer.about,
    icon: <Iconify width={22} icon="ic:round-people" />,
  },
];
