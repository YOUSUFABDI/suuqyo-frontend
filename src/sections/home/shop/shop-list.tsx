import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { ShopItem } from './shop-item';
import { ShopItemSkeleton } from './shop-skeleton';
import { ShopInfoDT } from './types/types';
import { slugify } from 'src/utils/slugify';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  loading?: boolean;
  shops: ShopInfoDT['shop'][];
};

export function ShopList({ shops, loading, sx, ...other }: Props) {
  const renderLoading = () => <ShopItemSkeleton />;

  const renderList = () =>
    shops.map((shop) => (
      <ShopItem key={shop.id} shop={shop} detailsHref={`/shop/${slugify(shop.shopName)}`} />
    ));

  return (
    <>
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
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {shops.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
