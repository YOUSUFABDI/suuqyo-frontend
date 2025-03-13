import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { Autocomplete, Divider, FormControlLabel, Switch, TextField } from '@mui/material';
import { Iconify } from 'src/components/iconify';

import type { BoxProps } from '@mui/material/Box';
import { varAlpha } from 'minimal-shared/utils';
import { useCallback, useState } from 'react';
import { Label } from 'src/components/label';

import LoadingButton from '@mui/lab/LoadingButton';
import { LoadingScreen } from 'src/components/loading-screen';
import { useCreateSubscriptionMutation } from 'src/store/admin/subscription';
import { ShopOwnerDT } from '../shop-owner/types/types';
import { UseShopOwners } from '../shop-owner/hooks';

import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { getErrorMessage } from 'src/utils/error.message';

// ----------------------------------------------------------------------

export function SubscriptionNewForm() {
  const [selectedType, setSelectedType] = useState<string>('YEARLY');
  const [isFree, setIsFree] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(100 * 12);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedShopOwner, setSelectedShopOwner] = useState<ShopOwnerDT | null>(null); // Lifted state

  const handleChangeSubscription = useCallback((newValue: string) => {
    setSelectedType(newValue);

    // Update price based on the subscription type
    if (newValue === 'YEARLY') {
      setPrice(100 * 12); // Example yearly price
    } else {
      setPrice(100); // Example monthly price
    }
  }, []);

  const toggleIsFree = useCallback(() => {
    setIsFree((prev) => !prev);

    // Reset discount when toggling "Is Free"
    if (!isFree) {
      setDiscount(0);
    }
  }, [isFree]);

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || 0;
    setDiscount(value);
  };

  return (
    <Grid container rowSpacing={{ xs: 5, md: 0 }} columnSpacing={{ xs: 0, md: 5 }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Box
          sx={[
            (theme) => ({
              gap: 5,
              p: { md: 5 },
              display: 'grid',
              borderRadius: 2,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
              border: { md: `dashed 1px ${theme.vars.palette.divider}` },
            }),
          ]}
        >
          <ShopOwnerInfo
            selectedShopOwner={selectedShopOwner}
            setSelectedShopOwner={setSelectedShopOwner}
          />{' '}
          {/* Pass down the selectedShopOwner */}
          <SubscriptionType
            selectedType={selectedType}
            handleChangeSubscription={handleChangeSubscription}
            isFree={isFree}
            toggleIsFree={toggleIsFree}
            price={price}
            discount={discount}
            handleDiscountChange={handleDiscountChange}
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <SubscriptionSummary
          selectedType={selectedType}
          isFree={isFree}
          price={price}
          discount={discount}
          selectedShopOwner={selectedShopOwner}
        />
      </Grid>
    </Grid>
  );
}

// ShopOwnerInfo
export function ShopOwnerInfo({
  selectedShopOwner,
  setSelectedShopOwner,
}: {
  selectedShopOwner: ShopOwnerDT | null;
  setSelectedShopOwner: React.Dispatch<React.SetStateAction<ShopOwnerDT | null>>;
}) {
  const { shopOwners, isLoading, error } = UseShopOwners(); // Fetch shop owners

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load shop owners
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6">Shop Owner Information</Typography>

      <Stack spacing={3} mt={5}>
        <Autocomplete
          fullWidth
          options={shopOwners}
          getOptionLabel={(option) =>
            `${option?.fullName || 'Unnamed'} (${option?.phoneNumber || 'No Phone'})`
          }
          filterOptions={(options, state) =>
            options.filter(
              (option) =>
                option.fullName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                option.phoneNumber?.toLowerCase().includes(state.inputValue.toLowerCase())
            )
          }
          value={selectedShopOwner}
          onChange={(event, newValue) => setSelectedShopOwner(newValue)} // Update selectedShopOwner here
          renderInput={(params) => <TextField {...params} label="Search by Name or Phone" />}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.fullName} ({option.phoneNumber})
            </li>
          )}
        />

        <TextField
          fullWidth
          label="Phone number"
          value={selectedShopOwner?.phoneNumber || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          label="Email"
          value={selectedShopOwner?.email || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          label="Address"
          value={selectedShopOwner?.address || ''}
          InputProps={{ readOnly: true }}
        />
      </Stack>
    </Box>
  );
}
// ShopOwnerInfo

// SubscriptionType
const SUBSCRIPTION_OPTIONS = [
  { label: 'Yearly', value: 'YEARLY' },
  { label: 'Monthly', value: 'MONTHLY' },
];

