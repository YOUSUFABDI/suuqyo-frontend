'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { _mapContact } from 'src/_mock';

import { ContactMap } from '../contact-map';
import { ContactHero } from '../contact-hero';
import { ContactForm } from '../contact-form';

import { m } from 'framer-motion';
import { varFade } from 'src/components/animate';
import { Image } from 'src/components/image';
import { CONFIG } from 'src/global-config';
import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <>
      <ContactHero />
      <Container component="section" sx={{ py: 10 }}>
        <Box
          sx={{
            gap: 10,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <ContactForm />

          <m.div variants={varFade('inUp')}>
            <Image
              alt="Our office large"
              src={`${CONFIG.assetsDir}/assets/images/about/Suuqyo Delivery Brand-12.jpg`}
              ratio="3/4"
              sx={(theme) => ({
                borderRadius: 3,
                boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                ...theme.applyStyles('dark', {
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                }),
              })}
            />
          </m.div>
        </Box>
      </Container>
    </>
  );
}
