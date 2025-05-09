export type ShopDT = {
  id: string;
  userId: number;
  shopName: string;
  shopLogo: string;
  shopAddress: string;
  createdAt: string;
  updatedAt: string;
  shopDescription: string;
};

// .

export type ProductImage = {
  id: number;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  content: string;
  purchasePrice: number | null;
  sellingPrice: number;
  discount: number | null;
  rate: number | null;
  model: string;
  condition: 'USED' | 'BRAND_NEW';
  quantity: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
};

export type PaymentMethodOfShopDT = {
  id: string;
  paymentName: string;
  paymentPhone: string;
};

export type ShopInfoDT = {
  id: number;
  shopName: string;
  shopLogo: string;
  shopAddress: string;
  shopDescription: string;
  businessProof: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: boolean;
    profileImage: string;
    Product: Product[];
    PaymentMethodOfShop: PaymentMethodOfShopDT[];
  };
};
