import { AddressDT } from 'src/sections/home/address/types/types';
import { PaymentMethod } from 'src/sections/home/product/types/types';

// ----------------------------------------------------------------------

export type ICheckoutItem = {
  id: string;
  name: string;
  price: number;
  coverUrl: string;
  available: number;
  subtotal?: number;
  colors: Array<{
    // Changed from single color to array of colors
    id?: number;
    name: string;
    code?: string;
    sizes: Array<{
      // Moved sizes inside color object
      id?: number;
      name: string;
      quantity: number;
      available: number;
    }>;
  }>;
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
  paymentMethods: PaymentMethod[];
  billing: AddressDT | null;
  shopAddress?: string;
  shopPhone?: string;
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
  onSetPaymentMethods: (methods: PaymentMethod[]) => void;
  onSetShopAddress: (address: string) => void;
  onSetShopPhone: (phone: string) => void;
};
