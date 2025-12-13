'use client';

import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { Product } from '../product/types/types';
import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

type Props = BoxProps & {
  loading?: boolean;
  products: Product[];
  hasMore?: boolean;
  isFetchingMore?: boolean;
};

export function ProductList({ products, loading, sx, hasMore, isFetchingMore, ...other }: Props) {
  // console.log('products', products);
  const renderLoading = () =>
    Array.from(new Array(8)).map((_, index) => <ProductItemSkeleton key={index} />);

  const renderList = () =>
    products.map((product) => (
      <ProductItem
        key={product.id}
        product={product}
        detailsHref={paths.customer.product.details(product.id)}
      />
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

      {/* Loading more indicator */}
      {isFetchingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Loading more...
          </Typography>
        </Box>
      )}

      {/* End of products indicator */}
      {!hasMore && !isFetchingMore && products.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            You've reached the end
          </Typography>
        </Box>
      )}
    </>
  );
}
