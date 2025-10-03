import { ProductResponse } from 'src/sections/home/product/types/types';
import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  sizes: string[];
  publish: string;
  gender: string[];
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  createdAt: IDateValue;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  newLabel: {
    content: string;
    enabled: boolean;
  };
  saleLabel: {
    content: string;
    enabled: boolean;
  };
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
};

export type PaginatedProductsPayload = {
  result: number;
  data: ProductResponse[];
  total: number;
  page: number;
  limit: number;
};

// Define the query arguments
export type GetAllProductsArgs = {
  page: number;
  limit: number;
};

export type UseAllProductParams = {
  page: number;
  limit: number;
};
