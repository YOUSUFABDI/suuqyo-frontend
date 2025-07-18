import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, Grid, Paper, SxProps, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useUpdateSubscriptionMutation } from 'src/store/admin/subscription';
import { getErrorMessage } from 'src/utils/error.message';
import {
  SubscriptionPlan,
  SubscriptionResDT,
  SubscriptionTerm,
  UpdateSubscriptionReqDT,
} from './types/subscription';

// ----------------------------------------------------------------------
// Constants (Reused from the New Form)
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
// Main Edit Component
// ----------------------------------------------------------------------

interface SubscriptionEditFormProps {
  currentSubscription?: SubscriptionResDT | null;
}

export function SubscriptionEditForm({ currentSubscription }: SubscriptionEditFormProps) {
  // State for the form, initialized from the current subscription
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('BASIC');
  const [selectedTerm, setSelectedTerm] = useState<SubscriptionTerm>('MONTHLY');
  const [discount, setDiscount] = useState<number>(0);

  // Effect to populate the form state when the subscription data is available
  useEffect(() => {
    if (currentSubscription) {
      setSelectedPlan(currentSubscription.subscriptionPlan as SubscriptionPlan);
      setSelectedTerm(currentSubscription.subscriptionTerm as SubscriptionTerm);
      setDiscount(currentSubscription.discount || 0);
    }
  }, [currentSubscription]);

  const basePrice =
    SUBSCRIPTION_PLANS.find((p) => p.value === selectedPlan)?.[
      selectedTerm.toLowerCase() as 'monthly' | 'yearly'
    ] || 0;
  const finalPrice = Math.max(0, basePrice - discount);

  if (!currentSubscription) {
    return <LoadingScreen />;
  }

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
          {/* Shop owner info is now read-only */}
          <ShopOwnerInfo user={currentSubscription?.user} />

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
          currentSubscription={currentSubscription}
          selectedPlan={selectedPlan}
          selectedTerm={selectedTerm}
          discount={discount}
          finalPrice={finalPrice}
        />
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------
// Read-Only ShopOwnerInfo Component
// ----------------------------------------------------------------------

function ShopOwnerInfo({ user }: { user: SubscriptionResDT['user'] }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Shop Owner Information
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">{user?.fullName}</Typography>
          <InfoRow label="Phone" value={user?.phoneNumber} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Username" value={user?.username} />
        </Stack>
      </Paper>
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
// SubscriptionDetails Component (Reused from New Form)
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
        Update Subscription
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

// --- PlanCard and TermOption components are identical to the New Form and can be reused ---

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
        // ... other styles
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {plan.label}
      </Typography>
      {/* ... other content */}
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
        // ... other styles
      }}
    >
      <Typography variant="subtitle1">{term.label}</Typography>
      {/* ... other content */}
    </Box>
  );
}

// ----------------------------------------------------------------------
// SubscriptionSummary Component (Adapted for Editing)
// ----------------------------------------------------------------------

function SubscriptionSummary({
  currentSubscription,
  selectedPlan,
  selectedTerm,
  discount,
  finalPrice,
}: {
  currentSubscription: SubscriptionResDT;
  selectedPlan: SubscriptionPlan;
  selectedTerm: SubscriptionTerm;
  discount: number;
  finalPrice: number;
}) {
  const router = useRouter();
  const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation();

  const handleSubmit = async () => {
    const updateData: UpdateSubscriptionReqDT = {
      shopOwnerId: Number(currentSubscription.user.id),
      newPlan: selectedPlan,
      newTerm: selectedTerm,
      discount,
    };

    try {
      await updateSubscription(updateData).unwrap();
      toast.success('Subscription updated successfully!');
      router.push(paths.dashboard.subscription.root);
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
        <SummaryRow label="Shop Owner" value={currentSubscription?.user?.fullName} />
        <SummaryRow label="Plan" value={selectedPlan} />
        <SummaryRow label="Billing Period" value={selectedTerm} />
        <SummaryRow
          label="Base Price"
          value={`$${
            SUBSCRIPTION_PLANS.find((p) => p.value === selectedPlan)?.[
              selectedTerm.toLowerCase() as 'monthly' | 'yearly'
            ] || 0
          }`}
        />
        <SummaryRow label="Discount" value={`-$${discount}`} />
        <Divider sx={{ my: 1 }} />
        <SummaryRow
          label="New Total"
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
      >
        Update Subscription
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
