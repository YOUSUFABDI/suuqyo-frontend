'use client';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PlanFreeIcon, PlanPremiumIcon, PlanStarterIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { Plan } from './types/types'; // Make sure the Plan type includes the 'name' property

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// PricingCard Component
// ----------------------------------------------------------------------

type PricingCardProps = {
  card: Plan;
  isYearly: boolean;
};

export function PricingCard({ card, isYearly }: PricingCardProps) {
  const { t } = useTranslate();
  const { subscription, name, monthlyPrice, yearlyPrice, caption, lists, labelAction } = card;

  const isBasic = subscription === 'BASIC';
  const isPro = subscription === 'PRO';
  const isPremium = subscription === 'PREMIUM';

  const price = isYearly ? yearlyPrice : monthlyPrice;

  const renderIcon = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {isBasic && <PlanFreeIcon sx={{ width: 64 }} />}
      {isPro && <PlanStarterIcon sx={{ width: 64 }} />}
      {isPremium && <PlanPremiumIcon sx={{ width: 64 }} />}
      {isPro && <Label color="info">{t('pricing.popular')}</Label>}
    </Box>
  );

  const renderSubscription = () => (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {name}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {caption}
      </Typography>
    </Stack>
  );

  const renderPrice = () =>
    isBasic ? (
      <Typography variant="h2">{t('pricing.free')}</Typography>
    ) : (
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4">$</Typography>
        <Typography variant="h2">{price}</Typography>
        <Typography
          component="span"
          sx={{ ml: 1, alignSelf: 'center', typography: 'body2', color: 'text.disabled' }}
        >
          / {isYearly ? t('pricing.yearly_short') : t('pricing.monthly_short')}
        </Typography>
      </Box>
    );

  const renderList = () => (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box component="span" sx={{ typography: 'overline' }}>
          {t('pricing.features')}
        </Box>
      </Box>
      {lists.map((item) => (
        <Box key={item} sx={{ gap: 1, display: 'flex', typography: 'body2', alignItems: 'center' }}>
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ color: 'primary.main' }} />
          {item}
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box
      sx={(theme) => ({
        p: 5,
        gap: 5,
        display: 'flex',
        borderRadius: 2,
        flexDirection: 'column',
        bgcolor: 'background.default',
        boxShadow: theme.vars.customShadows.card,
        ...(isPro && {
          [theme.breakpoints.up('md')]: {
            boxShadow: `-40px 40px 80px 0px ${varAlpha(
              theme.vars.palette.grey['500Channel'],
              0.16
            )}`,
            ...theme.applyStyles('dark', {
              boxShadow: `-40px 40px 80px 0px ${varAlpha(
                theme.vars.palette.common.blackChannel,
                0.16
              )}`,
            }),
          },
        }),
      })}
    >
      {renderIcon()}
      {renderSubscription()}
      {renderPrice()}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderList()}
      <Button
        component={RouterLink}
        href={paths.customer.contact}
        fullWidth
        size="large"
        variant="contained"
        color={isPro ? 'primary' : 'inherit'}
      >
        {labelAction}
      </Button>
    </Box>
  );
}
