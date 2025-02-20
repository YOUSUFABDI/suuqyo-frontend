'use client';

import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <DashboardContent sx={{ pt: 5 }}>
      <LoadingScreen />
    </DashboardContent>
  );
}
