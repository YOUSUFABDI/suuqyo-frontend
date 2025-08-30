import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Divider, Grid, Paper, SxProps, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useCreateSubscriptionMutation } from 'src/store/admin/subscription';
import { getErrorMessage } from 'src/utils/error.message';
import { UseShopOwners } from '../shop-owner/hooks';
import { ShopOwnerDT } from '../shop-owner/types/types';
import { SubscriptionPlan, SubscriptionReqDT, SubscriptionTerm } from './types/subscription';

const role = localStorage.getItem('role');

// ----------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------

const SUBSCRIPTION_PLANS = [
  { value: 'BASIC', label: 'Basic', monthly: 0, yearly: 0 },
  { value: 'PRO', label: 'Pro', monthly: 30, yearly: 360 },
  { value: 'PREMIUM', label: 'Premium', monthly: 50, yearly: 600 },
];

const SUBSCRIPTION_TERMS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function SubscriptionNewForm() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('BASIC');
  const [selectedTerm, setSelectedTerm] = useState<SubscriptionTerm>('MONTHLY');
  const [discount, setDiscount] = useState<number>(0);
  const [selectedShopOwner, setSelectedShopOwner] = useState<ShopOwnerDT | null>(null);

  const basePrice =
    SUBSCRIPTION_PLANS.find((p) => p.value === selectedPlan)?.[
      selectedTerm.toLowerCase() as 'monthly' | 'yearly'
    ] || 0;
  const finalPrice = Math.max(0, basePrice - discount);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Box
          sx={{
            gap: 3,
            p: 3,
            display: 'grid',
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <ShopOwnerInfo
            selectedShopOwner={selectedShopOwner}
            setSelectedShopOwner={setSelectedShopOwner}
          />
          <SubscriptionDetails
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            selectedTerm={selectedTerm}
            setSelectedTerm={setSelectedTerm}
            discount={discount}
            setDiscount={setDiscount}
            basePrice={basePrice}
          />
        </Box>
      </Grid>
      <Grid xs={12} md={4}>
        <SubscriptionSummary
          selectedPlan={selectedPlan}
          selectedTerm={selectedTerm}
          discount={discount}
          finalPrice={finalPrice}
          selectedShopOwner={selectedShopOwner}
        />
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------
// ShopOwnerInfo Component
// ----------------------------------------------------------------------

function ShopOwnerInfo({
  selectedShopOwner,
  setSelectedShopOwner,
}: {
  selectedShopOwner: ShopOwnerDT | null;
  setSelectedShopOwner: React.Dispatch<React.SetStateAction<ShopOwnerDT | null>>;
}) {
  const { shopOwners, isLoading, error } = UseShopOwners();

  if (isLoading) return <Typography>Loading shop owners...</Typography>;
  if (error) return <Typography color="error">Error loading shop owners</Typography>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Shop Owner Information
      </Typography>

      <Stack spacing={2}>
        <Autocomplete
          options={shopOwners}
          getOptionLabel={(option) => `${option.fullName} (${option.phoneNumber})`}
          value={selectedShopOwner}
          onChange={(_, newValue) => setSelectedShopOwner(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Shop Owner"
              placeholder="Search by name or phone"
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.id}>
              <Stack>
                <Typography>{option.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.phoneNumber}
                </Typography>
              </Stack>
            </Box>
          )}
        />

        {selectedShopOwner && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <InfoRow label="Phone" value={selectedShopOwner.phoneNumber} />
              <InfoRow label="Email" value={selectedShopOwner.email} />
              <InfoRow label="Address" value={selectedShopOwner.address || 'Not available'} />
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="body2" sx={{ minWidth: 80, color: 'text.secondary' }}>
        {label}:
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------
// SubscriptionDetails Component
// ----------------------------------------------------------------------

function SubscriptionDetails({
  selectedPlan,
  setSelectedPlan,
  selectedTerm,
  setSelectedTerm,
  discount,
  setDiscount,
  basePrice,
}: {
  selectedPlan: SubscriptionPlan;
  setSelectedPlan: (plan: SubscriptionPlan) => void;
  selectedTerm: SubscriptionTerm;
  setSelectedTerm: (term: SubscriptionTerm) => void;
  discount: number;
  setDiscount: (value: number) => void;
  basePrice: number;
}) {
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setDiscount(Math.min(value, basePrice));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Subscription Details
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Select Plan
        </Typography>
        <Grid container spacing={2}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Grid key={plan.value} xs={4}>
              <PlanCard
                plan={plan}
                selected={selectedPlan === plan.value}
                onClick={() => setSelectedPlan(plan.value as SubscriptionPlan)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Billing Period
        </Typography>
        <Stack direction="row" spacing={2}>
          {SUBSCRIPTION_TERMS.map((term) => (
            <TermOption
              key={term.value}
              term={term}
              price={
                SUBSCRIPTION_PLANS.find((p) => p.value === selectedPlan)?.[
                  term.value.toLowerCase() as 'monthly' | 'yearly'
                ] || 0
              }
              selected={selectedTerm === term.value}
              onClick={() => setSelectedTerm(term.value as SubscriptionTerm)}
            />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Discount
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Discount Amount"
          value={discount}
          onChange={handleDiscountChange}
          inputProps={{ min: 0, max: basePrice }}
          helperText={`Max discount: $${basePrice}`}
        />
      </Box>
    </Box>
  );
}

function PlanCard({
  plan,
  selected,
  onClick,
}: {
  plan: (typeof SUBSCRIPTION_PLANS)[0];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 1,
        cursor: 'pointer',
        height: '100%',
        border: (theme) =>
          `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        backgroundColor: selected ? 'action.selected' : 'background.paper',
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {plan.label}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Monthly: ${plan.monthly}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yearly: ${plan.yearly}
        </Typography>
      </Box>
      {selected && (
        <Iconify
          icon="mdi:check-circle"
          width={24}
          sx={{ color: 'primary.main', mt: 1, ml: 'auto' }}
        />
      )}
    </Box>
  );
}

function TermOption({
  term,
  price,
  selected,
  onClick,
}: {
  term: (typeof SUBSCRIPTION_TERMS)[0];
  price: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        flex: 1,
        borderRadius: 1,
        cursor: 'pointer',
        border: (theme) =>
          `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        backgroundColor: selected ? 'action.selected' : 'background.paper',
        textAlign: 'center',
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <Typography variant="subtitle1">{term.label}</Typography>
      <Typography variant="body1" fontWeight="bold">
        ${price}
      </Typography>
      {selected && <Iconify icon="mdi:check" width={20} sx={{ color: 'primary.main', mt: 0.5 }} />}
    </Box>
  );
}

// ----------------------------------------------------------------------
// SubscriptionSummary Component
// ----------------------------------------------------------------------

function SubscriptionSummary({
  selectedPlan,
  selectedTerm,
  discount,
  finalPrice,
  selectedShopOwner,
}: {
  selectedPlan: SubscriptionPlan;
  selectedTerm: SubscriptionTerm;
  discount: number;
  finalPrice: number;
  selectedShopOwner: ShopOwnerDT | null;
}) {
  const router = useRouter();
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const { refetchShopowners } = UseShopOwners();

  const handleSubmit = async () => {
    if (!selectedShopOwner) {
      toast.error('Please select a shop owner');
      return;
    }

    const subscriptionData: SubscriptionReqDT = {
      shopOwnerId: Number(selectedShopOwner.id),
      subscriptionPlan: selectedPlan,
      subscriptionTerm: selectedTerm,
      discount,
    };

    try {
      await createSubscription(subscriptionData).unwrap();
      toast.success('Subscription created successfully!');
      if (role === 'ADMIN') {
        router.push(paths.dashboard.subscription.root);
      } else if (role === 'STAFF') {
        router.push(paths.staff.subscription.root);
      }
      await refetchShopowners();
    } catch (error: any) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.neutral',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Summary
      </Typography>

      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        <SummaryRow label="Shop Owner" value={selectedShopOwner?.fullName || 'Not selected'} />
        <SummaryRow label="Plan" value={selectedPlan} />
        <SummaryRow label="Billing Period" value={selectedTerm} />
        <SummaryRow
          label="Base Price"
          value={`$${SUBSCRIPTION_PLANS.find((p) => p.value === selectedPlan)?.[selectedTerm.toLowerCase() as 'monthly' | 'yearly'] || 0}`}
        />
        <SummaryRow label="Discount" value={`-$${discount}`} />
        <Divider sx={{ my: 1 }} />
        <SummaryRow
          label="Total"
          value={
            <Typography variant="h6" component="span">
              ${finalPrice}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                /{selectedTerm === 'YEARLY' ? 'year' : 'month'}
              </Typography>
            </Typography>
          }
          sx={{ fontWeight: 'bold', pt: 1 }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 3 }}
        loading={isLoading}
        onClick={handleSubmit}
        disabled={!selectedShopOwner}
      >
        Create Subscription
      </LoadingButton>
    </Box>
  );
}

function SummaryRow({ label, value, sx }: { label: string; value: React.ReactNode; sx?: SxProps }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', ...sx }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? <Typography variant="body2">{value}</Typography> : value}
    </Box>
  );
}
