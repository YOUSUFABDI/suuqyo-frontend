import { Iconify } from 'src/components/iconify';

import type { NavMainProps } from './main/nav/types';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  {
    title: 'pages.products',
    // path: paths.customer.product.root,
    path: '/',
    icon: <Iconify width={22} icon="fluent:box-20-filled" />,
  },
  // {
  //   title: 'pages.home',
  //   // path: '/',
  //   path: paths.customer.product.root,
  //   icon: <Iconify width={22} icon="tabler:home" />,
  // },
  {
    title: 'pages.shops',
    path: paths.customer.shop.root,
    icon: <Iconify width={22} icon="material-symbols:storefront-rounded" />,
  },
  {
    title: 'pages.pricing',
    path: paths.customer.pricing,
    icon: <Iconify width={22} icon="fluent:money-20-filled" />,
  },
  {
    title: 'pages.contact',
    path: paths.customer.contact,
    icon: <Iconify width={22} icon="ic:round-support-agent" />,
  },
  {
    title: 'pages.about',
    path: paths.customer.about,
    icon: <Iconify width={22} icon="ic:round-people" />,
  },
];

// export const navData = () => {
//   const { t } = useTranslate();

//   return [
//     { title: t('title'), path: '/', icon: <Iconify width={22} icon="tabler:home" /> },
//     {
//       title: t('products'),
//       path: paths.customer.product.root,
//       icon: <Iconify width={22} icon="fluent:box-20-filled" />,
//     },
//     {
//       title: t('shops'),
//       path: paths.customer.shop.root,
//       icon: <Iconify width={22} icon="material-symbols:storefront-rounded" />,
//     },
//     {
//       title: t('pricing'),
//       path: paths.customer.pricing,
//       icon: <Iconify width={22} icon="fluent:money-20-filled" />,
//     },
//     {
//       title: t('contact'),
//       path: paths.customer.contact,
//       icon: <Iconify width={22} icon="ic:round-support-agent" />,
//     },
//     {
//       title: t('about'),
//       path: paths.customer.about,
//       icon: <Iconify width={22} icon="ic:round-people" />,
//     },
//   ];
// };
