import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { Carousel, CarouselDotButtons, useCarousel } from 'src/components/carousel';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

// type Props = CardProps & {
//   list: {
//     id: string;
//     name: string;
//     coverUrl: string;
//   }[];
// };

export interface ProductImage {
  image: string;
}

export interface NewProduct {
  id: string | number;
  name: string;
  images: ProductImage[];
}

export interface ProductItem {
  id: string | number;
  name: string;
  coverUrl: string;
}

type ProductListItem = NewProduct | ProductItem;

interface AnalyticsNewProductsProps extends CardProps {
  list: ProductListItem[];
  sx?: any;
}

export function AnalyticsNewProducts({ list, sx, ...other }: AnalyticsNewProductsProps) {
  const carousel = useCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 8000 })]);

  // Transform items to ensure consistent structure
  const transformedItems = list.map((item) => {
    if ('images' in item) {
      // Handle NewProduct type
      return {
        id: item.id,
        name: item.name,
        coverUrl: item.images[0]?.image || '',
      };
    }
    // Handle ProductItem type
    return item;
  });

  return (
    <Card sx={[{ bgcolor: 'common.black' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{
          right: 20,
          bottom: 20,
          position: 'absolute',
          color: 'primary.light',
        }}
      />

      <Carousel carousel={carousel}>
        {transformedItems.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CarouselItemProps = BoxProps & {
  item: AnalyticsNewProductsProps['list'][number];
};

function CarouselItem({ item, ...other }: CarouselItemProps) {
  const coverUrl = 'coverUrl' in item ? item.coverUrl : item.images[0]?.image || '';

  return (
    <Box sx={{ width: 1, position: 'relative', ...other }}>
      <Box
        sx={{
          p: 3,
          left: 0,
          width: 1,
          bottom: 0,
          zIndex: 9,
          display: 'flex',
          position: 'absolute',
          color: 'common.white',
          flexDirection: 'column',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography>

        <Link color="inherit" underline="none" variant="h5" noWrap sx={{ mt: 1, mb: 3 }}>
          {item.name}
        </Link>

        {/* <Button color="primary" variant="contained" sx={{ alignSelf: 'flex-start' }}>
          Buy now
        </Button> */}
      </Box>

      <Image
        alt={item.name}
        src={coverUrl}
        slotProps={{
          overlay: {
            sx: (theme) => ({
              backgroundImage: `linear-gradient(to bottom, transparent 0%, ${theme.vars.palette.common.black} 75%)`,
            }),
          },
        }}
        sx={{ width: 1, height: { xs: 288, xl: 320 } }}
      />
    </Box>
  );
}
