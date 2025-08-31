import { ApiResponseDT } from 'src/types/api-response';

export interface Image {
  id: number;
  productId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: number;
  colorId: number;
  sizeId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productId: number;
  color: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  size: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProductResDT {
  id: string;
  userId: number;
  categoryId: number;
  name: string;
  description: string;
  returnPolicy?: string;
  content: string;
  sellingPrice: number;
  purchasePrice: number;
  discount: number;
  rate: number | null;
  quantity: number;
  condition: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  category: Category;
  isFood: boolean;
  isAvailiable: boolean;
  variants?: Variant[];
}

export interface VariantOptionDT {
  id: number;
  name: string;
}

export type IProductTableFilters = {
  stock: string[];
};

export type CreatProductReqDT = {
  createProductDto: string;
  images?: File;
};

export type CreateProductResDT = ApiResponseDT<{
  data: ProductResDT;
}>;

export type UpdatedProductResDT = ApiResponseDT<{
  data: ProductResDT;
}>;

export type CategoryDT = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export interface VariantOptionDT {
  id: number;
  name: string;
}

export type VariantsDT = {
  colors: VariantOptionDT[];
  sizes: VariantOptionDT[];
};
