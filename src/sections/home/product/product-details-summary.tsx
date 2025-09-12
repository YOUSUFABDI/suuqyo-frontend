// import type { IProductItem } from 'src/types/product';
// import type { CheckoutContextValue, ICheckoutItem } from 'src/types/checkout';

// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';

// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Rating from '@mui/material/Rating';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import Link, { linkClasses } from '@mui/material/Link';
// import { formHelperTextClasses } from '@mui/material/FormHelperText';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

// import { fCurrency, fShortenNumber } from 'src/utils/format-number';

// import { Label } from 'src/components/label';
// import { Iconify } from 'src/components/iconify';
// import { Form, Field } from 'src/components/hook-form';
// import { ColorPicker } from 'src/components/color-utils';
// import { NumberInput } from 'src/components/number-input';
// import { Product } from './types/types';

// // ----------------------------------------------------------------------

// type Props = {
//   product: Product;
//   disableActions?: boolean;
//   items?: CheckoutContextValue['state']['items'];
//   onAddToCart?: CheckoutContextValue['onAddToCart'];
//   onSetPaymentMethods?: CheckoutContextValue['onSetPaymentMethods'];
//   onSetShopAddress?: CheckoutContextValue['onSetShopAddress'];
// };

// export function ProductDetailsSummary({
//   items,
//   product,
//   onAddToCart,
//   onSetPaymentMethods,
//   onSetShopAddress,
//   disableActions,
//   ...other
// }: Props) {
//   const router = useRouter();
//   const variants = product.variants || [];
//   const isFood = product.isFood;
//   const isFoodAvailable = product.isAvailiable;

//   // Extract unique colors and sizes
//   const uniqueColors = useMemo(
//     () => Array.from(new Map(variants.map((v) => [v.color.id, v.color])).values()),
//     [variants]
//   );

//   // State management
//   const [selectedColorId, setSelectedColorId] = useState<number | null>(
//     uniqueColors[0]?.id ?? null
//   );
//   const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
//   const available = product.quantity;

//   // Initialize quantities when product changes
//   useEffect(() => {
//     const initialQuantities: Record<string, number> = {};
//     variants.forEach((variant) => {
//       const key = `${variant.color.id}-${variant.size.id}`;
//       initialQuantities[key] = variantQuantities[key] || 0;
//     });
//     setVariantQuantities(initialQuantities);
//   }, [product.id]);

//   // Filtered variants for selected color
//   const filteredVariants = useMemo(() => {
//     if (!selectedColorId) return [];
//     return variants.filter((v) => v.color.id === selectedColorId);
//   }, [selectedColorId, variants]);

//   const { id, name, sellingPrice, description } = product;

//   const methods = useForm<Record<string, any>>({
//     defaultValues: {
//       id,
//       name,
//       quantity: 1,
//     },
//   });

//   const { handleSubmit, watch, setValue } = methods;

//   // Get variant key helper
//   const getVariantKey = useCallback(
//     (colorId: number, sizeId: number) => `${colorId}-${sizeId}`,
//     []
//   );

//   // Get grouped variants helper
//   const getGroupedVariants = useCallback((): ICheckoutItem[] => {
//     const grouped: Record<string, ICheckoutItem> = {};

//     Object.entries(variantQuantities)
//       .filter(([_, qty]) => qty > 0)
//       .forEach(([key, quantity]) => {
//         const [colorId, sizeId] = key.split('-').map(Number);
//         const variant = variants.find((v) => v.color.id === colorId && v.size.id === sizeId);

//         if (!variant) return;

//         const productKey = `${product.id}`;

//         if (!grouped[productKey]) {
//           grouped[productKey] = {
//             id: productKey,
//             name: product.name,
//             price: product.sellingPrice,
//             coverUrl: product.images[0]?.image || '',
//             available: product.quantity,
//             colors: [],
//           };
//         }

//         // Find or create the color entry
//         let colorEntry = grouped[productKey].colors.find((c) => c.id === colorId);
//         if (!colorEntry) {
//           colorEntry = {
//             id: variant.color.id,
//             name: variant.color.name,
//             code: variant.color.name,
//             sizes: [],
//           };
//           grouped[productKey].colors.push(colorEntry);
//         }

