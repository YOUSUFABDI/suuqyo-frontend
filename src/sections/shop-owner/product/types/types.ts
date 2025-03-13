import { ApiResponseDT } from 'src/types/api-response';

interface Image {
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

export interface ProductResDT {
  id: string;
  userId: number;
  categoryId: number;
  name: string;
  description: string;
  content: string;
  purchasePrice: number;
  sellingPrice: number;
  discount: number;
  rate: number | null;
  quantity: number;
  model: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  category: Category;
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
