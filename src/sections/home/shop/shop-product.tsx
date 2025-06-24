import { Box, Card } from '@mui/material';
import { ProductList } from '../components/product-list';
import { Product } from '../product/types/types';
import { ShopInfoDT } from './types/types';
import { EmptyContent } from 'src/components/empty-content';

type Props = {
  shop: ShopInfoDT['shop'];
  products: Product[];
};

export const ShopProduct = ({ products, shop }: Props) => {
  const renderNotFound = (
    <EmptyContent
      filled
      title="No Products Found"
      sx={{ py: 10, borderRadius: 0.6 }} // Merge sx for consistent styling
    />
  );

  return (
    <Card sx={{ borderRadius: 0, boxShadow: 0 }}>
      <Box
        component="img"
        src={shop.shopLogo}
        alt="Shop Cover"
        sx={{
          width: '100%',
          height: { xs: 180, sm: 240, md: 280 },
          objectFit: 'cover',
          display: 'block', // remove inline gap
          borderRadius: 0.6,
        }}
      />

      {!products.length ? renderNotFound : <ProductList products={products} />}
    </Card>
  );
};
