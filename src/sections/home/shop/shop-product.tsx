import { Box, Card } from '@mui/material';
import { ShopInfoDT } from './types/types';
import { ProductList } from '../components/product-list';

type Props = {
  shop: ShopInfoDT | null;
};

export const ShopProduct = ({ shop }: Props) => {
  return (
    <Card sx={{ borderRadius: 0, boxShadow: 0 }}>
      <Box
        component="img"
        src={shop?.shopLogo}
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
      <ProductList products={shop?.user.Product} />
    </Card>
  );
};
