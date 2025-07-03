import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Suuqyo – Buy Unique Products from Local Shops & Independent Sellers',
  description:
    'Suuqyo is your go-to online marketplace to discover unique, handcrafted, and local products. Connect directly with trusted shop owners and support small businesses while shopping with ease.',
};

export default function Page() {
  return <HomeView />;
}
