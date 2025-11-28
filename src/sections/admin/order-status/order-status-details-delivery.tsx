// import Box from '@mui/material/Box';
// import CardHeader from '@mui/material/CardHeader';
// import Link from '@mui/material/Link';
// import Stack from '@mui/material/Stack';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { Autocomplete, TextField } from '@mui/material';
// import { useState } from 'react';
// import { UseActiveDeliveryUsers } from '../delivery-user/hooks/use-active-delivery-users';
// import { DeliveryUserResDT } from '../delivery-user/types/types';
// import { DeliveryUserDT } from './types/types';
// import { useAssignDeliveryUserMutation } from 'src/store/shop-owner/order';
// import { getErrorMessage } from 'src/utils/error.message';
// import { toast } from 'src/components/snackbar';

// // ----------------------------------------------------------------------

// type Props = {
//   delivery?: DeliveryUserDT;
//   orderId?: number;
//   onAssignmentSuccess?: () => void;
// };

// export function OrderStatusDetailsDelivery({ delivery, orderId, onAssignmentSuccess }: Props) {
//   const { deliveryUsers } = UseActiveDeliveryUsers();
//   const [selectedDeliveryUser, setSelectedDeliveryUser] = useState<DeliveryUserResDT | null>(null);
//   const [assignDelivery, { isLoading }] = useAssignDeliveryUserMutation();

//   const handleAssignment = async () => {
//     if (!orderId || !selectedDeliveryUser?.id) {
//       toast.error('Please select a delivery user');
//       return;
//     }

//     try {
//       await assignDelivery({
//         id: orderId,
//         deliveryUserId: Number(selectedDeliveryUser.id),
//       }).unwrap();

//       toast.success('Assigned.');
//       setSelectedDeliveryUser(null);
//       onAssignmentSuccess?.();
//     } catch (error) {
//       console.error(error);
//       const errorMessage = getErrorMessage(error);
//       toast.error(errorMessage || 'Failed to assign delivery user');
//     }
//   };

//   return (
//     <>
//       <CardHeader title="Delivery" />
//       <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Autocomplete
//             fullWidth
//             disabled={!orderId}
//             options={deliveryUsers}
//             getOptionLabel={(option) =>
//               `${option.user?.fullName || 'Unnamed'} (${option.user?.phoneNumber || 'No Phone'})`
//             }
//             filterOptions={(options, state) =>
//               options.filter(
//                 (option) =>
//                   option.user.fullName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
//                   option.user.phoneNumber?.toLowerCase().includes(state.inputValue.toLowerCase())
//               )
//             }
//             value={selectedDeliveryUser}
//             onChange={(_, newValue) => setSelectedDeliveryUser(newValue)}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search Delivery Users"
//                 placeholder="Select delivery agent"
//               />
//             )}
//             renderOption={(props, option) => (
//               <li {...props} key={option.id}>
//                 {option.user.fullName} ({option.user.phoneNumber})
//               </li>
//             )}
//           />
//           <LoadingButton
//             variant="contained"
//             onClick={handleAssignment}
//             loading={isLoading}
//             disabled={!selectedDeliveryUser || !orderId}
//           >
//             Assign
//           </LoadingButton>
//         </Box>

//         {/* {(selectedDeliveryUser || delivery) && ( */}
//         <Box sx={{ mt: 2 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
//               Name
//             </Box>
//             {selectedDeliveryUser?.user.fullName || delivery?.user?.fullName}
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
//               Phone no
//             </Box>
//             <Link
//               href={`tel:${selectedDeliveryUser?.user.phoneNumber || delivery?.user?.phoneNumber}`}
//               underline="always"
//             >
//               {selectedDeliveryUser?.user.phoneNumber || delivery?.user?.phoneNumber}
//             </Link>
//           </Box>
//         </Box>
//         {/* )} */}
//       </Stack>
//     </>
//   );
// }
