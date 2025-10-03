import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { ShopItem } from './shop-item';
import { ShopListSkeleton } from './shop-skeleton';
import { ShopInfoDT } from './types/types';
import { slugify } from 'src/utils/slugify';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  loading?: boolean;
  shops: ShopInfoDT['shop'][];
  hasMore?: boolean;
  isFetchingMore?: boolean;
};

export function ShopList({ shops, loading, sx, hasMore, isFetchingMore, ...other }: Props) {
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
        {loading ? <ShopListSkeleton /> : renderList()}
      </Box>

      {/* Loading more indicator */}
      {isFetchingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Loading more shops...
          </Typography>
        </Box>
      )}

      {/* End of shops indicator */}
      {!hasMore && !isFetchingMore && shops.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            You've reached the end of the shops
          </Typography>
        </Box>
      )}
    </>
  );
}