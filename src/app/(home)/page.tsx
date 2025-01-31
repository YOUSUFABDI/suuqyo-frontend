import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Suuqyo: The starting point for your shopping',
  description: 'The starting point for your shopping',
};

export default function Page() {
  return <HomeView />;
}