interface SubscriptionTypeProps {
  selectedType: string;
  handleChangeSubscription: (newValue: string) => void;
  isFree: boolean;
  toggleIsFree: () => void;
  price: number;
  discount: number;
  handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SubscriptionType({
  selectedType,
  handleChangeSubscription,
  isFree,
  toggleIsFree,
  price,
  discount,
  handleDiscountChange,
  sx,
  ...other
}: SubscriptionTypeProps & BoxProps) {
  return (
    <Box sx={sx} {...other}>
      <Typography component="h6" variant="h5" sx={{ mb: { xs: 3, md: 5 } }}>
        Select Subscription Type
      </Typography>

      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {SUBSCRIPTION_OPTIONS.map((option) => {
          const isSelected = selectedType === option.value;

          return (
            <OptionItem
              key={option.value}
              option={option}
              selected={isSelected}
              onClick={() => handleChangeSubscription(option.value)}
            />
          );
        })}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <FormControlLabel
          control={
            <Switch
              checked={isFree}
              onChange={toggleIsFree}
              inputProps={{ 'aria-label': 'Is Free Toggle' }}
            />
          }
          label="Is Free"
        />

        {/* Price Field */}
        {!isFree && (
          <TextField
            label="Price"
            value={`$${price}`}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        )}

        {/* Discount Field */}
        {!isFree && (
          <TextField
            // label="Discount (%)"
            label="Discount"
            type="number"
            value={discount}
            onChange={handleDiscountChange}
            variant="outlined"
            sx={{ mt: 2 }}
            inputProps={{
              min: 0,
              max: 100,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

type OptionItemProps = BoxProps & {
  selected: boolean;
  option: (typeof SUBSCRIPTION_OPTIONS)[number];
  onClick: () => void;
};

function OptionItem({ option, selected, sx, onClick, ...other }: OptionItemProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          borderRadius: 1.5,
          border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
          transition: theme.transitions.create(['box-shadow'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
          }),
          ...(selected && { boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}` }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onClick={onClick}
      {...other}
    >
      <Box
        sx={{
          px: 2,
          gap: 2,
          height: 80,
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center',
        }}
      >
        <Iconify
          width={24}
          icon={selected ? 'solar:check-circle-bold' : 'carbon:radio-button'}
          sx={{ color: 'text.disabled', ...(selected && { color: 'primary.main' }) }}
        />

        <Box component="span" sx={{ typography: 'subtitle1', flexGrow: 1 }}>
          {option.label}
        </Box>
      </Box>
    </Box>
  );
}
// SubscriptionType

// SubscriptionSummary
export function SubscriptionSummary({
  sx,
  selectedType,
  isFree,
  price,
  discount,
  selectedShopOwner,
  ...other
}: BoxProps & {
  selectedType: string;
  isFree: boolean;
  price: number;
  discount: number;
  selectedShopOwner: ShopOwnerDT | null;
}) {
  const router = useRouter();

  const [createSubscription, { isLoading, isError, error }] = useCreateSubscriptionMutation();

  const finalPrice = isFree ? 0 : Math.max(0, price - discount);

  const handleSubmit = async () => {
    if (!selectedShopOwner) {
      toast.error('No shop owner selected');
      return;
    }

    const subscriptionData = {
      shopOwnerId: Number(selectedShopOwner.shopOwnerId),
      subscriptionType: selectedType,
      discount,
      isFree,
    };

    try {
      await createSubscription(subscriptionData).unwrap();
      toast.success('Create success!');
      router.push(paths.dashboard.subscription.root);
    } catch (error: any) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };
  return (
    <Box
      sx={[
        () => ({
          p: 5,
          borderRadius: 2,
          bgcolor: 'background.neutral',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography variant="h6" sx={{ mb: 5 }}>
        Summary
      </Typography>

      <Stack spacing={2.5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Subscription type
          </Typography>

          <Label color="error">{selectedType}</Label>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Is free
          </Typography>

          <Label color="default">{isFree ? 'Free' : 'No'}</Label>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price
          </Typography>

          <Label color="default">${price}</Label>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Discount
          </Typography>

          <Label color="default">${discount}</Label>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h4">$</Typography>

          <Typography variant="h2">{finalPrice.toFixed(2)}</Typography>

          <Typography
            component="span"
            sx={{
              ml: 1,
              alignSelf: 'center',
              typography: 'body2',
              color: 'text.disabled',
            }}
          >
            / {selectedType === 'YEARLY' ? 'yr' : 'mo'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1">Total billed</Typography>

          <Typography variant="subtitle1">${finalPrice.toFixed(2)}*</Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>

      <LoadingButton
        type="button"
        loading={isLoading}
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 5, mb: 3 }}
        disabled={isLoading}
        onClick={handleSubmit}
      >
        Make subscription
      </LoadingButton>
    </Box>
  );
}
// SubscriptionSummary
