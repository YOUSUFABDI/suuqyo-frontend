import type { BoxProps } from '@mui/material/Box';

import { useState } from 'react';
import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion, { accordionClasses } from '@mui/material/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatPlusIcon, FloatTriangleDownIcon } from './components/svg-elements';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const FAQs = [
  // General Questions about Suuqyo
  {
    question: 'What is Suuqyo?',
    answer: (
      <Typography>
        <Link
          href="/"
          // target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          Suuqyo
        </Link>
        is an online marketplace that connects buyers with shop owners. It's designed to make it
        simple and seamless for you to find quality products or sell your own.
      </Typography>
    ),
  },
  {
    question: 'How does Suuqyo work?',
    answer: (
      <Typography>
        <Link
          href="/"
          // target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          Suuqyo
        </Link>
        provides a platform where shop owners can list their products, and buyers can browse,
        search, and purchase items directly from these sellers. We facilitate the connection between
        buyers and sellers in one vibrant marketplace.
      </Typography>
    ),
  },
  {
    question: 'Is Suuqyo free to use?',
    answer: (
      <Typography>
        For buyers, Suuqyo is completely free to use. For sellers, we offer different plans. Please
        see our
        <Link
          href="#"
          // target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          Seller Plans
        </Link>
        section for more details
      </Typography>
    ),
  },
  // General Questions about Suuqyo

  // Questions for Buyers
  {
    question: "What is Suuqyo's return policy?",
    answer: (
      <Typography>
        Return policies are set by individual sellers. We recommend checking the seller's specific
        return policy on their shop page or product listing before making a purchase. If you have an
        issue, you can also contact the seller directly.
      </Typography>
    ),
  },
  {
    question: 'How can I contact a seller?',
    answer: (
      <Typography>
        Each product page and shop profile has a way to contact the seller directly. Look for a
        "Seller Phone Number" or "Seller Email".
      </Typography>
    ),
  },
  {
    question: 'What should I do if I have a problem with my order?',
    answer: (
      <Typography>
        First, we recommend contacting the seller directly to resolve the issue. If you're unable to
        reach a resolution, Suuqyo has a dispute resolution process to help.
      </Typography>
    ),
  },
  // Questions for Buyers

  // Questions for Sellers
  {
    question: 'How do I become a seller on Suuqyo?',
    answer: (
      <Typography>
        To become a seller, you'll need to.
        <Link
          href="/contact-us"
          // target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          Contact us
        </Link>
      </Typography>
    ),
  },
  {
    question: 'What can I sell on Suuqyo?',
    answer: (
      <Typography>
        You can sell a wide range of products on Suuqyo, as long as they comply with our Prohibited
        Items Policy. Please review.
        <Link
          href="#"
          // target="_blank"
          rel="noopener"
          sx={{ mx: 0.5 }}
        >
          Privacy and policy
        </Link>
        carefully
      </Typography>
    ),
  },
  {
    question: 'How do I list my products?',
    answer: (
      <Typography>
        Once you have a seller account, you'll have access to your seller dashboard where you can
        easily upload product details, photos, and set prices.
      </Typography>
    ),
  },
  {
    question: 'How do I manage my orders?',
    answer: (
      <Typography>
        Your seller dashboard provides tools to manage incoming orders, update shipping information,
        and communicate with buyers.
      </Typography>
    ),
  },
  {
    question: 'What are my responsibilities as a seller?',
    answer: (
      <Typography>
        As a seller, you're responsible for accurately describing your products, fulfilling orders
        promptly, providing good customer service, and adhering to Suuqyo's policies.
      </Typography>
    ),
  },
  // Questions for Sellers
];

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }: BoxProps) {
  const [expanded, setExpanded] = useState<string | false>(FAQs[0].question);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = () => (
    <SectionTitle
      caption="FAQs"
      title="We’ve got the"
      txtGradient="answers"
      sx={{ textAlign: 'center' }}
    />
  );

  const renderContent = () => (
    <Stack
      spacing={1}
      sx={[
        () => ({
          mt: 8,
          mx: 'auto',
          maxWidth: 720,
          mb: { xs: 5, md: 8 },
        }),
      ]}
    >
      {FAQs.map((item, index) => (
        <Accordion
          key={item.question}
          component={m.div}
          variants={varFade('inUp', { distance: 24 })}
          expanded={expanded === item.question}
          onChange={handleChange(item.question)}
          sx={(theme) => ({
            borderRadius: 2,
            transition: theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.short,
            }),
            '&::before': { display: 'none' },
            '&:hover': { bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16) },
            '&:first-of-type, &:last-of-type': { borderRadius: 2 },
            [`&.${accordionClasses.expanded}`]: {
              m: 0,
              borderRadius: 2,
              boxShadow: 'none',
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            },
            [`& .${accordionSummaryClasses.root}`]: {
              py: 3,
              px: 2.5,
              minHeight: 'auto',
              [`& .${accordionSummaryClasses.content}`]: {
                m: 0,
                [`&.${accordionSummaryClasses.expanded}`]: { m: 0 },
              },
            },
            [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
          })}
        >
          <AccordionSummary
            expandIcon={
              <Iconify
                width={20}
                icon={expanded === item.question ? 'mingcute:minimize-line' : 'mingcute:add-line'}
              />
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Typography variant="h6"> {item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );

  const renderContact = () => (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          py: 8,
          textAlign: 'center',
          background: `linear-gradient(to left, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}, transparent)`,
        }),
      ]}
    >
      <m.div variants={varFade('in')}>
        <Typography variant="h4">Still have questions?</Typography>
      </m.div>

      <m.div variants={varFade('in')}>
        <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
          Please describe your case to receive the most accurate advice
        </Typography>
      </m.div>

      <m.div variants={varFade('in')}>
        <Button
          color="inherit"
          variant="contained"
          // href="mailto:support@minimals.cc?subject=[Feedback] from Customer"
          href={paths.customer.contact}
          startIcon={<Iconify icon="fluent:mail-24-filled" />}
        >
          Contact us
        </Button>
      </m.div>
    </Box>
  );

  return (
    <Box component="section" sx={sx} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        {topLines()}

        <Container>
          {renderDescription()}
          {renderContent()}
        </Container>

        <Stack sx={{ position: 'relative' }}>
          {bottomLines()}
          {renderContact()}
        </Stack>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const topLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        position: 'absolute',
        transform: 'translateX(-50%)',
      }}
    >
      <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
      <FloatTriangleDownIcon
        sx={{
          width: 30,
          height: 15,
          opacity: 0.24,
          position: 'static',
        }}
      />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

const bottomLines = () => (
  <>
    <FloatLine sx={{ top: 0, left: 0 }} />
    <FloatLine sx={{ bottom: 0, left: 0 }} />
    <FloatPlusIcon sx={{ top: -8, left: 72 }} />
    <FloatPlusIcon sx={{ bottom: -8, left: 72 }} />
  </>
);