//         // Add the size to the color entry
//         colorEntry.sizes.push({
//           id: variant.size.id,
//           name: variant.size.name,
//           quantity,
//           available: variant.quantity,
//         });
//       });

//     return Object.values(grouped);
//   }, [variantQuantities, variants, product]);

//   const onSubmit = handleSubmit(async () => {
//     try {
//       let checkoutItems: ICheckoutItem[] = [];

//       const quantity = watch('quantity'); // ✅ fetch the actual selected quantity

//       const groupedVariants = getGroupedVariants();

//       if (groupedVariants.length > 0) {
//         checkoutItems = groupedVariants;
//       } else if (!product.variants || product.variants.length === 0) {
//         // Fallback for products with no variants
//         checkoutItems = [
//           {
//             id: product.id.toString(),
//             name: product.name,
//             price: product.sellingPrice,
//             coverUrl: product.images[0]?.image || '',
//             available: product.quantity,
//             colors: [
//               {
//                 id: 0,
//                 name: 'Default',
//                 code: '',
//                 sizes: [
//                   {
//                     id: 0,
//                     name: 'Default',
//                     quantity: quantity || 1,
//                     available: product.quantity,
//                   },
//                 ],
//               },
//             ],
//           },
//         ];
//       }

//       if (checkoutItems.length > 0) {
//         if (product?.user?.paymentMethods) {
//           onSetPaymentMethods?.(product.user.paymentMethods);
//         }

//         if (product?.shop?.shopAddress) {
//           onSetShopAddress?.(product.shop.shopAddress);
//         }

//         checkoutItems.forEach((item) => {
//           onAddToCart?.(item);
//         });

//         router.push(paths.customer.product.checkout);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   // Handle add to cart
//   const handleAddCart = useCallback(() => {
//     const groupedVariants = getGroupedVariants();

//     // Add to cart if variants selected
//     if (groupedVariants.length > 0) {
//       if (product?.user?.paymentMethods) {
//         onSetPaymentMethods?.(product.user.paymentMethods);
//       }

//       if (product?.shop?.shopAddress) {
//         onSetShopAddress?.(product.shop.shopAddress);
//       }

//       groupedVariants.forEach((variant) => {
//         onAddToCart?.(variant);
//       });
//     }
//   }, [getGroupedVariants, product, onSetPaymentMethods, onSetShopAddress, onAddToCart]);

//   // Render price
//   const renderPrice = () => <Box sx={{ typography: 'h5' }}>{fCurrency(sellingPrice)}</Box>;

//   // Render variant selection UI
//   const renderVariant = () => {
//     // Get total quantity for color indicator
//     const getColorQuantity = (colorId: number) => {
//       return variants
//         .filter((v) => v.color.id === colorId)
//         .reduce((sum, v) => {
//           const key = getVariantKey(v.color.id, v.size.id);
//           return sum + (variantQuantities[key] || 0);
//         }, 0);
//     };

//     return (
//       <Box>
//         <Typography variant="subtitle2">Color</Typography>

//         <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
//           {uniqueColors.map((color) => {
//             const totalQty = getColorQuantity(color.id);

//             return (
//               <Box key={color.id} sx={{ position: 'relative' }}>
//                 {totalQty > 0 && (
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       zIndex: 99,
//                       top: -6,
//                       right: -6,
//                       width: 18,
//                       height: 18,
//                       borderRadius: '50%',
//                       bgcolor: 'primary.main',
//                       color: 'white',
//                       fontSize: 12,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     {totalQty}
//                   </Box>
//                 )}

//                 <Button
//                   variant={selectedColorId === color.id ? 'contained' : 'outlined'}
//                   onClick={() => setSelectedColorId(color.id)}
//                 >
//                   {color.name}
//                 </Button>
//               </Box>
//             );
//           })}
//         </Box>

//         <Box sx={{ mt: 4 }}>
//           <Typography variant="subtitle2">Size</Typography>

