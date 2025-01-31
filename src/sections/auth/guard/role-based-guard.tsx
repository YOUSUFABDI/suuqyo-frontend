'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from '../../../routes/hooks/index';
import { useAuth } from '../hooks';

import { paths } from 'src/routes/paths';

import { SplashScreen } from 'src/components/loading-screen';

type AllowedRolesDT = 'ADMIN' | 'CUSTOMER' | 'SHOP_OWNER' | 'DELIVERY_USER';

export function RoleBasedGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: AllowedRolesDT[];
}) {
  const router = useRouter();

  const { role, loading } = useAuth();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (!loading) {
      if (!role || !allowedRoles.includes(role as AllowedRolesDT)) {
        router.replace(paths.forbidden);
      } else {
        setIsChecking(false);
      }
    }
  }, [role, allowedRoles, loading, router]);

  if (isChecking || loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
