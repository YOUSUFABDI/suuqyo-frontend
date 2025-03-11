import { MyShopLayout } from 'src/sections/shop-owner/shop/my-shop-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <MyShopLayout> {children}</MyShopLayout>;
}
