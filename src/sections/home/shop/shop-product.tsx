import { Box, Card } from '@mui/material';
import { ShopInfoDT } from './types/types';
import { ProductList } from '../components/product-list';
import { useCheckoutContext } from '../checkout/context';
import { useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { Product } from '../product/types/types';

type Props = {
  // shop: ShopInfoDT | null;
  products: Product[];
};

export const ShopProduct = ({ products }: Props) => {
  return (
    <Card sx={{ borderRadius: 0, boxShadow: 0 }}>
      <Box
        component="img"
        // src={shop?.shopLogo}
        src={products[0]?.shop?.shopLogo}
        alt="Shop Cover"
        sx={{
          width: '100%',
          height: { xs: 180, sm: 240, md: 280 },
          objectFit: 'cover',
          display: 'block', // remove inline gap
          borderRadius: 0.6,
        }}
      />
      {/* Products */}
      {/* <ProductList products={shop?.user.Product} /> */}
      <ProductList products={products} />
    </Card>
  );
};
