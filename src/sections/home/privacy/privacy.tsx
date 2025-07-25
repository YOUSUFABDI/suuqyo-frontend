import type { BoxProps } from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';

import { m } from 'framer-motion';
import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PrivacyPolicy({ sx, ...other }: BoxProps) {
  const lastUpdated = 'July 25, 2025';

  // This function helps apply styles, including for dark mode.
  const commonTextStyle = (theme: Theme) => ({
    color: theme.palette.text.secondary,
    // In a real app, MUI's theme provider would handle dark mode styles.
    // This is a placeholder for that logic.
    ...theme.applyStyles('dark', {
      color: theme.palette.common.white,
    }),
  });

  // Reusable animation properties for a smooth fade-in effect.
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    viewport: { once: true },
  };

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container sx={{ py: { xs: 10, md: 15 } }}>
        <Grid>
          <Grid item xs={12} md={10} lg={8}>
            <m.div {...motionProps}>
              <Typography variant="h2" component="h1" sx={{ textAlign: 'center' }}>
                Privacy Notice
              </Typography>
            </m.div>

            <m.div {...motionProps}>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  mb: 5,
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                Last Updated: {lastUpdated}
              </Typography>
            </m.div>

            {/* User's custom privacy notice */}
            <m.div {...motionProps}>
              <Typography sx={(theme) => ({ ...commonTextStyle(theme), mb: 5, lineHeight: 1.7 })}>
                At <Link href="https://suuqyo.com/"> suuqyo.com </Link>, we are committed to
                protecting your privacy. When you browse or make a purchase, we may collect basic
                personal information such as your name, contact details, and payment information.
                This data is used only to process your orders, provide customer support, and improve
                your shopping experience. We do not sell or share your personal information with
                third parties, except where necessary to complete your transaction. By using our
                site, you agree to this notice. For questions, please contact us at{' '}
                <Link href="mailto:info@suuqyo.com"> info@suuqyo.com </Link>.
              </Typography>
            </m.div>

            {/* Contact Us Button */}
            <m.div {...motionProps} style={{ textAlign: 'center' }}>
              <Button
                component="a"
                href={paths.customer.contact}
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Iconify width={22} icon="ic:round-support-agent" />}
              >
                Contact Us
              </Button>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
