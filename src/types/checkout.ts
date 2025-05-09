import { AddressDT } from 'src/sections/home/address/types/types';
import { PaymentMethodOfShopDT } from 'src/sections/home/shop/types/types';

// ----------------------------------------------------------------------

export type ICheckoutItem = {
  id: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
  available: number;
  subtotal?: number;
};

export type ICheckoutDeliveryOption = {
  label: string;
  value: number;
  description: string;
};

export type ICheckoutPaymentOption = {
  value: string;
  label: string;
  description: string;
};

export type ICheckoutCardOption = {
  value: string;
  label: string;
};

export type ICheckoutState = {
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  totalItems: number;
  items: ICheckoutItem[];
  paymentMethods: PaymentMethodOfShopDT[];
  billing: AddressDT | null;
};

export type CheckoutContextValue = {
  loading: boolean;
  completed: boolean;
  canReset: boolean;
  /********/
  state: ICheckoutState;
  setState: (updateValue: Partial<ICheckoutState>) => void;
  setField: (name: keyof ICheckoutState, updateValue: ICheckoutState[keyof ICheckoutState]) => void;
  /********/
  steps: string[];
  activeStep: number | null;
  onChangeStep: (type: 'back' | 'next' | 'go', step?: number) => void;
  /********/
  onChangeItemQuantity: (itemId: string, quantity: number) => void;
  /********/
  onResetCart: () => void;
  onAddToCart: (newItem: ICheckoutItem) => void;
  onDeleteCartItem: (itemId: string) => void;
  onApplyDiscount: (discount: number) => void;
  onApplyShipping: (discount: number) => void;
  onCreateBillingAddress: (address: AddressDT) => void;
  onSetPaymentMethods: (methods: PaymentMethodOfShopDT[]) => void;
};
