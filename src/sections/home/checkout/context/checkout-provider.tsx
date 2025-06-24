'use client';

import type { ICheckoutItem, ICheckoutState } from 'src/types/checkout';

import { isEqual } from 'es-toolkit';
import { useLocalStorage } from 'minimal-shared/hooks';
import { getStorage } from 'minimal-shared/utils';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { SplashScreen } from 'src/components/loading-screen';

import { AddressDT } from '../../address/types/types';
import { CheckoutContext } from './checkout-context';
import { PaymentMethod } from '../../product/types/types';

// ----------------------------------------------------------------------

const CHECKOUT_STORAGE_KEY = 'app-checkout';
const CHECKOUT_STEPS = ['Cart', 'Billing & address', 'Payment'];

const initialState: ICheckoutState = {
  items: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
  paymentMethods: [],
  shopAddress: '',
};

// ----------------------------------------------------------------------

type CheckoutProviderProps = {
  children: React.ReactNode;
};

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <CheckoutContainer>{children}</CheckoutContainer>
    </Suspense>
  );
}

// ----------------------------------------------------------------------

function CheckoutContainer({ children }: CheckoutProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStep = pathname.includes(paths.customer.product.checkout)
    ? Number(searchParams.get('step'))
    : null;

  const [loading, setLoading] = useState(true);

  const { state, setState, setField, resetState } = useLocalStorage<ICheckoutState>(
    CHECKOUT_STORAGE_KEY,
    initialState,
    { initializeWithValue: false }
  );

  const canReset = !isEqual(state, initialState);
  const completed = activeStep === CHECKOUT_STEPS.length;

  const updateTotals = useCallback(() => {
    // Calculate total items by summing all sizes' quantities across all colors
    const totalItems = state.items.reduce((total, item) => {
      return (
        total +
        item?.colors?.reduce((colorSum, color) => {
          return colorSum + color.sizes.reduce((sizeSum, size) => sizeSum + size.quantity, 0);
        }, 0)
      );
    }, 0);

    // Calculate subtotal by summing (price * size quantity) for all items
    const subtotal = state.items.reduce((total, item) => {
      const itemTotal = item?.colors?.reduce((colorSum, color) => {
        return (
          colorSum + color.sizes.reduce((sizeSum, size) => sizeSum + size.quantity * item.price, 0)
        );
      }, 0);
      return total + itemTotal;
    }, 0);

    setField('subtotal', subtotal);
    setField('totalItems', totalItems);
    setField('total', subtotal - state.discount + state.shipping);
  }, [setField, state.discount, state.items, state.shipping]);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        const restoredValue = getStorage(CHECKOUT_STORAGE_KEY);
        if (restoredValue) {
          updateTotals();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [updateTotals]);

  const onChangeStep = useCallback(
    (type: 'back' | 'next' | 'go', step?: number) => {
      const stepNumbers = {
        back: (activeStep ?? 0) - 1,
        next: (activeStep ?? 0) + 1,
        go: step ?? 0,
      };

      const targetStep = stepNumbers[type];
      const queryString = new URLSearchParams({ step: `${targetStep}` }).toString();
      const redirectPath =
        targetStep === 0
          ? paths.customer.product.checkout
          : `${paths.customer.product.checkout}?${queryString}`;

      router.push(redirectPath);
    },
    [activeStep, router]
  );

  const onSetShopAddress = useCallback(
    (address: string) => {
      setField('shopAddress', address);
    },
    [setField]
  );

  const onAddToCart = useCallback(
    (newItem: ICheckoutItem) => {
      // Find if there's an existing item with the same ID
      const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex !== -1) {
        // Merge new colors with existing ones
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];

        // Create a map of existing colors for quick lookup
        const colorMap = new Map();
        existingItem.colors.forEach((color) => {
          colorMap.set(color.id, color);
        });

        // Merge new colors with existing ones
        const mergedColors = newItem.colors.map((newColor) => {
          const existingColor = colorMap.get(newColor.id);
          if (!existingColor) return newColor;

          // Merge sizes within the color
          const sizeMap = new Map();
          existingColor.sizes.forEach(
            (size: { id?: number; name: string; quantity: number; available: number }) => {
              sizeMap.set(size.id, size);
            }
          );

          const mergedSizes = newColor.sizes.map((newSize) => {
            const existingSize = sizeMap.get(newSize.id);
            return existingSize
              ? { ...existingSize, quantity: existingSize.quantity + newSize.quantity }
              : newSize;
          });

          // Add sizes that didn't exist before
          existingColor.sizes.forEach(
            (existingSize: { id?: number; name: string; quantity: number; available: number }) => {
              if (!sizeMap.has(existingSize.id)) {
                mergedSizes.push(existingSize);
              }
            }
          );

          return {
            ...existingColor,
            sizes: mergedSizes,
          };
        });

        // Add colors that didn't exist before
        existingItem.colors.forEach((existingColor) => {
          if (!colorMap.has(existingColor.id)) {
            mergedColors.push(existingColor);
          }
        });

        updatedItems[existingItemIndex] = {
          ...existingItem,
          colors: mergedColors,
        };

        setField('items', updatedItems);
      } else {
        // Add as new item
        setField('items', [...state.items, newItem]);
      }
    },
    [setField, state.items]
  );

  const onSetPaymentMethods = useCallback(
    (methods: PaymentMethod[]) => {
      setField('paymentMethods', methods);
    },
    [setField]
  );

  const onDeleteCartItem = useCallback(
    (itemId: string) => {
      const updatedItems = state.items.filter((item) => item.id !== itemId);
      setField('items', updatedItems);
    },
    [setField, state.items]
  );

  const onChangeItemQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const [productId, colorId, sizeId] = itemId.split('-');

      const updatedItems = state.items.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            colors: item.colors.map((color) => {
              if (color.id === parseInt(colorId)) {
                return {
                  ...color,
                  sizes: color.sizes.map((size) =>
                    size.id === parseInt(sizeId) ? { ...size, quantity } : size
                  ),
                };
              }
              return color;
            }),
          };
        }
        return item;
      });

      setField('items', updatedItems);
    },
    [setField, state.items]
  );

  const onCreateBillingAddress = useCallback(
    (address: AddressDT) => {
      setField('billing', address);
    },
    [setField]
  );

  const onApplyDiscount = useCallback(
    (discount: number) => {
      setField('discount', discount);
    },
    [setField]
  );

  const onApplyShipping = useCallback(
    (shipping: number) => {
      setField('shipping', shipping);
    },
    [setField]
  );

  const onResetCart = useCallback(() => {
    if (completed) {
      resetState(initialState);
    }
  }, [completed, resetState]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      /********/
      activeStep,
      onChangeStep,
      steps: CHECKOUT_STEPS,
      /********/
      canReset,
      loading,
      completed,
      /********/
      onAddToCart,
      onResetCart,
      onApplyDiscount,
      onApplyShipping,
      onDeleteCartItem,
      onChangeItemQuantity,
      onCreateBillingAddress,
      onSetPaymentMethods,
      onSetShopAddress,
    }),
    [
      state,
      loading,
      canReset,
      setField,
      setState,
      completed,
      activeStep,
      onResetCart,
      onAddToCart,
      onChangeStep,
      onApplyDiscount,
      onApplyShipping,
      onDeleteCartItem,
      onChangeItemQuantity,
      onCreateBillingAddress,
      onSetPaymentMethods,
      onSetShopAddress,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}
