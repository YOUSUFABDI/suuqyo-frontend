import { AccountLayout } from 'src/sections/delivery-user/account/account-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <AccountLayout> {children}</AccountLayout>;
}
