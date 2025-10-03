import type { IProductReview } from 'src/types/product';

import Pagination, { paginationClasses } from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { ProductReviewItem } from './product-review-item';

// ----------------------------------------------------------------------

type Props = {
  reviews: IProductReview[];
};

export function ProductReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          No reviews yet
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Be the first to review this product
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {reviews.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: { my: 5, mx: 'auto', justifyContent: 'center' },
        }}
      />
    </>
  );
}