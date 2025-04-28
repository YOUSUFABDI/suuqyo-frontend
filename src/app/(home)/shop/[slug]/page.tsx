// 'use client';

// import { Box } from '@mui/material';
// import { useEffect, useState } from 'react';

// import { CONFIG } from 'src/global-config';

// // import { ProductShopDetailsView } from 'src/sections/product/view';

// // ----------------------------------------------------------------------

// // export const metadata: Metadata = { title: `Product details - ${CONFIG.appName}` };

// type Props = {
//   params: { slug: string };
// };

// export default function Page({ params }: Props) {
//   const [shopId, setShopId] = useState<string | null>(null);

//   const { slug } = params;

//   useEffect(() => {
//     // Retrieve the shop ID from sessionStorage (where we stored it earlier)
//     const storedShopId = sessionStorage.getItem('shopId');
//     if (storedShopId) {
//       setShopId(storedShopId);
//     }
//   }, []);

//   console.log('slug::::::', slug);
//   console.log('shopId::::::', shopId);

//   return (
//     <Box>
//       {slug}
//       {shopId}
//     </Box>
//   );
// }

// // Static export settings (if required)
// const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
// export { dynamic };

'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CONFIG } from 'src/global-config';
import { useSearchShops } from 'src/sections/home/shop/hooks';
import { ShopDT } from 'src/sections/home/shop/types/types';
import { slugify } from 'src/utils/slugify';

// ----------------------------------------------------------------------

type Props = {
  params: { slug: string };
};

export default function Page({ params }: Props) {
  const [shop, setShop] = useState<ShopDT | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  const { slug } = params;

  // Fetch shops (or use static data) based on your existing logic
  const { searchResults: shops } = useSearchShops(''); // Empty query or set the query as needed

  useEffect(() => {
    // Dynamically find the shop by slug
    const selectedShop = shops.find((shop) => slugify(shop.shopName) === slug);
    if (selectedShop) {
      setShop(selectedShop);
      setShopId(selectedShop.id); // Set shopId dynamically based on the shop found
    }
  }, [slug, shops]);

  console.log('Slug:', slug);
  console.log('ShopId:', shopId);
  console.log('Selected Shop:', shop);

  return (
    <Box>
      {shop ? (
        <>
          <Typography variant="h6">Shop: {shop.shopName}</Typography>
          <Typography variant="body1">Shop ID: {shopId}</Typography>
        </>
      ) : (
        <Typography variant="body1">Shop not found</Typography>
      )}
    </Box>
  );
}

// Static export settings (if required)
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };
