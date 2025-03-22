export type IDeliveryUserTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

export interface DeliveryUserResDT {
  id: string;
  userId: string;
  shopOwnerId: string;
  availability: boolean;
  vehicleDetail: string;
  user: UserDT;
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

export interface UserDT {
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
  Address?: Address;
  createdAt: Date;
  updatedAt: Date;
}
