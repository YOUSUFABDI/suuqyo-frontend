import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { AuthGuard } from 'src/sections/auth/guard';

import { CheckoutView } from 'src/sections/home/checkout/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Checkout - ${CONFIG.appName}` };

export default function Page() {
  return (
    <AuthGuard>
      <CheckoutView />;
    </AuthGuard>
  );
}
