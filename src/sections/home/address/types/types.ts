export type AddressDT = {
  id?: number;
  country: string;
  city: string;
  state: string;
  address: string;
  deliveryAddress: string;
  phoneNumber: string;
  fullName: string;

  primary?: boolean;
  company?: string;
  addressType?: string;
  name?: string;
  fullAddress?: string;
};
