import { AccountLayout } from 'src/sections/staff/account/account-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <AccountLayout> {children}</AccountLayout>;
}
