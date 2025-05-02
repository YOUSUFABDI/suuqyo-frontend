import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CheckoutView } from 'src/sections/home/checkout/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Checkout - ${CONFIG.appName}` };

export default function Page() {
  return <CheckoutView />;
}
