import { AuthGuard, RoleBasedGuard } from 'src/sections/auth/guard';
import { AccountLayout } from 'src/sections/home/account/account-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <RoleBasedGuard allowedRoles={['CUSTOMER']}>
        <AccountLayout> {children}</AccountLayout>;
      </RoleBasedGuard>
    </AuthGuard>
  );
}
