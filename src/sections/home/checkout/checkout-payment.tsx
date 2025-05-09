import type {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
  ICheckoutDeliveryOption,
} from 'src/types/checkout';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'src/components/snackbar';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutDelivery } from './checkout-delivery';
import { CheckoutBillingInfo } from './checkout-billing-info';
import { CheckoutPaymentMethods } from './checkout-payment-methods';
import { useCreateOrderMutation } from 'src/store/customer/order';
import { getErrorMessage } from 'src/utils/error.message';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: ICheckoutDeliveryOption[] = [
  // { value: 0, label: 'Free', description: '5-7 days delivery' },
  { value: 0, label: 'Free', description: 'Pick up by your self' },
  { value: 1.5, label: 'Standard', description: '3-5 days delivery' },
  // { value: 20, label: 'Express', description: '2-3 days delivery' },
];

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  // {
  //   value: 'paypal',
  //   label: 'Pay with Paypal',
  //   description: 'You will be redirected to PayPal website to complete your purchase securely.',
  // },
  // {
  //   value: 'creditcard',
  //   label: 'Credit / Debit card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  // },
  { value: 'cash', label: 'Cash', description: 'Pay with cash when your order is delivered.' },
];

const CARD_OPTIONS: ICheckoutCardOption[] = [
  { value: 'visa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'visa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'mastercard', label: '**** **** **** 4545 - Cole Armstrong' },
];

// ----------------------------------------------------------------------

export type PaymentSchemaType = zod.infer<typeof PaymentSchema>;

// export const PaymentSchema = zod.object({
//   payment: zod.string().min(1, { message: 'Payment is required!' }),
//   // Not required
//   delivery: zod.number(),
//   phoneNumber: zod.string().optional(),
// });
export const PaymentSchema = zod
  .object({
    payment: zod.string().min(1, { message: 'Payment is required!' }),
    delivery: zod.number(),
    phoneNumber: zod.string().optional(),
  })
  .refine(
    (data) => {
      if (data.payment !== 'cash' && !data.phoneNumber) {
        return false;
      }
      return true;
    },
    {
      message: 'Phone number is required for mobile payments',
      path: ['phoneNumber'],
    }
  );

// ----------------------------------------------------------------------

export function CheckoutPayment() {
  const {
    loading,
    onResetCart,
    onChangeStep,
    onApplyShipping,
    state: checkoutState,
  } = useCheckoutContext();

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const defaultValues: PaymentSchemaType = {
    delivery: checkoutState.shipping,
    payment: '',
    phoneNumber: '',
  };

  const methods = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const items = checkoutState.items.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const shippingAddressId = checkoutState.billing?.id;
      if (!shippingAddressId) {
        toast.error('Shipping address is required!');
        return;
      }

      const selectedPaymentMethod = checkoutState.paymentMethods.find(
        (method) => method.paymentName === data.payment
      );
      if (!selectedPaymentMethod?.paymentName) {
        toast.error('Payment method is required!');
        return;
      }

      if (!data.phoneNumber) {
        toast.error('Phone number is required!');
        return;
      }

      const reqData = {
        items,
        shippingAddressId,
        paymentMethod: selectedPaymentMethod?.paymentName,
        ...(data.payment !== 'cash' && { senderPhone: data.phoneNumber }),
      };

      await createOrder(reqData).unwrap();
      toast.success('Order created successfully!');

      onResetCart();
      onChangeStep('next');
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <CheckoutDelivery
            name="delivery"
            onApplyShipping={onApplyShipping}
            options={DELIVERY_OPTIONS}
          />

          <CheckoutPaymentMethods
            name="payment"
            // options={{ cards: CARD_OPTIONS, payments: PAYMENT_OPTIONS }}
            options={{
              cards: [], // No card options needed for mobile payments
              payments: checkoutState.paymentMethods.map((method) => ({
                value: method.paymentName,
                label: method.paymentName,
                description: `Phone: ${method.paymentPhone}`,
              })),
            }}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={() => onChangeStep('back')}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CheckoutBillingInfo
            loading={loading}
            onChangeStep={onChangeStep}
            checkoutState={checkoutState}
          />

          <CheckoutSummary checkoutState={checkoutState} onEdit={() => onChangeStep('go', 0)} />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting || isLoading}
          >
            Complete order
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
}
