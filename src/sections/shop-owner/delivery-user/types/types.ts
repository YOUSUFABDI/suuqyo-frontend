export type IDeliveryUserTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

interface DeliveryUser {
  id: string;
  userId: string;
  availability: boolean;
  vehicleDetail: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  id: string;
  userId: string;
  address: string;
  city: string;
  country: string;
  state: string;
}

export interface DeliveryUserResDT {
  id: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  email: string;
  sex: string;
  password: string;
  profileImage: string;
  role: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  DeliveryUser?: DeliveryUser;
  Address?: Address;
}