//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//             {filteredVariants.map((variant) => {
//               const key = getVariantKey(variant.color.id, variant.size.id);
//               const quantity = variantQuantities[key] || 0;

//               return (
//                 <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Typography sx={{ width: 80, textTransform: 'capitalize' }}>
//                     {variant.size.name}
//                   </Typography>

//                   <NumberInput
//                     hideDivider
//                     value={quantity}
//                     onChange={(e, val) => {
//                       setVariantQuantities((prev) => ({
//                         ...prev,
//                         [key]: val,
//                       }));
//                     }}
//                     max={variant.quantity}
//                     min={0}
//                     sx={{ maxWidth: 112 }}
//                   />

//                   <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
//                     Available: {variant.quantity}
//                   </Typography>
//                 </Box>
//               );
//             })}
//           </Box>
//         </Box>
//       </Box>
//     );
//   };

//   // Render action buttons
//   const renderActions = () => {
//     // Check if any variant has quantity > 0
//     const hasSelection = Object.values(variantQuantities).some((qty) => qty > 0);
//     const isNonVariantProduct = !product.variants || product.variants.length === 0;

//     return (
//       <Box sx={{ gap: 2, display: 'flex' }}>
//         {/* <Button
//           fullWidth
//           disabled={!hasSelection || disableActions}
//           size="large"
//           color="warning"
//           variant="contained"
//           startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
//           onClick={handleAddCart}
//           sx={{ whiteSpace: 'nowrap' }}
//         >
//           Add to cart
//         </Button> */}

//         {isFood ? (
//           <Button
//             fullWidth
//             size="large"
//             type="submit"
//             variant="contained"
//             // disabled={(!hasSelection && !isNonVariantProduct) || disableActions}
//           >
//             Buy now
//           </Button>
//         ) : (
//           <Button
//             fullWidth
//             size="large"
//             type="submit"
//             variant="contained"
//             disabled={(!hasSelection && !isNonVariantProduct) || disableActions}
//           >
//             Buy now
//           </Button>
//         )}
//       </Box>
//     );
//   };

//   const renderQuantity = () => {
//     const quantity = watch('quantity'); // Watch the form quantity
//     const available = 100000;

//     return (
//       <Box sx={{ display: 'flex' }}>
//         <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
//           Quantity
//         </Typography>

//         <Stack spacing={1}>
//           <NumberInput
//             hideDivider
//             value={quantity}
//             onChange={(event, val: number) => setValue('quantity', val)}
//             max={available}
//             min={1}
//             sx={{ maxWidth: 112 }}
//           />

//           <Typography
//             variant="caption"
//             component="div"
//             sx={{ textAlign: 'right', color: 'text.secondary' }}
//           >
//             {isFoodAvailable ? 'Available now' : 'Not available'}
//           </Typography>
//         </Stack>
//       </Box>
//     );
//   };

//   // Render description
//   const renderSubDescription = () => (
//     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//       {description}
//     </Typography>
//   );

//   return (
//     <Form methods={methods} onSubmit={onSubmit}>
//       <Stack spacing={3} sx={{ pt: 3 }} {...other}>
//         <Stack spacing={2} alignItems="flex-start">
//           <Typography variant="h5">{name}</Typography>
//           {renderPrice()}
//           {renderSubDescription()}
//         </Stack>

//         <Divider sx={{ borderStyle: 'dashed' }} />

//         {!variants.length && (
//           <>
//             {renderQuantity()}
//             <Divider sx={{ borderStyle: 'dashed' }} />
//           </>
//         )}

//         {variants.length > 0 && (
//           <>
//             {renderVariant()}
//             <Divider sx={{ borderStyle: 'dashed' }} />
//           </>
//         )}

//         {renderActions()}
//       </Stack>
//     </Form>
//   );
// }
import type { CheckoutContextValue, ICheckoutItem } from 'src/types/checkout';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Form } from 'src/components/hook-form';
import { NumberInput } from 'src/components/number-input';
import { Product } from './types/types';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
  disableActions?: boolean;
  items?: CheckoutContextValue['state']['items'];
  onAddToCart?: CheckoutContextValue['onAddToCart'];
  onSetPaymentMethods?: CheckoutContextValue['onSetPaymentMethods'];
  onSetShopAddress?: CheckoutContextValue['onSetShopAddress'];
};

