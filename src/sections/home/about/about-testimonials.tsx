import type { BoxProps } from '@mui/material/Box';
import type { IDateValue } from 'src/types/common';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Grid from '@mui/material/Grid2';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { _testimonials } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function AboutTestimonials({ sx, ...other }: BoxProps) {
  const renderLink = () => (
    <Button
      component={RouterLink}
      href={paths.customer.contact}
      color="primary"
      endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
    >
      Contact us
    </Button>
  );

  const renderDescription = () => (
    <Box sx={{ maxWidth: { md: 360 }, textAlign: { xs: 'center', md: 'unset' } }}>
      <m.div variants={varFade('inUp')}>
        <Typography variant="overline" sx={{ color: 'common.white', opacity: 0.48 }}>
          Testimonials
        </Typography>
      </m.div>

      <m.div variants={varFade('inUp')}>
        <Typography variant="h2" sx={{ my: 3, color: 'common.white' }}>
          Who love <br />
          our work
        </Typography>
      </m.div>

      <m.div variants={varFade('inUp')}>
        <Typography sx={{ color: 'common.white' }}>
          Our goal is to Achieve a customer satisfaction rating of 90% or higher for both buyers and
          sellers.
        </Typography>
      </m.div>

      <Box
        component={m.div}
        variants={varFade('inUp')}
        sx={{ mt: 3, justifyContent: 'center', display: { xs: 'flex', md: 'none' } }}
      >
        {renderLink()}
      </Box>
    </Box>
  );

  const renderContent = () => (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.hideScrollY,
          py: { md: 10 },
          height: { md: 1 },
          overflowY: { xs: 'unset', md: 'auto' },
        }),
      ]}
    >
      <Masonry spacing={3} columns={{ xs: 1, md: 2 }} sx={{ ml: 0 }}>
        {testimonials.map((testimonial) => (
          <m.div key={testimonial.name} variants={varFade('inUp')}>
            <TestimonialItem testimonial={testimonial} />
          </m.div>
        ))}
      </Masonry>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.9)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.9)})`,
              `url(${CONFIG.assetsDir}/assets/images/about/testimonials.webp)`,
            ],
          }),
          overflow: 'hidden',
          height: { md: 840 },
          py: { xs: 10, md: 0 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ position: 'relative', height: 1 }}>
        <Grid
          container
          spacing={3}
          sx={{
            height: 1,
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'space-between' },
          }}
        >
          <Grid size={{ xs: 10, md: 4 }}>{renderDescription()}</Grid>

          <Grid size={{ xs: 12, md: 7, lg: 6 }} sx={{ height: 1, alignItems: 'center' }}>
            {renderContent()}
          </Grid>
        </Grid>

        <Box
          component={m.div}
          variants={varFade('inUp')}
          sx={{ bottom: 60, position: 'absolute', display: { xs: 'none', md: 'flex' } }}
        >
          {renderLink()}
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TestimonialItemProps = BoxProps & {
  testimonial: {
    name: string;
    content: string;
    avatarUrl: string;
    ratingNumber: number;
    postedDate: IDateValue;
  };
};

function TestimonialItem({ testimonial, sx, ...other }: TestimonialItemProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgBlur({ color: varAlpha(theme.vars.palette.common.whiteChannel, 0.08) }),
          p: 3,
          gap: 3,
          display: 'flex',
          borderRadius: 2,
          color: 'common.white',
          flexDirection: 'column',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify icon="mingcute:quote-left-fill" width={40} sx={{ opacity: 0.48 }} />
      <Typography variant="body2">{testimonial.content}</Typography>
      <Rating value={testimonial.ratingNumber} readOnly size="small" />
      <Box sx={{ gap: 2, display: 'flex' }}>
        <Avatar alt={testimonial.name} src={testimonial.avatarUrl} />

        <ListItemText
          primary={testimonial.name}
          secondary={fDate(testimonial.postedDate)}
          primaryTypographyProps={{ typography: 'subtitle2', mb: 0.5 }}
          secondaryTypographyProps={{
            color: 'inherit',
            typography: 'caption',
            sx: { opacity: 0.64 },
          }}
        />
      </Box>
    </Box>
  );
}

export const testimonials = [
  {
    name: 'Aisha Hassan',
    postedDate: '18 Jun 2025',
    ratingNumber: 4.8,
    avatarUrl: '', // Example placeholder, replace with actual paths
    content: `${CONFIG.appName} has transformed how I shop! I found unique local crafts that I couldn't find anywhere else. The process was smooth, and the seller was incredibly responsive. Highly recommend!`,
  },
  {
    name: 'Ahmed Said',
    postedDate: '15 Jun 2025',
    ratingNumber: 4.5,
    avatarUrl: '', // Example placeholder
    content: `As a small business owner, ${CONFIG.appName} has opened up a new world of customers for me. Listing my products was easy, and I've seen a significant increase in sales since joining. The platform is truly empowering for local entrepreneurs.`,
  },
  {
    name: 'Fatima Ali',
    postedDate: '10 Jun 2025',
    ratingNumber: 4.0,
    avatarUrl: '', // Example placeholder
    content: `I appreciate the variety of products available on ${CONFIG.appName}. I recently bought some electronics, and while delivery took a day longer than expected, the quality of the item was excellent. It's a convenient way to shop from home.`,
  },
  {
    name: 'Osman Jama',
    postedDate: '05 Jun 2025',
    ratingNumber: 5.0,
    avatarUrl: '', // Example placeholder
    content: `Exceptional service! I needed specific tools for my workshop, and ${CONFIG.appName} connected me with a seller who had exactly what I needed at a fair price. The communication was great, and I received my order very quickly. Fantastic platform!`,
  },
];
