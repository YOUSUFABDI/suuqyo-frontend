import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';

import { ShopItem } from './shop-item';
import { ShopInfoDT } from './types/types';
import { slugify } from 'src/utils/slugify';
import ShopListSkeleton from './shop-skeleton';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  loading?: boolean;
  shops: ShopInfoDT['shop'][];
};

export function ShopFeaturedList({ shops, loading, sx, ...other }: Props) {
  const renderList = () =>
    shops.map((shop) => (
      <Box key={shop.id} sx={{ minWidth: 0 }}>
        <ShopItem shop={shop} detailsHref={`/shop/${slugify(shop.shopName)}`} />
      </Box>
    ));

  return (
    <Box
      sx={[
        () => ({
          gap: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          overflowX: 'hidden',
          width: '100%',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {loading ? <ShopListSkeleton itemCount={12} /> : renderList()}
    </Box>
  );
}