export function ProductDetailsSummary({
  items,
  product,
  onAddToCart,
  onSetPaymentMethods,
  onSetShopAddress,
  disableActions,
  ...other
}: Props) {
  const router = useRouter();
  const variants = product.variants || [];
  const isFood = product.isFood;
  const isFoodAvailable = product.isAvailiable;

  // Extract unique colors and sizes
  const uniqueColors = useMemo(
    () => Array.from(new Map(variants.map((v) => [v.color.id, v.color])).values()),
    [variants]
  );

  // State management
  const [selectedColorId, setSelectedColorId] = useState<number | null>(
    uniqueColors[0]?.id ?? null
  );
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
  const available = product.quantity;

  // Initialize quantities when product changes
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    variants.forEach((variant) => {
      const key = `${variant.color.id}-${variant.size.id}`;
      initialQuantities[key] = variantQuantities[key] || 0;
    });
    setVariantQuantities(initialQuantities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Filtered variants for selected color
  const filteredVariants = useMemo(() => {
    if (!selectedColorId) return [];
    return variants.filter((v) => v.color.id === selectedColorId);
  }, [selectedColorId, variants]);

  const { id, name, sellingPrice, description } = product;

  const methods = useForm<Record<string, any>>({
    defaultValues: {
      id,
      name,
      quantity: 1,
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  // Get variant key helper
  const getVariantKey = useCallback(
    (colorId: number, sizeId: number) => `${colorId}-${sizeId}`,
    []
  );

  // Get grouped variants helper
  const getGroupedVariants = useCallback((): ICheckoutItem[] => {
    const grouped: Record<string, ICheckoutItem> = {};

    Object.entries(variantQuantities)
      .filter(([_, qty]) => qty > 0)
      .forEach(([key, quantity]) => {
        const [colorId, sizeId] = key.split('-').map(Number);
        const variant = variants.find((v) => v.color.id === colorId && v.size.id === sizeId);

        if (!variant) return;

        const productKey = `${product.id}`;

        if (!grouped[productKey]) {
          grouped[productKey] = {
            id: productKey,
            name: product.name,
            price: product.sellingPrice,
            coverUrl: product.images[0]?.image || '',
            available: product.quantity,
            colors: [],
          };
        }

        // Find or create the color entry
        let colorEntry = grouped[productKey].colors.find((c) => c.id === colorId);
        if (!colorEntry) {
          colorEntry = {
            id: variant.color.id,
            name: variant.color.name,
            code: variant.color.name,
            sizes: [],
          };
          grouped[productKey].colors.push(colorEntry);
        }

        // Add the size to the color entry
        colorEntry.sizes.push({
          id: variant.size.id,
          name: variant.size.name,
          quantity,
          available: variant.quantity,
        });
      });

    return Object.values(grouped);
  }, [variantQuantities, variants, product]);

  const onSubmit = handleSubmit(async () => {
    try {
      let checkoutItems: ICheckoutItem[] = [];

      const quantity = watch('quantity'); // ✅ fetch the actual selected quantity

      const groupedVariants = getGroupedVariants();

      if (groupedVariants.length > 0) {
        checkoutItems = groupedVariants;
      } else if (!product.variants || product.variants.length === 0) {
        // Fallback for products with no variants
        checkoutItems = [
          {
            id: product.id.toString(),
            name: product.name,
            price: product.sellingPrice,
            coverUrl: product.images[0]?.image || '',
            available: product.quantity,
            colors: [
              {
                id: 0,
                name: 'Default',
                code: '',
                sizes: [
                  {
                    id: 0,
                    name: 'Default',
                    quantity: quantity || 1,
                    available: product.quantity,
                  },
                ],
              },
            ],
          },
        ];
      }

      if (checkoutItems.length > 0) {
        if (product?.user?.paymentMethods) {
          onSetPaymentMethods?.(product.user.paymentMethods);
        }

        if (product?.shop?.shopAddress) {
          onSetShopAddress?.(product.shop.shopAddress);
        }

        checkoutItems.forEach((item) => {
          onAddToCart?.(item);
        });

        router.push(paths.customer.product.checkout);
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Render price
  const renderPrice = () => <Box sx={{ typography: 'h5' }}>${sellingPrice}</Box>;

  // Render variant selection UI
  const renderVariant = () => {
    // Get total quantity for color indicator
    const getColorQuantity = (colorId: number) => {
      return variants
        .filter((v) => v.color.id === colorId)
        .reduce((sum, v) => {
          const key = getVariantKey(v.color.id, v.size.id);
          return sum + (variantQuantities[key] || 0);
        }, 0);
    };

    return (
      <Box>
        <Typography variant="subtitle2">Color</Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {uniqueColors.map((color) => {
            const totalQty = getColorQuantity(color.id);

            return (
              <Box key={color.id} sx={{ position: 'relative' }}>
                {totalQty > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 99,
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {totalQty}
                  </Box>
                )}

                <Button
                  variant={selectedColorId === color.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedColorId(color.id)}
                >
                  {color.name}
                </Button>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2">Size</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {filteredVariants.map((variant) => {
              const key = getVariantKey(variant.color.id, variant.size.id);
              const quantity = variantQuantities[key] || 0;

              return (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 80, textTransform: 'capitalize' }}>
                    {variant.size.name}
                  </Typography>

                  <NumberInput
                    hideDivider
                    value={quantity}
                    onChange={(e, val) => {
                      setVariantQuantities((prev) => ({
                        ...prev,
                        [key]: val,
                      }));
                    }}
                    max={variant.quantity}
                    min={0}
                    sx={{ maxWidth: 112 }}
                  />

                  <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                    Available: {variant.quantity}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  };

  // Render action buttons
  const renderActions = () => {
    // Check if any variant has quantity > 0
    const hasSelection = Object.values(variantQuantities).some((qty) => qty > 0);
    const isNonVariantProduct = !product.variants || product.variants.length === 0;

    return (
      <Box sx={{ gap: 2, display: 'flex' }}>
        {/* <Button
          fullWidth
          disabled={!hasSelection || disableActions}
          size="large"
          color="warning"
          variant="contained"
          startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
          onClick={handleAddCart}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Add to cart
        </Button> */}

        {isFood ? (
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            // [!code focus:2]
            // THIS IS THE FIX: Disable button if food is not available or actions are globally disabled
            disabled={!isFoodAvailable}
          >
            Buy now
          </Button>
        ) : (
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={(!hasSelection && !isNonVariantProduct) || disableActions}
          >
            Buy now
          </Button>
        )}
      </Box>
    );
  };

  const renderQuantity = () => {
    const quantity = watch('quantity'); // Watch the form quantity
    const available = isFood ? (isFoodAvailable ? 100000 : 0) : product.quantity;

    return (
      <Box sx={{ display: 'flex' }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Quantity
        </Typography>

        <Stack spacing={1}>
          <NumberInput
            hideDivider
            value={quantity}
            onChange={(event, val: number) => setValue('quantity', val)}
            max={available}
            min={1}
            sx={{ maxWidth: 112 }}
          />

          <Typography
            variant="caption"
            component="div"
            sx={{ textAlign: 'right', color: 'text.secondary' }}
          >
            {isFood
              ? isFoodAvailable
                ? 'Available now'
                : 'Not available'
              : `Available: ${available}`}
          </Typography>
        </Stack>
      </Box>
    );
  };

  // Render description
  const renderSubDescription = () => (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {description}
    </Typography>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h5">{name}</Typography>
          {renderPrice()}
          {renderSubDescription()}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {!variants.length && (
          <>
            {renderQuantity()}
            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        {variants.length > 0 && (
          <>
            {renderVariant()}
            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        {renderActions()}
      </Stack>
    </Form>
  );
}
